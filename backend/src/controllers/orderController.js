import prisma from '../prisma.js';

export async function listOrders(req, res, next) {
  try {
    const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };
    const orders = await prisma.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

export async function placeOrder(req, res, next) {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const total = cartItems.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const { customerName, customerEmail, deliveryAddress, phone } = req.body;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: req.user.id,
          total,
          customerName,
          customerEmail,
          deliveryAddress,
          phone,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price
            }))
          }
        },
        include: { items: { include: { product: true } } }
      });

      await Promise.all(
        cartItems.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          })
        )
      );
      await tx.cartItem.deleteMany({ where: { userId: req.user.id } });
      return created;
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}
