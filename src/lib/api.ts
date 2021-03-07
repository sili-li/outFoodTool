import axios from 'axios';
// import pg from '../../package.json';

const Api = axios.create({
  baseURL: `/api`,
  timeout: 20000,
  headers: {}
});

// const getHeader = () => ({
//   Authorization: 'a-mock-token'
// });

const handleTokenExpired = (err: any) => {
  // do something
};

Api.interceptors.request.use(config => {
  config.headers = { ...config.headers, token: localStorage.getItem('token') };
  return config;
});

Api.interceptors.response.use(
  response => response,
  error => {
    handleTokenExpired(error);
    return Promise.reject(error); // 返回接口返回的错误信息
  }
);

export default Api;
