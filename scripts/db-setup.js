import dotenv from 'dotenv';
import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

dotenv.config();
const DB_USER = process.env.DB_USER || 'health_tech_user';
const DB_NAME = process.env.DB_NAME || 'health_tech_db';
const DB_PASSWORD = process.env.DB_PASSWORD || 'health_tech_pwd';
const PG_ADMIN = process.env.PG_ADMIN || 'postgres';

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...');

    // Checking if user exists
    try {
      await execPromise(
        `psql -U ${PG_ADMIN} -t -c "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}';" | grep -q 1`,
      );
      console.log(`✅ User ${DB_USER} already exists`);
    } catch (error) {
      // If user doesn't exist, We create it
      console.log(`🔧 Creating user ${DB_USER}...`);
      await execPromise(
        `psql -U ${PG_ADMIN} -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}' CREATEDB;"`,
      );
      console.log(`✅ User ${DB_USER} created`);
    }

    // Checking if database exists
    try {
      await execPromise(
        `psql -U ${PG_ADMIN} -t -c "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}';" | grep -q 1`,
      );
      console.log(`✅ Database ${DB_NAME} already exists`);
    } catch (error) {
      // If database doesn't exist, we create it
      console.log(`🔧 Creating database ${DB_NAME}...`);
      await execPromise(
        `psql -U ${PG_ADMIN} -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"`,
      );
      console.log(`✅ Database ${DB_NAME} created`);
    }

    // Granting privileges
    await execPromise(
      `psql -U ${PG_ADMIN} -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"`,
    );
    console.log(`✅ Granted all privileges on ${DB_NAME} to ${DB_USER}`);

    console.log('✅ Database setup completed successfully!');
    console.log(`
Database Information:
- Host: localhost
- Port: 5432
- Database: ${DB_NAME}
- User: ${DB_USER}
- Password: ${DB_PASSWORD}
    `);
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error(`
Make sure PostgreSQL is installed and running:
1. Installation: sudo apt install postgresql
2. Start service: sudo service postgresql start
3. You may need to run this script as the postgres user: sudo -u postgres node scripts/db-setup.js
    `);
    process.exit(1);
  }
}

setupDatabase();
