import path from 'path';
import { app } from 'electron';
import dotenv from 'dotenv';

if (!app.isPackaged) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}
