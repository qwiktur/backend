import { Router } from 'express';
import { createQuestion, deleteQuestion, getOneQuestion, getAllQuestions, updateQuestion }  from '../controllers/questionController';

const router = Router();

router.post('/', createQuestion );

router.get('/', getAllQuestions);

router.get('/:questionId', getOneQuestion);

router.patch('/:questionId', updateQuestion );

router.delete('/:questionId', deleteQuestion);

export default router;
