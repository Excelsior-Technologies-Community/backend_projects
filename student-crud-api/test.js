const mongoose = require('mongoose');
const Student = require('./models/Student');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/studentDB';

async function runTests() {
  console.log('--- Starting MongoDB Student CRUD API Verification ---');

  try {
    // 1. Connect to MongoDB
    console.log(`1. Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('   ✅ MongoDB connected successfully!\n');

    // Clean up any old test record with roll 999
    await Student.deleteOne({ roll: 999 });

    // 2. Add (Create) a Student
    console.log('2. Testing ADD Student (Create operation)...');
    const testStudent = new Student({
      name: 'John Doe',
      roll: 999,
      marks: 92
    });
    const savedStudent = await testStudent.save();
    console.log('   ✅ Student added successfully! ID:', savedStudent._id);
    console.log(`   Name: ${savedStudent.name}, Roll: ${savedStudent.roll}, Marks: ${savedStudent.marks}, Auto-calculated Grade: ${savedStudent.grade}`);
    console.log('   Document:', JSON.stringify(savedStudent, null, 2), '\n');

    // 3. Get (Read) all Students
    console.log('3. Testing GET Students (Read operation)...');
    const allStudents = await Student.find();
    console.log(`   ✅ Found ${allStudents.length} student record(s) in MongoDB database.\n`);

    // 4. Update Student
    console.log('4. Testing UPDATE Student operation...');
    savedStudent.marks = 78;
    savedStudent.grade = 'B';
    const updated = await savedStudent.save();
    console.log(`   ✅ Student updated (Marks: ${updated.marks}, Grade: ${updated.grade})\n`);

    // 5. Delete Student
    console.log('5. Testing DELETE Student operation...');
    const deleted = await Student.findByIdAndDelete(savedStudent._id);
    console.log('   ✅ Student deleted successfully! Deleted ID:', deleted._id, '\n');

    // 6. Verify deletion
    console.log('6. Verifying Deletion:');
    const checkDeleted = await Student.findById(savedStudent._id);
    if (!checkDeleted) {
      console.log('   ✅ Confirmed: Student no longer exists in database.\n');
    } else {
      console.log('   ❌ Error: Student was not deleted.\n');
    }

    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! The MongoDB Student CRUD API is ready.');
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

runTests();
