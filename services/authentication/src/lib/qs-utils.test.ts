import {
  Request,
  Response,
} from 'express';

import {
  parseCSV,
  parseQs,
  queryStringMapper,
} from '~lib/qs-utils';

it('returns a middleware with correct parsers', () => {
  const mockedValue = 'mockedValue';
  const queryParser = jest.fn().mockReturnValue(mockedValue);
  const csvParser = jest.fn();

  const queryObj = {
    request: 'query',
  };
  const nextMock = jest.fn().mockReturnValue(mockedValue);

  // tslint:disable-next-line:no-object-literal-type-assertion
  const requestMock = {
    query: {
      ...queryObj,
    },
  } as Request;

  const parsedQuery = queryStringMapper(
    queryParser,
    csvParser,
  )(
    requestMock,
    // tslint:disable-next-line:no-object-literal-type-assertion
    {} as Response,
    nextMock,
  );

  expect(queryParser).toHaveBeenCalledWith(
    queryObj,
    csvParser,
  );
  expect(nextMock).toHaveBeenCalled();
  expect(parsedQuery).toEqual(mockedValue);
  expect(requestMock.query).toEqual(mockedValue);
});

it('parses a given query string into an object', () => {
  const mockValue = 'mockValue';
  const mockParser = jest.fn().mockReturnValue(mockValue);

  const mockedResult = parseQs(
    null,
    mockParser,
  );

  expect(mockParser).toHaveBeenCalledWith('');
  expect(mockParser).toHaveBeenCalledWith('');
  expect(mockParser).toHaveBeenCalledWith('');
  expect(mockedResult).toEqual({
    exclude_fields: mockValue,
    return_fields: mockValue,
    search_field: 'id',
    search_values: mockValue,
  });
});

it('parses csv and returns an array of strings', () => {
  expect(parseCSV()).toEqual([]);
  expect(parseCSV(undefined)).toEqual([]);
  expect(parseCSV(null)).toEqual([]);
  expect(parseCSV('a,s,df,qwert    '))
    .toEqual(['a', 's', 'df', 'qwert']);
  expect(parseCSV('nvasdkfj.asdfa.vadsfas...*&(*'))
    .toEqual(['nvasdkfj.asdfa.vadsfas...*&(*']);
  expect(parseCSV('1239809,adfsa123,adfasdf,,,)(*)'))
    .toEqual(['1239809', 'adfsa123', 'adfasdf', ')(*)']);
});

it('parses and formats query string', () => {
  const parser = queryStringMapper();
  const forbiddenQuery = {
    miscel: 'number',
    random: 'string',
    util: '',
  };
  const queryToParse = {
    exclude_fields: 'a,s,df,qwert    ',
    return_fields: 'nvasdkfj.asdfa.vadsfas...*&(*',
    search_values: '1239809,adfsa123,adfasdf,,,)(*)',
  };
  const nextMock = jest.fn();
  // tslint:disable-next-line:no-object-literal-type-assertion
  const mockRequest = {
    query: {
      ...queryToParse,
      ...forbiddenQuery,
    },
  } as Request;

  parser(
    mockRequest,
    // tslint:disable-next-line:no-object-literal-type-assertion
    {} as Response,
    nextMock,
  );

  expect(nextMock).toHaveBeenCalled();

  Object.keys(forbiddenQuery).forEach((forbiddenKey) => {
    expect(mockRequest.query).not.toHaveProperty(forbiddenKey);
  });

  Object.keys(queryToParse).forEach((forbiddenKey) => {
    expect(mockRequest.query).toHaveProperty(forbiddenKey);
  });

  expect(mockRequest.query.exclude_fields).toEqual(['a', 's', 'df', 'qwert']);
  expect(mockRequest.query.return_fields).toEqual(['nvasdkfj.asdfa.vadsfas...*&(*']);
  expect(mockRequest.query.search_field).toEqual('id');
  expect(mockRequest.query.search_values).toEqual(['1239809', 'adfsa123', 'adfasdf', ')(*)']);
});
