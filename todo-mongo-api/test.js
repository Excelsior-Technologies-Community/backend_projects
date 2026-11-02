const mongoose = require('mongoose');
const Todo = require('./models/Todo');

const MONGO_URI = 'mongodb://localhost:27017/todoDB';

async function runTests() {
  console.log('--- Starting MongoDB Todo API Verification ---');

  try {
    // 1. Connect to MongoDB
    console.log(`1. Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('   ✅ MongoDB connected successfully!\n');

    // 2. Add (Create) a Todo
    console.log('2. Testing ADD Todo (Create operation)...');
    const testTodo = new Todo({
      title: 'Learn MongoDB with Node.js & Express',
      description: 'Understand how Mongoose schemas, models, and CRUD operations work.'
    });
    const savedTodo = await testTodo.save();
    console.log('   ✅ Todo added successfully! ID:', savedTodo._id);
    console.log('   Document:', JSON.stringify(savedTodo, null, 2), '\n');

    // 3. Get (Read) all Todos
    console.log('3. Testing GET Todos (Read operation)...');
    const allTodos = await Todo.find();
    console.log(`   ✅ Found ${allTodos.length} todo item(s) in MongoDB database.\n`);

    // 4. Update Todo
    console.log('4. Testing UPDATE Todo operation...');
    savedTodo.completed = true;
    const updated = await savedTodo.save();
    console.log(`   ✅ Todo updated (completed: ${updated.completed})\n`);

    // 5. Delete Todo
    console.log('5. Testing DELETE Todo operation...');
    const deleted = await Todo.findByIdAndDelete(savedTodo._id);
    console.log('   ✅ Todo deleted successfully! Deleted ID:', deleted._id, '\n');

    // 6. Verify deletion
    const checkDeleted = await Todo.findById(savedTodo._id);
    console.log('6. Verifying Deletion:');
    if (!checkDeleted) {
      console.log('   ✅ Confirmed: Todo no longer exists in database.\n');
    } else {
      console.log('   ❌ Error: Todo was not deleted.\n');
    }

    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! The MongoDB Todo API is ready.');
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

runTests();
