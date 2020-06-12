import axios, { AxiosResponse } from 'axios';
import config from '../common/Config';
import Dictionary from '../types/Dictionary';

const instance = axios.create({
  baseURL: config.serverUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 1000 * 60,
});

/**
 * Send request to server and return response promise.
 *
 * @param path
 * @param params
 * @return AxiosResponse object
 */
const requestData = async <DataType = never>(
  path: string,
  params?: Dictionary<string>
) => {
  const response: AxiosResponse<DataType> = await instance.get(path, {
    params,
  });

  return response;
};

export default requestData;
