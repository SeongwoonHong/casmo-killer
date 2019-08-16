const {
  aws: _aws,
} = jest.genMockFromModule('../aws');

_aws.uploadImageData = jest
  .fn()
  .mockImplementation((id, url) => {
    return Promise.resolve(url.slice(0, 30));
  });

_aws.uploadImageFromUrl = jest
  .fn()
  .mockImplementation((id, url) => {
    return Promise.resolve(url.slice(0, 30));
  });

export const aws = _aws;
