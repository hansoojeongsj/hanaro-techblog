import { compare } from 'bcryptjs';

export const comparePassword = async (
  plainPasswd: string,
  encPassword: string,
) => compare(plainPasswd, encPassword);
