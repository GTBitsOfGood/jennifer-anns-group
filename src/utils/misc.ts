import crypto from "crypto";

/**
 * This function generates a random number sequence of a given length.
 * For example, if length is 5, the output could be "42985".
 * @param length the length of the random number sequence
 * @returns the random number sequence
 */
export const generateRandomNumberSequence = (length: number): string => {
  const res: string[] = [];
  for (let i = 0; i < length; i++) {
    res.push(crypto.randomInt(10).toString());
  }
  return res.join("");
};
