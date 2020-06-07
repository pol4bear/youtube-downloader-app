import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';
import history from './history';
import config from '../common/Config';

const instance = axios.create({
  baseURL: config.serverUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 1000 * 60,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  adapter: cacheAdapterEnhancer(axios.defaults.adapter!, {
    enabledByDefault: false,
  }),
});

const historyPopCache = (): AxiosRequestConfig => ({
  forceUpdate: history.action === 'PUSH',
  cache: true,
});

const requestData = async <DataType = never>(
  path: string,
  callback: (response: AxiosResponse<DataType>) => void
): Promise<void> => {
  const response: AxiosResponse<DataType> = await instance.get(
    path,
    historyPopCache()
  );

  callback(response);
};

export default requestData;
