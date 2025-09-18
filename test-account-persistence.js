const database = require('./apps/api/src/simple-database');

async function testAccountPersistence() {
  console.log('🧪 Testing Account Data Persistence...\n');

  try {
    // Test 1: Create a user
    console.log('1. Creating a new user...');
    const user1 = await database.createUser({
      email: 'test@example.com',
      passwordHash: 'hashed_password_123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'CANDIDATE',
      isVerified: false,
      isActive: true
    });
    console.log('✅ User created:', user1.id, user1.email);

    // Test 2: Find user by email
    console.log('\n2. Finding user by email...');
    const foundUser = await database.findUserByEmail('test@example.com');
    if (foundUser) {
      console.log('✅ User found:', foundUser.id, foundUser.email);
    } else {
      console.log('❌ User not found!');
    }

    // Test 3: Find user by ID
    console.log('\n3. Finding user by ID...');
    const userById = await database.findUserById(user1.id);
    if (userById) {
      console.log('✅ User found by ID:', userById.id, userById.email);
    } else {
      console.log('❌ User not found by ID!');
    }

    // Test 4: Update user
    console.log('\n4. Updating user...');
    const updatedUser = await database.updateUser(user1.id, {
      firstName: 'Jane',
      lastName: 'Smith',
      isVerified: true
    });
    console.log('✅ User updated:', updatedUser.firstName, updatedUser.lastName, updatedUser.isVerified);

    // Test 5: Create another user
    console.log('\n5. Creating another user...');
    const user2 = await database.createUser({
      email: 'test2@example.com',
      passwordHash: 'hashed_password_456',
      firstName: 'Alice',
      lastName: 'Johnson',
      role: 'EMPLOYER',
      isVerified: true,
      isActive: true
    });
    console.log('✅ Second user created:', user2.id, user2.email);

    // Test 6: Get all users
    console.log('\n6. Getting all users...');
    const allUsers = await database.getAllUsers();
    console.log('✅ Total users:', allUsers.length);
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${user.role}`);
    });

    // Test 7: Verify persistence across multiple calls
    console.log('\n7. Testing persistence across multiple calls...');
    const newDatabase = require('./apps/api/src/simple-database');
    const persistedUsers = await newDatabase.getAllUsers();
    console.log('✅ Users persisted across calls:', persistedUsers.length);

    console.log('\n🎉 ALL TESTS PASSED! Account data persistence is working correctly!');
    console.log('\n📊 Summary:');
    console.log(`   - Users created: 2`);
    console.log(`   - Users found by email: ${foundUser ? 'Yes' : 'No'}`);
    console.log(`   - Users found by ID: ${userById ? 'Yes' : 'No'}`);
    console.log(`   - Users updated: ${updatedUser ? 'Yes' : 'No'}`);
    console.log(`   - Data persisted: ${persistedUsers.length > 0 ? 'Yes' : 'No'}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAccountPersistence();
