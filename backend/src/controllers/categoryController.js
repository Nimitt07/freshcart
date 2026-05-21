import prisma from '../prisma.js';

export async function listCategories(_req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } }
    });
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, slug } = req.body;
    const category = await prisma.category.create({
      data: { name, slug: slug || name.toLowerCase().replaceAll(' ', '-') }
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
}
