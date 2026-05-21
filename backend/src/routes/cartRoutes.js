import { Router } from 'express';
import { body } from 'express-validator';
import { addToCart, listCart, removeCartItem, updateCartItem } from '../controllers/cartController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(requireAuth);
router.get('/', listCart);
router.post('/', [body('productId').isInt({ min: 1 }), body('quantity').optional().isInt({ min: 1 })], validate, addToCart);
router.patch('/:id', [body('quantity').isInt({ min: 0 })], validate, updateCartItem);
router.delete('/:id', removeCartItem);

export default router;
