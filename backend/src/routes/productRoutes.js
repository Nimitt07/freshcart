import { Router } from 'express';
import { body } from 'express-validator';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct
} from '../controllers/productController.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
const productRules = [
  body('name').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('imageUrl').isURL(),
  body('stock').isInt({ min: 0 }),
  body('unit').trim().notEmpty(),
  body('categoryId').isInt({ min: 1 })
];

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', requireAuth, requireAdmin, productRules, validate, createProduct);
router.put('/:id', requireAuth, requireAdmin, productRules, validate, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
