import { Router } from 'express';
import { body } from 'express-validator';
import { listOrders, placeOrder } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(requireAuth);
router.get('/', listOrders);
router.post(
  '/',
  [
    body('customerName').trim().notEmpty(),
    body('customerEmail').isEmail(),
    body('deliveryAddress').trim().isLength({ min: 8 }),
    body('phone').trim().isLength({ min: 8 })
  ],
  validate,
  placeOrder
);

export default router;
