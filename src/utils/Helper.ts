const isBrowser: boolean = typeof window !== 'undefined';
import jwt_decode from 'jwt-decode';

// Authentication
import * as Cookie from 'universal-cookie';
const cookie = new Cookie.default();

// eslint-disable-next-line
export const login = (token: string) => {
  if (token) {
    cookie.set('userAuthToken', token, { path: '/' });
  }
  return jwt_decode(token);
};

export const logout = (): void => {
  cookie.remove('userAuthToken', { path: '/' });
  localStorage.removeItem('profilePic');
  if (isBrowser) {
    return window.location.reload();
  }
};

export const isLogedin = (): boolean => {
  const cachedToken = cookie.get('userAuthToken');

  if (cachedToken === null || cachedToken === undefined) {
    return false;
  }

  return true;
};

export default {
  login,
  logout,
  isLogedin,
};
