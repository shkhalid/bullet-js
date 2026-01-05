import { ConnectionManager, Model } from '@bulletjs/orm';

// 1. Initialize DB
const db = ConnectionManager.connect({
  database: 'playground.sqlite',
  debug: true,
});

// 2. Define Model
class User extends Model {
  // static tableName = 'users'; // Auto-guessed as 'users'
}

async function run() {
  console.log('--- Setting up DB ---');
  
  // Manual migration for test
  await db.schema.dropTable('users').ifExists().execute();
  await db.schema
    .createTable('users')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('name', 'text')
    .addColumn('email', 'text')
    .execute();

  console.log('--- Creating User ---');
  const user = await User.create({
    name: 'Shah',
    email: 'shah@example.com'
  });
  
  console.log('User created:', user.attributes);

  console.log('--- Fetching User ---');
  const fetchedUser = await User.find(1);
  console.log('User fetched:', fetchedUser?.attributes);

  console.log('--- Updating User ---');
  if (fetchedUser) {
    fetchedUser.fill({ name: 'Shah Updated' });
    await fetchedUser.save();
  }

  const allUsers = await User.all();
  console.log('All users:', allUsers.map(u => u.attributes));
}

run().catch(console.error);
