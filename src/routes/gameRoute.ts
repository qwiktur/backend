import {Router} from 'express'
import {createGame,getAllGames,getOneGame,updateGame,deleteGame} from '../controllers/gameController'
const router = Router()

router.post('/games', createGame );

router.get('/games', getAllGames);

router.get('/games/:gameId', getOneGame);

router.patch('/games/:gameId', updateGame );

router.delete('/games/:gameId', deleteGame);

export default router;