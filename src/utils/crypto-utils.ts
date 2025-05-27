import { envConfig } from '@/config/env.config';
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = crypto.scryptSync(envConfig.ENCRYPTION_SECRET!, 'salt', 32);
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(encryptedData: string): string {
  const [ivHex, encryptedText] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedText, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}
