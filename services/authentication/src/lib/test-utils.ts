export const resCookieParser = (cookieString: string[]): {
  [key: string]: string,
} => {
  if (cookieString.length < 1) {
    return {};
  }

  return cookieString
    .reduce(
      (acc, curr) => {
        const payload = curr.split(';')[0];
        const cookiePair = payload && payload.split('=');

        return {
          ...acc,
          ...(payload && cookiePair && {
            [cookiePair[0]]: cookiePair[1],
          }),
        };
      },
      {},
    );
};

export const testUsers = [
  {
    avatar: null,
    display_name: 'tester_one',
    email: 'tester_one@damso.com',
    password: 'tester_one',
  },
  {
    avatar: null,
    display_name: 'tester_two',
    email: 'tester_two@damso.com',
    password: 'tester_two',
  },
  {
    avatar: null,
    display_name: 'tester_three',
    email: 'tester_three@damso.com',
    password: 'tester_three',
  },
];
