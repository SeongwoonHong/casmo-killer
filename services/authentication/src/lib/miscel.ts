export const generateRandomNum = (from: number, to: number): number => {
  return Math.abs(Math.random() * (to - from) + from);
};
