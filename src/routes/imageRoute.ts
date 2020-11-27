import {Router} from 'express'
import { createImage, deleteImage, getOneImage, getImages,updateImages }  from '../controllers/imageController'
const router = Router()

router.post('/images', createImage );

router.get('/images', getImages);

router.get('/images/:imageId', getOneImage);

router.patch('/images/:imageId', updateImages );

router.delete('/images/:imageId', deleteImage);

export default router;