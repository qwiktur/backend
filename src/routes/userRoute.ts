import { Router } from 'express'
import { grantAccess, allowIfLoggedin, getUser, getUsers, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

router.get('/:userId', allowIfLoggedin, getUser);

router.get('/', allowIfLoggedin,grantAccess('readAny', 'profile'), getUsers);

router.patch('/:userId', allowIfLoggedin, grantAccess('updateAny', 'profile'), updateUser);

router.delete('/:userId', allowIfLoggedin, grantAccess('deleteAny', 'profile'), deleteUser);

export default router;
