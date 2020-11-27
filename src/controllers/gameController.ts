import { Request, Response } from 'express';
import Game from '../model/game';
import Question from '../model/question';
import User from '../model/user';

export const createGame = async (req: Request, res:Response): Promise<Response> =>{
    try {
        const questions = await Question.find(); // TODO Filtrer les questions par thème et limiter à 10 ou 15
        const game = await Game.create({
            theme: req.body.theme,
            players: req.body.players,
            questions: questions.map(question => {
                return {
                    target: question.id
                }
            })
        });
        return res.status(201).send(game)
    } catch (err) {
        return res.status(500).send(err)
    }
}

export const getAllGames = async (req:Request, res:Response): Promise<Response> => {
    try {
        const games = await Game.find({});
        return res.status(200).json({
            data: games
        });
    } catch (err){
        return res.status(500).send(err)
    }
}

export const getOneGame = async (req:Request, res:Response): Promise<Response> => {
    try {
        const gameId = req.params.gameId;
        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).send('game not found')
        }
        return res.status(200).json({
            data: game
        });
    } catch (err) {
        return res.status(500).send(err)
    }
}
export const updateGame = async (req:Request, res:Response):Promise<Response> => {
    try {
        const update = req.body;
        const gameId = req.params.gameId;
        const game = await Game.findByIdAndUpdate(gameId, update);
        return res.status(200).json({
            data: game,
            message: 'game has been updated'
        });
    } catch (err) {
        return res.status(500).send(err)
    }
}
export const deleteGame = async (req:Request, res: Response):Promise<Response>=>{
    try{
        const gameId = req.params.gameId;
        const game = await Game.findByIdAndDelete(gameId);
        if (game == null){
            return res.status(404).send(({
                error: 'not_found',
                error_description: 'game not found'
            }));
        }
        return res.status(204).send();
    } catch (err){
         return res.status(500).send(err)
    }
}

export const answer = async (req: Request, res: Response): Promise<Response> => {
    try {
        const game = await Game.findById(req.params.gameId).populate('players').populate('questions.target').populate('questions.history.user');
        if (game == null) {
            return res.status(404).send(({
                error: 'not_found',
                error_description: 'game not found'
            }));
        }
        const player = await User.findById(req.body.player);
        if (player == null) {
            return res.status(404).send(({
                error: 'not_found',
                error_description: 'User not found'
            }));
        }
        if (!game.players.map(player => player.id).includes(player.id)) {
            return res.status(404).send(({
                error: 'not_found',
                error_description: 'User not found in this game'
            }));
        }
        const question = await Question.findById(req.body.question);
        if (question == null) {
            return res.status(404).send(({
                error: 'not_found',
                error_description: 'Question not found'
            }));
        }
        if (!game.questions.map(question => question.target.id).includes(question.id)) {
            return res.status(404).send(({
                error: 'not_found',
                error_description: 'Question not found in this game'
            }));
        }
        const choiceLabel = req.body.choice;
        if (!question.choices.map(choice => choice.label).includes(choiceLabel)) {
            return res.status(404).send(({
                error: 'not_found',
                error_description: 'Choice not found in this question'
            }));
        }
        const history = game.questions.find(currentQuestion => currentQuestion.target.id === question.id).history;
        if (history.some(historyPart => historyPart.user.id === player.id)) {
            return res.status(403).send(({
                error: 'forbidden',
                error_description: 'This player has already answered'
            }));
        }
        history.push({
            user: player,
            correct: question.choices.find(currentChoice => currentChoice.correct).label === choiceLabel,
            time: 0 // TODO Temps passé sur la question
        });
        await game.save();
        res.status(200).json({
            data: game,
            message: 'game has been updated'
        });
    } catch (err){
        return res.status(500).send(err)
   }
}
