import {Router} from 'express'
import {grantAccess,allowIfLoggedin,login,signup,getUser,getUsers,updateUser,deleteUser} from '../controllers/userController'
const router = Router()

router.post('/signup', signup);

router.post('/login', login);

router.get('/user/:userId', allowIfLoggedin, getUser);

router.get('/users', allowIfLoggedin,grantAccess('readAny', 'profile'), getUsers);

router.patch('/user/:userId', allowIfLoggedin, grantAccess('updateAny', 'profile'), updateUser);

router.delete('/user/:userId', allowIfLoggedin, grantAccess('deleteAny', 'profile'), deleteUser);

export default router;