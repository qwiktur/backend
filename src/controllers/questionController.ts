import { Request, Response } from 'express';
import Question from '../model/question';
import { ErrorResponse } from '../util/errors';

export const createQuestion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const question = await Question.create({
            title: req.body.title,
            theme: req.body.theme,
            choices: req.body.choices
        });
        return res.status(201).send(question);
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}

export const getAllQuestions = async (req: Request, res: Response): Promise<Response> => {
    try {
        return res.status(200).json({ questions : await Question.find() });
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}

export const getOneQuestion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (question == null) {
            return res.status(404).send({ error: 'not_found', error_description: 'Question not found' } as ErrorResponse);
        }
        res.status(200).json({ question });
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}

export const updateQuestion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.questionId, req.body);
        res.status(200).json({ question });
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}

export const deleteQuestion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const question = await Question.findByIdAndDelete(req.params.questionId);
        if (question == null) {
           return res.status(404).send({ error: 'not_found', error_description: 'Question not found' } as ErrorResponse);
        }
        return res.status(204).send();
    } catch (err) {
        return res.status(500).send({ error: 'server_error', error_description: 'Internal server error' } as ErrorResponse);
    }
}
