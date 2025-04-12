import { Router } from 'express';
import LoteRoutes from './LoteRoutes';
import BoletoRoutes from './BoletoRoute';

const router = Router();

router.use('/lotes', LoteRoutes);
router.use('/boletos', BoletoRoutes);

export default router;
