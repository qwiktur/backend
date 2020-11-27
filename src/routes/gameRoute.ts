import {Router} from 'express'
import {createGame,getAllGames,getOneGame,updateGame,deleteGame,answer} from '../controllers/gameController'
const router = Router()

router.post('/games', createGame );

router.get('/games', getAllGames);

router.get('/games/:gameId', getOneGame);

router.patch('/games/:gameId', updateGame );

router.delete('/games/:gameId', deleteGame);

router.patch('/games/:gameId/answer', answer);

export default router;