let {
  sign: _sign,
} = jest.genMockFromModule('../token-utils');

_sign = jest.fn();

export const sign = _sign;
