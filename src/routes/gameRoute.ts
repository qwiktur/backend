import { Router } from 'express';
import { createGame, getAllGames, getOneGame, updateGame, deleteGame, answer } from '../controllers/gameController';

const router = Router();

router.get('/', getAllGames);

router.get('/:gameId', getOneGame);

router.post('/', createGame);

router.patch('/:gameId', updateGame);

router.delete('/:gameId', deleteGame);

router.patch('/:gameId/answer', answer);

export default router;
