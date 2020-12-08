import { Router } from 'express';
import { createTheme, deleteTheme, getOneTheme, getThemes, updateTheme }  from '../controllers/themeController';

const router = Router();

router.get('/', getThemes);

router.get('/:themeId', getOneTheme);

router.post('/', createTheme);

router.patch('/:themeId', updateTheme);

router.delete('/:themeId', deleteTheme);

export default router;
