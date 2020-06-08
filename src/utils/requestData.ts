import axios, { AxiosResponse } from 'axios';
import config from '../common/Config';
import { Dictionary } from '../common/Types';

const instance = axios.create({
  baseURL: config.serverUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 1000 * 60,
});

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
