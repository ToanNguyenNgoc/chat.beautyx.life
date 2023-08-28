import axios from "axios";
import queryString from "query-string";

export const ENV = queryString.parse(window.location.search) as any
export const baseURL = Number(ENV.e) === 1 ? process.env.REACT_APP_API : process.env.REACT_APP_API_DEV;
export const axiosConfig = axios.create({
  baseURL: baseURL,
  headers: {
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem('token')}`
  },
  paramsSerializer: {
    encode: (param: string) => { },
    serialize: (params) => queryString.stringify(params),
    indexes: false,
  },
});
axiosConfig.interceptors.request.use(async (config) => {
  //handle refresh token hear
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config;
});
axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    throw error;
  }
);
