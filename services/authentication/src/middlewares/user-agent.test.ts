import {
  Request,
  Response,
} from 'express';

import { userAgentMapper } from '~middlewares/user-agent';

describe('user agent middleware testing', () => {
  it('maps user agent to request object', () => {
    // tslint:disable-next-line:max-line-length
    const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36';
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedRequest = {
      headers: {
        ['user-agent']: userAgent,
      },
    } as Request;
    const mockedNext = jest.fn();

    userAgentMapper()(
      mockedRequest,
      // tslint:disable-next-line:no-object-literal-type-assertion
      {} as Response,
      mockedNext,
    );

    expect((mockedRequest as any).user_agent).toEqual(userAgent);
    expect(mockedNext).toHaveBeenCalled();
  });

  it('sets user agent to null if user agent is not provided', () => {
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedRequest = {
      headers: {},
    } as Request;
    const mockedNext = jest.fn();

    userAgentMapper()(
      mockedRequest,
      // tslint:disable-next-line:no-object-literal-type-assertion
      {} as Response,
      mockedNext,
    );

    expect((mockedRequest as any).user_agent).toEqual(null);
    expect(mockedNext).toHaveBeenCalled();
  });
});
