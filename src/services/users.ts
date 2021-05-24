import { AxiosPromise } from 'axios';
import { User } from 'types/UserTypes';

const API_PATH = process.env.API_PATH;

type API = {
  get: (url: string) => AxiosPromise;
  post: (url: string, payload: User) => AxiosPromise;
  patch: (url: string, payload: User) => AxiosPromise;
};

const users = (api: API) => {
  const login = (user: User) => api.post(API_PATH + '/users/login', user);

  return {
    login,
  };
};

export default users;
