import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';
import history from './history';
import config from '../common/config';
import Dictionary from '../types/Dictionary';

const instance = axios.create({
  baseURL: config.serverUrl,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 1000 * 60,
  adapter: cacheAdapterEnhancer(axios.defaults.adapter!, {
    enabledByDefault: false,
  }),
});

const historyPopCache = (axiosConfig: AxiosRequestConfig) => ({
  forceUpdate: history.action === 'PUSH',
  ...axiosConfig,
  cache: true,
});

/**
 * Send request to server and return response promise.
 *
 * @param path
 * @param params
 * @param useCache
 * @return AxiosResponse object
 */
const requestData = async <DataType = never>(
  path: string,
  params?: Dictionary<string>,
  useCache = true
): Promise<AxiosResponse<DataType>> => {
  let axiosConfig: AxiosRequestConfig = { params };
  if (useCache) axiosConfig = historyPopCache(axiosConfig);
  const response = await instance.get(path, axiosConfig);
  return response;
};

export default requestData;
