import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export const base64Decoded = (base64String: string): string | null => {
  try {
    return Buffer.from(base64String, 'base64').toString('utf-8');
  } catch (error) {
    return null;
  }
};

export const decodeBase64 = (base64String: string): string | null => {
  try {
    return atob(base64String);
  } catch (error) {
    return null;
  }
};
