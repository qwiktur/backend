import { Router } from 'express'
import { allowIfLoggedin, getUser, getUsers, updateUser, deleteUser, userInfo } from '../controllers/userController';

const router = Router();

router.get('/info', userInfo);

router.get('/', allowIfLoggedin, getUsers);

router.get('/:userId', allowIfLoggedin, getUser);

router.patch('/:userId', allowIfLoggedin, updateUser);

router.delete('/:userId', allowIfLoggedin, deleteUser);

export default router;
