import express from 'express';
import PointsControllers from '../controllers/PointsControllers';
import ItemsControllers from '../controllers/ItemsControllers';

const router = express.Router();
const pointsControllers = new PointsControllers();
const itemsControllers = new ItemsControllers();

router.get('/items', itemsControllers.index);
router.get('/points', pointsControllers.index);
router.get('/points/:id', pointsControllers.show);
router.post('/points', pointsControllers.create);

export default router;