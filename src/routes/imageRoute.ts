import { Router } from 'express';
import { createImage, deleteImage, getOneImage, getImages, updateImage, base64 }  from '../controllers/imageController';

const router = Router();

router.get('/', getImages);

router.get('/:imageId', getOneImage);

router.post('/', createImage );

router.patch('/:imageId', updateImage);

router.delete('/:imageId', deleteImage);

router.get('/:imageId/base64', base64);

export default router;
