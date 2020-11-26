import { Request, Response, NextFunction } from 'express';
import Theme from '../model/theme';

export const createTheme = async (req: Request, res:Response):Promise<Response> =>{
    try{
        const theme = await Theme.create({
            name:req.body.name
        });
        return res.status(201).send(theme)
    }catch(err){
        return err
    }
}

export const getThemes = async (req:Request, res:Response):Promise<Response> => {
    try{
        const themes = await Theme.find({});
            res.status(200).json({
                data: themes
            });
        }catch(err){
            return res.status(500).send(err)
        }
   }
   
   export const getOneTheme = async (req:Request, res:Response):Promise<Response> => {
        try {
        const themeId = req.params.themeId;
        const theme = await Theme.findById(themeId);
        if (!theme){
            return res.status(404).send('Theme not found')
        } 
        res.status(200).json({
        data: theme
        });
        } catch (err) {
            return res.status(500).send(err)
        }
   }

   export const updateTheme = async (req:Request, res:Response):Promise<Response> => {
        try {
            const update = req.body
            const themeId = req.params.themeId;
            await Theme.findByIdAndUpdate(themeId, update);
            const user = await Theme.findById(themeId)
            res.status(200).json({
            data: user,
            message: 'Theme has been updated'
            });
        } catch (err) {
            return res.status(500).send(err)
        }
   }

   export const deleteTheme = async (req:Request, res: Response):Promise<Response>=>{
       try{
        const themeId = req.params.themeId;
        const theme = await Theme.findByIdAndDelete(themeId);
        if(theme == null){
            return res.status(404).send(({
                error: 'not_found',
                error_description: 'Theme not found'
            }));
        }
        return res.status(204).send();
       }catch(err){
            return res.status(500).send(err)
       }
   }