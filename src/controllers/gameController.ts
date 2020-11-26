import { Request, Response } from 'express';
import Game from '../model/game';


export const createGame = async (req: Request, res:Response):Promise<Response> =>{
    try{
        const game = await Game.create({
            theme:req.body.theme,
            players:req.body.players,
            questions: req.body.questions
        });
        return res.status(201).send(game)
    }catch(err){
        return res.status(500).send(err)
    }
}

export const getAllGames = async (req:Request, res:Response):Promise<Response> => {
    try{
        const games = await Game.find({});
            res.status(200).json({
                data: games
            });
        }catch(err){
            return res.status(500).send(err)
        }
   }
   
   export const getOneGame = async (req:Request, res:Response):Promise<Response> => {
        try {
        const gameId = req.params.gameId;
        const game = await Game.findById(gameId);
        if (!game){
            return res.status(404).send('game not found')
        } 
        res.status(200).json({
        data: game
        });
        } catch (err) {
            return res.status(500).send(err)
        }
   }

   export const updateGame = async (req:Request, res:Response):Promise<Response> => {
        try {
            const update = req.body
            const gameId = req.params.gameId;
            await Game.findByIdAndUpdate(gameId, update);
            const game = await Game.findById(gameId)
            res.status(200).json({
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
        if(game == null){
            return res.status(404).send(({
                error: 'not_found',
                error_description: 'game not found'
            }));
        }
        return res.status(204).send();
       }catch(err){
            return res.status(500).send(err)
       }
   }