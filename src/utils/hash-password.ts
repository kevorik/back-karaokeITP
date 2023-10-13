import * as bcrypt from "bcrypt";

export const hashPassword = async (password: any): Promise<any> => {
  const randomSalt = await bcrypt.genSalt(10);

  const result = bcrypt.hash(password, randomSalt);

  return result;
};
