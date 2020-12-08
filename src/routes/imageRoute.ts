import { Router } from 'express';
import { createImage, deleteImage, getOneImage, getImages, updateImage }  from '../controllers/imageController';

const router = Router();

router.post('/', createImage );

router.get('/', getImages);

router.get('/:imageId', getOneImage);

router.patch('/:imageId', updateImage);

router.delete('/:imageId', deleteImage);

export default router;
