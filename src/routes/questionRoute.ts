import {Router} from 'express'
import { createQuestion, deleteQuestion, getOneQuestion, getAllQuestions,updateQuestion }  from '../controllers/questionController'
const router = Router()

router.post('/questions', createQuestion );

router.get('/questions', getAllQuestions);

router.get('/questions/:questionId', getOneQuestion);

router.patch('/questions/:questionId', updateQuestion );

router.delete('/questions/:questionId', deleteQuestion);

export default router;