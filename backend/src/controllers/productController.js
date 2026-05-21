import prisma from '../prisma.js';

function productData(body) {
  return {
    name: body.name,
    description: body.description,
    price: Number(body.price),
    imageUrl: body.imageUrl,
    stock: Number(body.stock),
    unit: body.unit,
    featured: Boolean(body.featured),
    categoryId: Number(body.categoryId)
  };
}

export async function listProducts(req, res, next) {
  try {
    const { q, category, minPrice, maxPrice, featured } = req.query;
    const where = {
      ...(q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] } : {}),
      ...(category ? { category: { slug: category } } : {}),
      ...(featured ? { featured: featured === 'true' } : {}),
      ...(minPrice || maxPrice ? { price: { ...(minPrice ? { gte: Number(minPrice) } : {}), ...(maxPrice ? { lte: Number(maxPrice) } : {}) } } : {})
    };

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { category: true }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await prisma.product.create({
      data: productData(req.body),
      include: { category: true }
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: productData(req.body),
      include: { category: true }
    });
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
