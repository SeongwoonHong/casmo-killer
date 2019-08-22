jest.mock('csrf');

import * as Csrf from 'csrf';
import {
  Request,
  Response,
} from 'express';

import { configs } from '~config';
import { constants } from '~constants';

import { csurferify } from '~middlewares/seesurf';

const {
  COOKIE_CSRF_KEY_NAME: keyName,
} = configs;
const {
  HEADER_NAME_FOR_CSRF_TOKEN: csrfHeaderName,
} = constants;

describe('csrf middleware testing', () => {
  const Token = new Csrf();

  it('sksips csrf verification for a GET request', () => {
    const mockedReturnValue = 'mockedReturnValue';
    const mockedHandler = jest.fn();
    const middleware = csurferify(mockedHandler);
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedRequest = {
      method: 'GET',
    } as unknown as Request;
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedResponse = {
      get: jest.fn(),
    } as unknown as Response;
    const mockedNext = jest.fn().mockReturnValue(mockedReturnValue);

    const response = middleware(
      mockedRequest,
      mockedResponse,
      mockedNext,
    );

    expect(mockedResponse.get).not.toHaveBeenCalled();
    expect(Token.verify).not.toHaveBeenCalled();
    expect(mockedHandler).not.toHaveBeenCalled();
    expect(mockedNext).toHaveBeenCalled();
    expect(response).toEqual(mockedReturnValue);
  });

  it('rejects a request with an invalid csrf token', () => {
    Token.verify = jest.fn().mockReturnValue(false);

    const mockedReturnValue = 'mockedReturnValue';
    const mockedHandler = jest.fn().mockReturnValue(mockedReturnValue);
    const middleware = csurferify(mockedHandler);
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedRequest = {
      get: jest.fn().mockReturnValue(mockedReturnValue),
      method: 'POST',
      signedCookies: {
        [keyName]: mockedReturnValue,
      },
    } as unknown as Request;
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedResponse = {
      clearCookie: jest.fn(),
    } as unknown as Response;
    const mockedNext = jest.fn().mockReturnValue(mockedReturnValue);

    const response = middleware(
      mockedRequest,
      mockedResponse,
      mockedNext,
    );

    expect(mockedRequest.get).toHaveBeenCalledWith(csrfHeaderName);
    expect(mockedResponse.clearCookie).toHaveBeenCalledWith(keyName);
    expect(mockedHandler).toHaveBeenCalledWith(mockedResponse);
    expect(response).toEqual(mockedReturnValue);
  });

  it('rejects a request with no csrf secret', () => {
    const mockedReturnValue = 'mockedReturnValue';
    const mockedHandler = jest.fn().mockReturnValue(mockedReturnValue);
    const middleware = csurferify(mockedHandler);
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedRequest = {
      get: jest.fn().mockReturnValue(mockedReturnValue),
      method: 'POST',
      signedCookies: {},
    } as unknown as Request;
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedResponse = {
      clearCookie: jest.fn(),
    } as unknown as Response;
    const mockedNext = jest.fn().mockReturnValue(mockedReturnValue);

    const response = middleware(
      mockedRequest,
      mockedResponse,
      mockedNext,
    );

    expect(mockedRequest.get).not.toHaveBeenCalled();
    expect(mockedResponse.clearCookie).toHaveBeenCalledWith(keyName);
    expect(mockedHandler).toHaveBeenCalledWith(mockedResponse);
    expect(response).toEqual(mockedReturnValue);
  });

  it('rejects a request with no csrf token', () => {
    const mockedReturnValue = 'mockedReturnValue';
    const mockedHandler = jest.fn().mockReturnValue(mockedReturnValue);
    const middleware = csurferify(mockedHandler);
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedRequest = {
      get: jest.fn().mockReturnValue(''),
      method: 'POST',
      signedCookies: {
        [keyName]: mockedReturnValue,
      },
    } as unknown as Request;
    // tslint:disable-next-line:no-object-literal-type-assertion
    const mockedResponse = {
      clearCookie: jest.fn(),
    } as unknown as Response;
    const mockedNext = jest.fn().mockReturnValue(mockedReturnValue);

    const response = middleware(
      mockedRequest,
      mockedResponse,
      mockedNext,
    );

    expect(mockedRequest.get).toHaveBeenCalledWith(csrfHeaderName);
    expect(mockedResponse.clearCookie).toHaveBeenCalledWith(keyName);
    expect(mockedHandler).toHaveBeenCalledWith(mockedResponse);
    expect(response).toEqual(mockedReturnValue);
  });
});
