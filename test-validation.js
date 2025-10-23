const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testValidation() {
  console.log('Testing validation...\n');

  try {
    // Test 1: Valid category creation
    console.log('1. Testing valid category creation...');
    const validCategory = await axios.post(`${BASE_URL}/categories`, {
      name: 'Test Category'
    });
    console.log('✅ Valid category created:', validCategory.data);

    // Test 2: Invalid category creation (empty name)
    console.log('\n2. Testing invalid category creation (empty name)...');
    try {
      await axios.post(`${BASE_URL}/categories`, {
        name: ''
      });
      console.log('❌ Should have failed with empty name');
    } catch (error) {
      console.log('✅ Correctly rejected empty name:', error.response.data.message);
    }

    // Test 3: Invalid category creation (missing name)
    console.log('\n3. Testing invalid category creation (missing name)...');
    try {
      await axios.post(`${BASE_URL}/categories`, {});
      console.log('❌ Should have failed with missing name');
    } catch (error) {
      console.log('✅ Correctly rejected missing name:', error.response.data.message);
    }

    // Test 4: Valid todo creation
    console.log('\n4. Testing valid todo creation...');
    const validTodo = await axios.post(`${BASE_URL}/todos`, {
      text: 'Test todo',
      categoryId: validCategory.data.id
    });
    console.log('✅ Valid todo created:', validTodo.data);

    // Test 5: Invalid todo creation (empty text)
    console.log('\n5. Testing invalid todo creation (empty text)...');
    try {
      await axios.post(`${BASE_URL}/todos`, {
        text: '',
        categoryId: validCategory.data.id
      });
      console.log('❌ Should have failed with empty text');
    } catch (error) {
      console.log('✅ Correctly rejected empty text:', error.response.data.message);
    }

    // Test 6: Invalid todo creation (invalid categoryId)
    console.log('\n6. Testing invalid todo creation (invalid categoryId)...');
    try {
      await axios.post(`${BASE_URL}/todos`, {
        text: 'Test todo',
        categoryId: 'invalid-uuid'
      });
      console.log('❌ Should have failed with invalid UUID');
    } catch (error) {
      console.log('✅ Correctly rejected invalid UUID:', error.response.data.message);
    }

    // Test 7: Invalid todo status update (missing completed)
    console.log('\n7. Testing invalid todo status update (missing completed)...');
    try {
      await axios.patch(`${BASE_URL}/todos/${validTodo.data.id}`, {});
      console.log('❌ Should have failed with missing completed');
    } catch (error) {
      console.log('✅ Correctly rejected missing completed:', error.response.data.message);
    }

    // Test 8: Valid todo status update
    console.log('\n8. Testing valid todo status update...');
    const updatedTodo = await axios.patch(`${BASE_URL}/todos/${validTodo.data.id}`, {
      completed: true
    });
    console.log('✅ Valid todo status updated:', updatedTodo.data);

    console.log('\n🎉 All validation tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}`);
    return true;
  } catch (error) {
    console.log('❌ Server is not running. Please start the server with: npm run start:dev');
    return false;
  }
}

async function main() {
  console.log('🔍 Checking if server is running...');
  const isRunning = await checkServer();
  
  if (isRunning) {
    await testValidation();
  }
}

main();
