import { Request, Response, NextFunction } from 'express';
import Theme from '../model/theme';

export const createTheme = async (req: Request, res:Response) =>{
    try{
        const theme = await Theme.create({
            name:req.body.name
        });
        return res.status(201).send(theme)
    }catch(err){
        return err
    }
}

export const getThemes = async (req:Request, res:Response) => {
    try{
        const themes = await Theme.find({});
            res.status(200).json({
                data: themes
            });
        }catch(err){
            return res.status(500).send(err)
        }
   }
   
   export const getOneTheme = async (req:Request, res:Response, next:NextFunction) => {
        try {
        const themeId = req.params.themeId;
        const theme = await Theme.findById(themeId);
        if (!theme) return next(new Error('Theme does not exist'));
        res.status(200).json({
        data: theme
        });
        } catch (err) {
            return res.status(500).send(err)
        }
   }

   export const updateTheme = async (req:Request, res:Response) => {
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

   export const deleteTheme = async (req:Request, res: Response)=>{
       try{
        const themeId = req.params.themeId;
        await Theme.findByIdAndDelete(themeId);
        res.status(204).json({
         data: null,
         message: ' Theme has been deleted'
        });
       }catch(err){
            return res.status(500).send(err)
       }
   }