import { Request, Response } from 'express';
import Image from '../model/image';
import { ErrorResponse } from '../util/errors';

export const createImage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const image = await Image.create({ // TODO Ajouter le stockage de l'image
            src: req.body.src,
            title: req.body.title,
            theme: req.body.theme
        });
        return res.status(201).send({ id: image.id });
    } catch (err) {
        return res.status(500).send(err);
    }
}

export const getImages = async (req: Request, res: Response): Promise<Response> => {
    try {
        return res.status(200).json(await Image.find());
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}

export const getOneImage = async (req: Request, res: Response): Promise<Response> => {
     try {
        const image = await Image.findById(req.params.imageId);
        if (image == null) {
           return res.status(404).send({ error: 'not_found', error_description: 'Image not found' } as ErrorResponse);
        }
        return res.status(200).json({ image });
     } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
     }
}

export const updateImage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const image = await Image.findByIdAndUpdate(req.params.imageId, req.body);
        return res.status(200).json({ image });
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}

export const deleteImage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const image = await Image.findByIdAndDelete(req.params.imageId);
        if (image == null) {
           return res.status(404).send(({ error: 'not_found', error_description: 'image not found' } as ErrorResponse));
        }
        return res.status(204).send();
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}
