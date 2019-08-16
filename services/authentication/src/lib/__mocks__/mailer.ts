const {
  mailer: _mailer,
} = jest.genMockFromModule('../mailer');

_mailer.sendRegisterConfirmation = jest.fn();

export const mailer = _mailer;
