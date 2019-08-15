import * as rp from 'request-promise';

export const getBase64 = async (uri: string): Promise<string> => {
  const options = {
    encoding: null,
    method: 'GET',
    transform: (body, response) => ({
      data: body,
      headers: response.headers,
    }),
    uri,
  };
  const {
    data,
    headers,
  } = await rp(options);

  const contentType = headers['content-type'];
  const buffer = Buffer
    .from(data)
    .toString('base64');

  return `data:${contentType};base64,${buffer}`;
};
