import { Request, Response } from 'express';
import Game from '../model/game';
import Image from '../model/image';
import Question from '../model/question';
import Theme from '../model/theme';
import User from '../model/user';
import { formatErrors, formatServerError, translateMongooseValidationError } from '../util/errors';
import _ from 'lodash';

export const createGame = async (req: Request, res:Response): Promise<Response> => {
    try {
        const questions = await Question.find({ theme: await Theme.findById(req.body.theme) }).limit(10);
        const images = await Image.find({ theme: req.body.theme });
        const game = await Game.create({
            theme: req.body.theme,
            players: [req.body.author],
            questions: questions.map(question => ({
                target: question.id
            })),
            image: images[_.random(0, images.length)].id
        });
        return res.status(201).send({ game });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).send(formatErrors(...translateMongooseValidationError(err)));
        }
        return res.status(500).send(formatServerError());
    }
}

export const getAllGames = async (req: Request, res: Response): Promise<Response> => {
    try {
        return res.status(200).send({ games: await Game.find().populate('theme').populate('players').populate('questions.target').populate('questions.history.user') });
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}

export const getOneGame = async (req: Request, res: Response): Promise<Response> => {
    try {
        const game = await Game.findById(req.params.gameId).populate('theme').populate('players').populate('questions.target').populate('questions.history.user');
        if (game == null) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'Game not found' }));
        }
        return res.status(200).send({ game });
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}

export const updateGame = async (req: Request, res: Response):Promise<Response> => {
    try {
        const game = await Game.findByIdAndUpdate(req.params.gameId, req.body);
        return res.status(200).send({ game });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).send(formatErrors(...translateMongooseValidationError(err)));
        }
        return res.status(500).send(formatServerError());
    }
}
export const deleteGame = async (req: Request, res: Response): Promise<Response> => {
    try{
        const game = await Game.findByIdAndDelete(req.params.gameId);
        if (game == null) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'Game not found' }));
        }
        return res.status(204).send();
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}

export const answer = async (req: Request, res: Response): Promise<Response> => {
    try {
        const game = await Game.findById(req.params.gameId).populate('players').populate('questions.target').populate('questions.history.user');
        if (game == null) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'Game not found' }));
        }
        const player = await User.findById(req.body.player);
        if (player == null) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'User not found' }));
        }
        if (!game.players.map(player => player.id).includes(player.id)) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'User not found in this game' }));
        }
        const question = await Question.findById(req.body.question);
        if (question == null) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'Question not found' }));
        }
        if (!game.questions.map(question => question.target.id).includes(question.id)) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'Question not found in this game' }));
        }
        const choiceLabel = req.body.choice;
        if (!question.choices.map(choice => choice.label).includes(choiceLabel)) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'Choice not found in this question' }));
        }
        const history = game.questions.find(currentQuestion => currentQuestion.target.id === question.id).history;
        if (history.some(historyPart => historyPart.user.id === player.id)) {
            return res.status(403).send(formatErrors({ error: 'forbidden', error_description: 'This player has already answered' }));
        }
        history.push({
            user: player,
            correct: question.choices.find(currentChoice => currentChoice.correct).label === choiceLabel,
            time: 0 // TODO Temps passé sur la question
        });
        await game.save();
        res.status(200).send({ game });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).send(formatErrors(...translateMongooseValidationError(err)));
        }
        return res.status(500).send(formatServerError());
   }
}
