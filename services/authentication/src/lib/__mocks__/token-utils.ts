import { mockedToken } from '~lib/test-utils';

let {
  sign: _sign,
} = jest.genMockFromModule('../token-utils');

_sign = jest.fn().mockResolvedValue(mockedToken);

export const sign = _sign;
