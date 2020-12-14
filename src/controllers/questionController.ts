import { Request, Response } from 'express';
import Question from '../model/question';
import { formatErrors, formatServerError, translateMongooseValidationError } from '../util/errors';

export const createQuestion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const question = await Question.create({
            title: req.body.title,
            theme: req.body.theme,
            choices: req.body.choices
        });
        return res.status(201).send(question);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).send(formatErrors(...translateMongooseValidationError(err)));
        }
        return res.status(500).send(formatServerError());
    }
}

export const getAllQuestions = async (req: Request, res: Response): Promise<Response> => {
    try {
        return res.status(200).send({ questions : await Question.find() });
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}

export const getOneQuestion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (question == null) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'Question not found' }));
        }
        res.status(200).send({ question });
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}

export const updateQuestion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.questionId, req.body);
        res.status(200).send({ question });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).send(formatErrors(...translateMongooseValidationError(err)));
        }
        return res.status(500).send(formatServerError());
    }
}

export const deleteQuestion = async (req: Request, res: Response): Promise<Response> => {
    try {
        const question = await Question.findByIdAndDelete(req.params.questionId);
        if (question == null) {
            return res.status(404).send(formatErrors({ error: 'not_found', error_description: 'Question not found' }));
        }
        return res.status(204).send();
    } catch (err) {
        return res.status(500).send(formatServerError());
    }
}
