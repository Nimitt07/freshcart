import prisma from '../prisma.js';

async function getCart(userId) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: 'desc' }
  });
  const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  return { items, total };
}

export async function listCart(req, res, next) {
  try {
    res.json(await getCart(req.user.id));
  } catch (error) {
    next(error);
  }
}

export async function addToCart(req, res, next) {
  try {
    const { productId, quantity = 1 } = req.body;
    await prisma.cartItem.upsert({
      where: { userId_productId: { userId: req.user.id, productId: Number(productId) } },
      update: { quantity: { increment: Number(quantity) } },
      create: { userId: req.user.id, productId: Number(productId), quantity: Number(quantity) }
    });
    res.status(201).json(await getCart(req.user.id));
  } catch (error) {
    next(error);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const quantity = Number(req.body.quantity);
    const id = Number(req.params.id);
    const item = await prisma.cartItem.findFirst({ where: { id, userId: req.user.id } });

    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id } });
    } else {
      await prisma.cartItem.update({ where: { id }, data: { quantity } });
    }

    res.json(await getCart(req.user.id));
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    await prisma.cartItem.deleteMany({ where: { id: Number(req.params.id), userId: req.user.id } });
    res.json(await getCart(req.user.id));
  } catch (error) {
    next(error);
  }
}
