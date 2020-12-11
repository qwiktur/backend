import { Request, Response } from 'express';
import Theme from '../model/theme';
import { ErrorResponse } from '../util/errors';

export const createTheme = async (req: Request, res: Response): Promise<Response> => {
    try {
        const theme = await Theme.create({
            name: req.body.name
        });
        return res.status(201).send({ id: theme.id });
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}

export const getThemes = async (req: Request, res: Response): Promise<Response> => {
    try {
        return res.status(200).json({ themes: await Theme.find() });
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}

export const getOneTheme = async (req: Request, res: Response): Promise<Response> => {
    try {
        const theme = await Theme.findById(req.params.themeId);
        if (theme == null){
            return res.status(404).send({ error: 'not_found', error_description: 'Theme not found' } as ErrorResponse);
        }
        return res.status(200).json({ theme });
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}

export const updateTheme = async (req: Request, res: Response): Promise<Response> => {
    try {
       const theme = await Theme.findByIdAndUpdate(req.params.themeId, req.body);
       res.status(200).json({ theme });
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}

export const deleteTheme = async (req: Request, res: Response): Promise<Response> => {
    try {
        const theme = await Theme.findByIdAndDelete(req.params.themeId);
        if (theme == null) {
            return res.status(404).send({ error: 'not_found', error_description: 'Theme not found' } as ErrorResponse);
        }
        return res.status(204).send();
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}
