import { Router } from 'express'
import { grantAccess, allowIfLoggedin, getUser, getUsers, updateUser, deleteUser, userInfo } from '../controllers/userController';

const router = Router();

router.get('/info', userInfo);

router.get('/', allowIfLoggedin, grantAccess('readAny', 'profile'), getUsers);

router.get('/:userId', allowIfLoggedin, getUser);

router.patch('/:userId', allowIfLoggedin, grantAccess('updateAny', 'profile'), updateUser);

router.delete('/:userId', allowIfLoggedin, grantAccess('deleteAny', 'profile'), deleteUser);

export default router;
