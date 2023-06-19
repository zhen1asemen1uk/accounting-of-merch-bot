import * as dotenv from 'dotenv';
import { join } from 'path';

const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: join(__dirname, '../../config/', envPath) });
