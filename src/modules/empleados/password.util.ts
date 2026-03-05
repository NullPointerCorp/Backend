import crypto from "crypto";

const KEYLEN = 64;

export const hashPassword = async (plain: string): Promise<string> => {
  const salt = crypto.randomBytes(16).toString("hex");

  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(plain, salt, KEYLEN, (err, key) => {
      if (err) return reject(err);
      resolve(key as Buffer);
    });
  });

  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
};

export const comparePassword = async (plain: string, storedHash: string): Promise<boolean> => {
  if (!storedHash?.startsWith("scrypt$")) {
    return plain === storedHash;
  }

  const [, salt, expected] = storedHash.split("$");
  if (!salt || !expected) return false;

  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(plain, salt, KEYLEN, (err, key) => {
      if (err) return reject(err);
      resolve(key as Buffer);
    });
  });

  const expectedBuffer = Buffer.from(expected, "hex");
  return crypto.timingSafeEqual(derivedKey, expectedBuffer);
};