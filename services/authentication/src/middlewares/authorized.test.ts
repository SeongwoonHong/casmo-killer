import {
  Request,
  Response,
} from 'express';

import { configs } from '~config';
import { isAuthorized } from '~middlewares/authorized';

const {
  COOKIE_AUTH_KEY_NAME: keyName,
} = configs;

describe('authorized route middleware testing', () => {
  it('rejects an unauthorized request', () => {
    const mockedReturnValue = 'mockedReturnValue';
    const mockedHandler = jest.fn();
    const middleware = isAuthorized(
      false,
      mockedHandler,
    );
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedRequest = {} as Request;
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedResponse = {
      clearCookie: jest.fn(),
    } as unknown as Response;
    const mockedNext = jest.fn().mockReturnValue(mockedReturnValue);

    middleware(
      mockedRequest,
      mockedResponse,
      mockedNext,
    );

    expect(mockedNext).not.toHaveBeenCalled();
    expect(mockedResponse.clearCookie).not.toHaveBeenCalled();
    expect(mockedHandler).toHaveBeenCalledWith(mockedResponse);
  });

  it('rejects an unauthorized request and clears cookies', () => {
    const mockedReturnValue = 'mockedReturnValue';
    const mockedHandler = jest.fn();
    const middleware = isAuthorized(
      true,
      mockedHandler,
    );
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedRequest = {} as Request;
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedResponse = {
      clearCookie: jest.fn(),
    } as unknown as Response;
    const mockedNext = jest.fn().mockReturnValue(mockedReturnValue);

    middleware(
      mockedRequest,
      mockedResponse,
      mockedNext,
    );

    expect(mockedNext).not.toHaveBeenCalled();
    expect(mockedResponse.clearCookie).toHaveBeenCalledWith(keyName);
    expect(mockedHandler).toHaveBeenCalledWith(mockedResponse);
  });

  it('passes through an authorized request', async (done) => {
    const mockedReturnValue = 'mockedReturnValue';
    const mockedHandler = jest.fn();
    const middleware = isAuthorized(
      true,
      mockedHandler,
    );
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedRequest = {
      user: {},
    } as unknown as Request;
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedResponse = {
      clearCookie: jest.fn(),
    } as unknown as Response;
    const mockedNext = jest.fn().mockReturnValue(mockedReturnValue);

    const response = await middleware(
      mockedRequest,
      mockedResponse,
      mockedNext,
    );

    expect(mockedNext).toHaveBeenCalled();
    expect(mockedResponse.clearCookie).not.toHaveBeenCalled();
    expect(mockedHandler).not.toHaveBeenCalled();
    expect(response).toEqual(mockedReturnValue);

    done();
  });
});
