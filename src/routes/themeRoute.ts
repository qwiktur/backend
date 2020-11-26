import {Router} from 'express'
import { createTheme, deleteTheme, getOneTheme, getThemes,updateTheme }  from '../controllers/themeController'
const router = Router()

router.post('/themes',createTheme );

router.get('/themes', getThemes);

router.get('/themes/:themeId', getOneTheme);

router.put('/themes/:themeId', updateTheme );

router.delete('/themes/:ThemeId', deleteTheme);

export default router;