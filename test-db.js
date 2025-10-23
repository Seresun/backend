const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if categories exist
    const categories = await prisma.category.findMany();
    console.log(`✅ Found ${categories.length} categories:`, categories.map(c => c.name));
    
    // Check if we can create a todo
    const firstCategory = categories[0];
    if (firstCategory) {
      const todo = await prisma.todo.create({
        data: {
          text: 'Test todo',
          categoryId: firstCategory.id,
        },
      });
      console.log('✅ Successfully created test todo:', todo);
      
      // Clean up test todo
      await prisma.todo.delete({ where: { id: todo.id } });
      console.log('✅ Test todo cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
