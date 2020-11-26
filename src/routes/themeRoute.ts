import {Router} from 'express'
import { createTheme, deleteTheme, getOneTheme, getThemes,updateTheme }  from '../controllers/themeController'
const router = Router()

router.post('/themes', createTheme );

router.get('/themes', getThemes);

router.get('/themes/:themeId', getOneTheme);

router.patch('/themes/:themeId', updateTheme );

router.delete('/themes/:themeId', deleteTheme);

export default router;