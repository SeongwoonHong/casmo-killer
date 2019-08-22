import { generateRandomNum } from './miscel';

it('generates a random number within a given range', () => {
  const from = 3;
  const to = 7;

  // tslint:disable-next-line:no-increment-decrement
  for (let i = 0; i < 10000; i++) {
    const randomNum = generateRandomNum(from, to);
    expect(randomNum >= from && randomNum < to).toBe(true);
  }
});
