import { Router } from 'express'
import { getUser, getUsers, updateUser, deleteUser, userInfo } from '../controllers/userController';

const router = Router();

router.get('/info', userInfo);

router.get('/', getUsers);

router.get('/:userId', getUser);

router.patch('/:userId', updateUser);

router.delete('/:userId', deleteUser);

export default router;
