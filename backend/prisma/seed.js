import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { name: 'Fresh Produce', slug: 'fresh-produce' },
  { name: 'Dairy & Eggs', slug: 'dairy-eggs' },
  { name: 'Bakery', slug: 'bakery' },
  { name: 'Pantry Staples', slug: 'pantry-staples' },
  { name: 'Beverages', slug: 'beverages' }
];

const products = [
  ['Bananas', 'Sweet ripe bananas for snacks and smoothies.', 1.99, 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=900&q=80', 120, 'dozen', true, 'fresh-produce'],
  ['Tomatoes', 'Juicy red tomatoes for salads, curries, and sauces.', 2.49, 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?auto=format&fit=crop&w=900&q=80', 90, 'kg', false, 'fresh-produce'],
  ['Spinach', 'Fresh green spinach bunch rich in iron.', 1.79, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80', 65, 'bunch', false, 'fresh-produce'],
  ['Apples', 'Crisp orchard apples with a bright sweet bite.', 3.99, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=80', 100, 'kg', true, 'fresh-produce'],
  ['Whole Milk', 'Creamy full-fat milk for tea, cereal, and cooking.', 2.99, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80', 80, 'liter', true, 'dairy-eggs'],
  ['Greek Yogurt', 'Thick protein-rich yogurt with a clean tangy finish.', 4.49, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80', 45, '500g', false, 'dairy-eggs'],
  ['Cheddar Cheese', 'Sharp cheddar block for sandwiches and baking.', 5.99, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=900&q=80', 38, '250g', false, 'dairy-eggs'],
  ['Free Range Eggs', 'Farm fresh free range eggs.', 3.89, 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=900&q=80', 75, '12 pack', true, 'dairy-eggs'],
  ['Sourdough Bread', 'Crusty sourdough loaf baked fresh daily.', 4.25, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', 30, 'loaf', true, 'bakery'],
  ['Croissants', 'Buttery flaky croissants for breakfast.', 6.5, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80', 24, '4 pack', false, 'bakery'],
  ['Whole Wheat Bread', 'Soft whole wheat sandwich bread.', 3.25, 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=900&q=80', 42, 'loaf', false, 'bakery'],
  ['Blueberry Muffins', 'Tender muffins loaded with blueberries.', 5.75, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=900&q=80', 28, '6 pack', false, 'bakery'],
  ['Basmati Rice', 'Long grain aromatic basmati rice.', 8.99, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80', 110, '5kg', true, 'pantry-staples'],
  ['Olive Oil', 'Extra virgin olive oil for cooking and dressings.', 10.99, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80', 50, '750ml', false, 'pantry-staples'],
  ['Pasta', 'Durum wheat penne pasta.', 2.2, 'https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=900&q=80', 130, '500g', false, 'pantry-staples'],
  ['Chickpeas', 'Protein-packed chickpeas for curries and salads.', 1.5, 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=900&q=80', 88, '400g can', false, 'pantry-staples'],
  ['Orange Juice', 'Fresh pressed orange juice.', 4.99, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80', 40, '1 liter', true, 'beverages'],
  ['Sparkling Water', 'Crisp sparkling mineral water.', 3.99, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80', 96, '6 pack', false, 'beverages'],
  ['Masala Chai', 'Spiced black tea blend for a warming cup.', 4.75, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=80', 55, '250g', false, 'beverages'],
  ['Cold Brew Coffee', 'Smooth ready-to-drink cold brew coffee.', 5.49, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80', 34, '500ml', false, 'beverages'],
  ['Carrots', 'Crunchy carrots for salads, soups, and lunch boxes.', 2.1, 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=900&q=80', 95, 'kg', false, 'fresh-produce'],
  ['Broccoli', 'Fresh broccoli crowns packed with flavor.', 3.35, 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=900&q=80', 58, 'kg', false, 'fresh-produce'],
  ['Potatoes', 'All-purpose potatoes for roasting, boiling, and fries.', 2.25, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80', 150, 'kg', true, 'fresh-produce'],
  ['Onions', 'Everyday cooking onions with bold aroma.', 1.8, 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=900&q=80', 140, 'kg', false, 'fresh-produce'],
  ['Avocados', 'Creamy ripe avocados for toast and bowls.', 5.99, 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=80', 44, '4 pack', true, 'fresh-produce'],
  ['Strawberries', 'Sweet strawberries for desserts and snacking.', 4.2, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=80', 52, '500g', false, 'fresh-produce'],
  ['Grapes', 'Seedless grapes with a crisp sweet bite.', 3.75, 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=900&q=80', 60, 'kg', false, 'fresh-produce'],
  ['Cucumber', 'Cool cucumbers for salads and sandwiches.', 1.25, 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=900&q=80', 85, 'each', false, 'fresh-produce'],
  ['Butter', 'Rich salted butter for toast and baking.', 4.1, 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=900&q=80', 36, '250g', false, 'dairy-eggs'],
  ['Paneer', 'Fresh paneer cubes for curries and grilling.', 5.25, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80', 40, '400g', true, 'dairy-eggs'],
  ['Mozzarella', 'Mild mozzarella cheese for pizza and pasta.', 4.8, 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=900&q=80', 32, '250g', false, 'dairy-eggs'],
  ['Cream Cheese', 'Smooth cream cheese for bagels and dips.', 3.95, 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=80', 27, '200g', false, 'dairy-eggs'],
  ['Almond Milk', 'Unsweetened almond milk for cereal and coffee.', 3.7, 'https://images.unsplash.com/photo-1600788907416-456578634209?auto=format&fit=crop&w=900&q=80', 46, '1 liter', false, 'dairy-eggs'],
  ['Chocolate Milk', 'Creamy chocolate milk for a quick treat.', 2.85, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=80', 48, '1 liter', false, 'dairy-eggs'],
  ['Bagels', 'Chewy bakery bagels ready for breakfast.', 4.4, 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=900&q=80', 31, '6 pack', false, 'bakery'],
  ['Baguette', 'Classic French baguette with a crisp crust.', 2.95, 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=900&q=80', 34, 'loaf', false, 'bakery'],
  ['Cinnamon Rolls', 'Soft cinnamon rolls with sweet icing.', 6.25, 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=80', 22, '4 pack', true, 'bakery'],
  ['Pita Bread', 'Soft pita pockets for wraps and dips.', 3.1, 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=900&q=80', 44, '6 pack', false, 'bakery'],
  ['Dinner Rolls', 'Fluffy dinner rolls for family meals.', 3.6, 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=900&q=80', 39, '12 pack', false, 'bakery'],
  ['Brownies', 'Fudgy chocolate brownies from the bakery.', 5.95, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80', 26, '6 pack', false, 'bakery'],
  ['Rolled Oats', 'Whole grain oats for breakfast and baking.', 3.4, 'https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?auto=format&fit=crop&w=900&q=80', 72, '1kg', false, 'pantry-staples'],
  ['Black Beans', 'Hearty black beans for bowls and tacos.', 1.65, 'https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&w=900&q=80', 83, '400g can', false, 'pantry-staples'],
  ['Peanut Butter', 'Creamy peanut butter with roasted peanuts.', 4.6, 'https://images.unsplash.com/photo-1624684244440-1130c3b65783?auto=format&fit=crop&w=900&q=80', 49, '500g', true, 'pantry-staples'],
  ['Honey', 'Golden honey for tea, toast, and desserts.', 6.75, 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=900&q=80', 35, '500g', false, 'pantry-staples'],
  ['Tomato Sauce', 'Classic tomato sauce for pasta and pizza.', 2.35, 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=900&q=80', 76, '500g jar', false, 'pantry-staples'],
  ['All Purpose Flour', 'Versatile flour for baking and cooking.', 2.9, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=900&q=80', 92, '1kg', false, 'pantry-staples'],
  ['Lemonade', 'Bright lemonade with a sweet citrus finish.', 3.3, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80', 42, '1 liter', false, 'beverages'],
  ['Green Tea', 'Refreshing green tea bags for daily sipping.', 4.25, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=900&q=80', 57, '25 bags', false, 'beverages'],
  ['Coconut Water', 'Naturally hydrating coconut water.', 3.95, 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=900&q=80', 45, '1 liter', true, 'beverages'],
  ['Apple Juice', 'Clear apple juice with a crisp finish.', 3.75, 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80', 50, '1 liter', false, 'beverages']
];

async function main() {
  const password = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@grocery.test' },
    update: {},
    create: { name: 'Store Admin', email: 'admin@grocery.test', password, role: 'ADMIN' }
  });

  for (const category of categories) {
    await prisma.category.upsert({ where: { slug: category.slug }, update: category, create: category });
  }

  const categoryMap = Object.fromEntries((await prisma.category.findMany()).map((category) => [category.slug, category.id]));

  for (const [name, description, price, imageUrl, stock, unit, featured, slug] of products) {
    await prisma.product.upsert({
      where: { id: products.findIndex((product) => product[0] === name) + 1 },
      update: { name, description, price, imageUrl, stock, unit, featured, categoryId: categoryMap[slug] },
      create: { name, description, price, imageUrl, stock, unit, featured, categoryId: categoryMap[slug] }
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
