import { Router } from 'express';
import { body } from 'express-validator';
import { createCategory, listCategories } from '../controllers/categoryController.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/', listCategories);
router.post('/', requireAuth, requireAdmin, [body('name').trim().notEmpty()], validate, createCategory);

export default router;
