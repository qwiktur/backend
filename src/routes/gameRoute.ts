import { Router } from 'express';
import { createGame, getAllGames, getOneGame, updateGame, deleteGame, answer } from '../controllers/gameController';

const router = Router();

router.post('/', createGame );

router.get('/', getAllGames);

router.get('/:gameId', getOneGame);

router.patch('/:gameId', updateGame );

router.delete('/:gameId', deleteGame);

router.patch('/:gameId/answer', answer);

export default router;
