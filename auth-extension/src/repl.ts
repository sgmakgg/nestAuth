import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    await repl(AppModule);
}
bootstrap();

// ▪️ Terminal - Start the REPL
// npm run start -- --entryFile repl

// next in terminal
// Get UserRepository and update User ID 1 (make sure you have a User with that ID of course)
// await get("UserRepository").update({ id: 1 }, { role: 'regular' })

//or
// ▪️ Terminal - switch to REPL window and update User 1's Role (or whatever user you were working on)
// await get("UserRepository").update({ id: 1 }, { role: 'admin' })

// just for check-in user's roles
// Get all Users from the DB
// await get("UserRepository").find()