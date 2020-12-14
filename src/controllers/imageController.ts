import { Request, Response } from 'express';
import ImageManager from '../image-manager';
import Image from '../model/image';
import { formatErrors, formatServerError, translateMongooseValidationError } from '../util/errors';

export const createImage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const image = await Image.create({ // TODO Ajouter le stockage de l'image
            src: req.body.src,
            title: req.body.title,
            theme: req.body.theme
        });
        return res.status(201).send({ id: image.id });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).send(formatErrors(...translateMongooseValidationError(err)));
        }
        return res.status(500).send(formatServerError());
    }
}

export const getImages = async (req: Request, res: Response): Promise<Response> => {
    try {
        return res.status(200).send({ images: await Image.find() });
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}

export const getOneImage = async (req: Request, res: Response): Promise<Response> => {
     try {
        const image = await Image.findById(req.params.imageId);
        if (image == null) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'Image not found' }));
        }
        return res.status(200).send({ image });
     } catch (err) {
        return res.status(500).send(formatServerError());
     }
}

export const updateImage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const image = await Image.findByIdAndUpdate(req.params.imageId, req.body);
        return res.status(200).send({ image });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).send(formatErrors(...translateMongooseValidationError(err)));
        }
        return res.status(500).send(formatServerError());
    }
}

export const deleteImage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const image = await Image.findByIdAndDelete(req.params.imageId);
        if (image == null) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'Image not found' }));
        }
        return res.status(204).send();
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}

export const base64 = async (req: Request, res: Response): Promise<Response> => {
    try {
        const image = await Image.findById(req.params.imageId);
        if (image == null) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'Image not found' }));
        }
        const imgManager = new ImageManager(image);
        await imgManager.load();
        imgManager.blur(parseInt(req.query.blur as string, 10));
        return res.status(200).send({ base64: await imgManager.toBase64() });
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}
