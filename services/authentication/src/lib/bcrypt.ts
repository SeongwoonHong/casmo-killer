import * as bcrypt from 'bcrypt';

export const compare = (unhashed: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(unhashed, hashed);
};

export const hash = (value: string): Promise<string> => {
  return bcrypt.hash(value, 10);
};
