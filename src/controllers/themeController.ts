import { Request, Response } from 'express';
import Theme from '../model/theme';
import { formatErrors, formatServerError, translateMongooseValidationError } from '../util/errors';

export const createTheme = async (req: Request, res: Response): Promise<Response> => {
    try {
        const theme = await Theme.create({
            name: req.body.name,
            image: req.body.image
        });
        return res.status(201).send({ id: theme.id });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).send(formatErrors(...translateMongooseValidationError(err)));
        }
        return res.status(500).send(formatServerError());
    }
}

export const getThemes = async (req: Request, res: Response): Promise<Response> => {
    try {
        return res.status(200).send({ themes: await Theme.find() });
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}

export const getOneTheme = async (req: Request, res: Response): Promise<Response> => {
    try {
        const theme = await Theme.findById(req.params.themeId);
        if (theme == null){
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'Theme not found' }));
        }
        return res.status(200).send({ theme });
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}

export const updateTheme = async (req: Request, res: Response): Promise<Response> => {
    try {
       const theme = await Theme.findByIdAndUpdate(req.params.themeId, req.body);
       res.status(200).send({ theme });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).send(formatErrors(...translateMongooseValidationError(err)));
        }
        return res.status(500).send(formatServerError());
    }
}

export const deleteTheme = async (req: Request, res: Response): Promise<Response> => {
    try {
        const theme = await Theme.findByIdAndDelete(req.params.themeId);
        if (theme == null) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'Theme not found' }));
        }
        return res.status(204).send();
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}
