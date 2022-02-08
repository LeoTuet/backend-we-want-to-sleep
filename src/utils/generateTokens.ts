import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 12);

export const generateTokens = (count: number): string[] => {
  console.info("Test");
  return new Array(count)
    .fill("")
    .map(() => nanoid())
    .map((id) => `${id.slice(0, 4)}-${id.slice(4, 8)}-${id.slice(8, 12)}`);
};
