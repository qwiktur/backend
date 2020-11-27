import { Request, Response } from 'express';
import Image from '../model/image';

export const createImage = async (req: Request, res:Response):Promise<Response> =>{
    try{
        const image = await Image.create({
            src:req.body.src,
            title:req.body.title,
            theme:req.body.theme
        });
        return res.status(201).send(image)
    }catch(err){
        return res.status(500).send(err)
    }
}

export const getImages = async (req:Request, res:Response):Promise<Response> => {
    try{
        const images = await Image.find({});
            res.status(200).json({
                data: images
            });
        }catch(err){
            return res.status(500).send(err)
        }
   }
   
   export const getOneImage = async (req:Request, res:Response):Promise<Response> => {
        try {
        const imageId = req.params.imageId;
        const image = await Image.findById(imageId);
        if (!image){
            return res.status(404).send('image not found')
        } 
        res.status(200).json({
        data: image
        });
        } catch (err) {
            return res.status(500).send(err)
        }
   }

   export const updateImages = async (req:Request, res:Response):Promise<Response> => {
        try {
            const update = req.body
            const imageId = req.params.imageId;
            await Image.findByIdAndUpdate(imageId, update);
            const image = await Image.findById(imageId)
            res.status(200).json({
            data: image,
            message: 'image has been updated'
            });
        } catch (err) {
            return res.status(500).send(err)
        }
   }

   export const deleteImage = async (req:Request, res: Response):Promise<Response>=>{
       try{
        const imageId = req.params.imageId;
        const image = await Image.findByIdAndDelete(imageId);
        if(image == null){
            return res.status(404).send(({
                error: 'not_found',
                error_description: 'image not found'
            }));
        }
        return res.status(204).send();
       }catch(err){
            return res.status(500).send(err)
       }
   }