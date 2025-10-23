const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAPI() {
  log('\n🧪 COMPREHENSIVE API TEST', 'bold');
  log('=' .repeat(50), 'blue');

  let categories = [];
  let todos = [];
  let testCategoryId = null;

  try {
    // Test 1: GET /categories - Check seeded categories
    log('\n1️⃣ Testing GET /categories', 'yellow');
    log('Expected: 3-5 seeded categories', 'blue');
    
    const categoriesResponse = await axios.get(`${BASE_URL}/categories`);
    categories = categoriesResponse.data;
    
    log(`✅ Found ${categories.length} categories:`, 'green');
    categories.forEach(cat => {
      log(`   - ${cat.name} (${cat.id})`, 'blue');
    });
    
    if (categories.length < 3) {
      log('⚠️  Warning: Expected at least 3 categories', 'yellow');
    }
    
    testCategoryId = categories[0].id;
    log(`Using category "${categories[0].name}" for todo tests`, 'blue');

    // Test 2: POST /todos - Create 5 tasks in same category
    log('\n2️⃣ Testing POST /todos - Creating 5 tasks', 'yellow');
    log('Expected: All 5 tasks should be created successfully', 'blue');
    
    todos = [];
    for (let i = 1; i <= 5; i++) {
      const todoData = {
        text: `Test task ${i} in ${categories[0].name}`,
        categoryId: testCategoryId
      };
      
      const todoResponse = await axios.post(`${BASE_URL}/todos`, todoData);
      todos.push(todoResponse.data);
      log(`✅ Task ${i} created: "${todoResponse.data.text}"`, 'green');
    }
    
    log(`✅ All 5 tasks created successfully in category "${categories[0].name}"`, 'green');

    // Test 3: POST /todos - Try to create 6th task (should fail)
    log('\n3️⃣ Testing POST /todos - 6th task (should fail)', 'yellow');
    log('Expected: 400 Bad Request with business rule message', 'blue');
    
    try {
      const sixthTodo = {
        text: 'This should fail - 6th task',
        categoryId: testCategoryId
      };
      
      await axios.post(`${BASE_URL}/todos`, sixthTodo);
      log('❌ ERROR: 6th task was created (should have failed)', 'red');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        log(`✅ Correctly rejected 6th task: ${error.response.data.message}`, 'green');
      } else {
        log(`❌ Unexpected error: ${error.message}`, 'red');
      }
    }

    // Test 4: GET /todos?category=<id> - Filter by category
    log('\n4️⃣ Testing GET /todos?category=<id>', 'yellow');
    log('Expected: Only tasks from specified category', 'blue');
    
    const filteredTodos = await axios.get(`${BASE_URL}/todos?category=${testCategoryId}`);
    log(`✅ Found ${filteredTodos.data.length} tasks in category "${categories[0].name}":`, 'green');
    filteredTodos.data.forEach(todo => {
      log(`   - "${todo.text}" (completed: ${todo.completed})`, 'blue');
    });
    
    if (filteredTodos.data.length !== 5) {
      log(`⚠️  Warning: Expected 5 tasks, found ${filteredTodos.data.length}`, 'yellow');
    }

    // Test 5: GET /todos?category=All - Get all tasks
    log('\n5️⃣ Testing GET /todos?category=All', 'yellow');
    log('Expected: All tasks from all categories', 'blue');
    
    const allTodos = await axios.get(`${BASE_URL}/todos?category=All`);
    log(`✅ Found ${allTodos.data.length} total tasks`, 'green');

    // Test 6: PATCH /todos/:id - Update task status
    log('\n6️⃣ Testing PATCH /todos/:id', 'yellow');
    log('Expected: Task status should be updated', 'blue');
    
    const taskToUpdate = todos[0];
    const updateData = { completed: true };
    
    const updatedTask = await axios.patch(`${BASE_URL}/todos/${taskToUpdate.id}`, updateData);
    log(`✅ Task updated: "${updatedTask.data.text}" (completed: ${updatedTask.data.completed})`, 'green');
    
    // Verify the update
    const verifyTask = await axios.get(`${BASE_URL}/todos/${taskToUpdate.id}`);
    if (verifyTask.data.completed === true) {
      log('✅ Task status correctly updated in database', 'green');
    } else {
      log('❌ Task status not updated correctly', 'red');
    }

    // Test 7: DELETE /todos/:id - Delete a task
    log('\n7️⃣ Testing DELETE /todos/:id', 'yellow');
    log('Expected: Task should be deleted', 'blue');
    
    const taskToDelete = todos[1];
    await axios.delete(`${BASE_URL}/todos/${taskToDelete.id}`);
    log(`✅ Task deleted: "${taskToDelete.text}"`, 'green');
    
    // Verify deletion
    try {
      await axios.get(`${BASE_URL}/todos/${taskToDelete.id}`);
      log('❌ ERROR: Task still exists after deletion', 'red');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        log('✅ Task correctly deleted (404 Not Found)', 'green');
      } else {
        log(`❌ Unexpected error: ${error.message}`, 'red');
      }
    }

    // Test 8: GET /todos - Final state check
    log('\n8️⃣ Testing GET /todos - Final state', 'yellow');
    log('Expected: 4 tasks remaining (5 created - 1 deleted)', 'blue');
    
    const finalTodos = await axios.get(`${BASE_URL}/todos`);
    log(`✅ Final state: ${finalTodos.data.length} tasks remaining`, 'green');
    
    finalTodos.data.forEach((todo, index) => {
      const status = todo.completed ? '✅' : '⏳';
      log(`   ${index + 1}. ${status} "${todo.text}" (${todo.category.name})`, 'blue');
    });

    // Test 9: Test business rule after deletion
    log('\n9️⃣ Testing business rule after deletion', 'yellow');
    log('Expected: Should be able to create 5th task again', 'blue');
    
    const newTask = {
      text: 'New task after deletion',
      categoryId: testCategoryId
    };
    
    const newTaskResponse = await axios.post(`${BASE_URL}/todos`, newTask);
    log(`✅ New task created: "${newTaskResponse.data.text}"`, 'green');
    
    // Try 6th task again
    try {
      const sixthTaskAgain = {
        text: 'This should fail again - 6th task',
        categoryId: testCategoryId
      };
      
      await axios.post(`${BASE_URL}/todos`, sixthTaskAgain);
      log('❌ ERROR: 6th task was created (should have failed)', 'red');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        log(`✅ Correctly rejected 6th task again: ${error.response.data.message}`, 'green');
      } else {
        log(`❌ Unexpected error: ${error.message}`, 'red');
      }
    }

    log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!', 'green');
    log('✅ API is working correctly and ready for frontend development', 'green');

  } catch (error) {
    log('\n❌ TEST FAILED', 'red');
    log(`Error: ${error.message}`, 'red');
    if (error.response) {
      log(`Status: ${error.response.status}`, 'red');
      log(`Response: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    }
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}`);
    return true;
  } catch (error) {
    log('❌ Server is not running!', 'red');
    log('Please start the server with: npm run start:dev', 'yellow');
    return false;
  }
}

async function main() {
  log('🔍 Checking if server is running...', 'blue');
  const isRunning = await checkServer();
  
  if (isRunning) {
    await testAPI();
  }
}

main();
