import { Request, Response } from 'express';
import Game from '../model/game';
import Question from '../model/question';
import User from '../model/user';
import { ErrorResponse } from '../util/errors';

export const createGame = async (req: Request, res:Response): Promise<Response> => {
    try {
        const questions = await Question.find(); // TODO Filtrer les questions par thème et limiter à 10 ou 15
        const game = await Game.create({
            theme: req.body.theme,
            players: req.body.players, // TODO Supprimer cette ligne car les joueurs arriveront avec un code généré
            questions: questions.map(question => question.id)
        });
        return res.status(201).send({ game });
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}

export const getAllGames = async (req: Request, res: Response): Promise<Response> => {
    try {
        return res.status(200).json(await Game.find());
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}

export const getOneGame = async (req: Request, res: Response): Promise<Response> => {
    try {
        const game = await Game.findById(req.params.gameId);
        if (game == null) {
            return res.status(404).send({ error: 'not_found', error_description: 'Game not found' } as ErrorResponse);
        }
        return res.status(200).json({ game });
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}

export const updateGame = async (req: Request, res: Response):Promise<Response> => {
    try {
        const game = await Game.findByIdAndUpdate(req.params.gameId, req.body);
        return res.status(200).json({ game });
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}
export const deleteGame = async (req: Request, res: Response): Promise<Response> => {
    try{
        const game = await Game.findByIdAndDelete(req.params.gameId);
        if (game == null) {
            return res.status(404).send(({ error: 'not_found', error_description: 'Game not found' } as ErrorResponse));
        }
        return res.status(204).send();
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}

export const answer = async (req: Request, res: Response): Promise<Response> => {
    try {
        const game = await Game.findById(req.params.gameId).populate('players').populate('questions.target').populate('questions.history.user');
        if (game == null) {
            return res.status(404).send(({ error: 'not_found', error_description: 'Game not found' } as ErrorResponse));
        }
        const player = await User.findById(req.body.player);
        if (player == null) {
            return res.status(404).send(({ error: 'not_found', error_description: 'User not found' } as ErrorResponse));
        }
        if (!game.players.map(player => player.id).includes(player.id)) {
            return res.status(404).send(({ error: 'not_found', error_description: 'User not found in this game' } as ErrorResponse));
        }
        const question = await Question.findById(req.body.question);
        if (question == null) {
            return res.status(404).send(({ error: 'not_found', error_description: 'Question not found' } as ErrorResponse));
        }
        if (!game.questions.map(question => question.target.id).includes(question.id)) {
            return res.status(404).send(({ error: 'not_found', error_description: 'Question not found in this game' } as ErrorResponse));
        }
        const choiceLabel = req.body.choice;
        if (!question.choices.map(choice => choice.label).includes(choiceLabel)) {
            return res.status(404).send(({ error: 'not_found', error_description: 'Choice not found in this question' } as ErrorResponse));
        }
        const history = game.questions.find(currentQuestion => currentQuestion.target.id === question.id).history;
        if (history.some(historyPart => historyPart.user.id === player.id)) {
            return res.status(403).send(({ error: 'forbidden', error_description: 'This player has already answered' } as ErrorResponse));
        }
        history.push({
            user: player,
            correct: question.choices.find(currentChoice => currentChoice.correct).label === choiceLabel,
            time: 0 // TODO Temps passé sur la question
        });
        await game.save();
        res.status(200).json({ game });
    } catch (err){
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
   }
}
