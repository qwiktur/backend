import { Request, Response } from 'express';
import Question from '../model/question';


export const createQuestion = async (req: Request, res:Response):Promise<Response> =>{
    try{
        const question = await Question.create({
            title: req.body.title,
            theme:req.body.theme,
            choices:{
                label:req.body.label,
                correct: req.body.correct
            }
        });
        return res.status(201).send(question)
    }catch(err){
        return res.status(500).send(err)
    }
}

export const getAllQuestions = async (req:Request, res:Response):Promise<Response> => {
    try{
        const questions = await Question.find({});
            res.status(200).json({
                data: questions
            });
        }catch(err){
            return res.status(500).send(err)
        }
   }
   
   export const getOneQuestion = async (req:Request, res:Response):Promise<Response> => {
        try {
        const questionId = req.params.questionId;
        const question = await Question.findById(questionId);
        if (!question){
            return res.status(404).send('question not found')
        } 
        res.status(200).json({
        data: question
        });
        } catch (err) {
            return res.status(500).send(err)
        }
   }

   export const updateQuestion = async (req:Request, res:Response):Promise<Response> => {
        try {
            const update = req.body
            const questionId = req.params.questionId;
            await Question.findByIdAndUpdate(questionId, update);
            const question = await Question.findById(questionId)
            res.status(200).json({
            data: question,
            message: 'Question has been updated'
            });
        } catch (err) {
            return res.status(500).send(err)
        }
   }

   export const deleteQuestion = async (req:Request, res: Response):Promise<Response>=>{
       try{
        const questionId = req.params.questionId;
        const question = await Question.findByIdAndDelete(questionId);
        if(question == null){
            return res.status(404).send(({
                error: 'not_found',
                error_description: 'question not found'
            }));
        }
        return res.status(204).send();
       }catch(err){
            return res.status(500).send(err)
       }
   }