// Creates and configures axios instance
import axios from 'axios';
import * as Cookie from 'universal-cookie';

const dev = process.env.NODE_ENV !== 'production';
const isBrowser = typeof window !== 'undefined';
const cookie = new Cookie.default();

let cachedToken = '';

/* Create axios instance */

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

const getToken = () => {
  if (!isBrowser) {
    return null;
  }
  if (cachedToken) {
    return cachedToken;
  }
  cachedToken = cookie.get('userAuthToken');
  return cachedToken;
};

/** In dev, intercepts request and logs it into console for dev */
api.interceptors.request.use(
  async (config) => {
    if (config.url && isBrowser && !(config.url.includes('/sign_in') || config.url.includes('/sign_up'))) {
      const key = await getToken();

      if (key && config.headers) {
        config.headers.Authorization = `bearer ${key}`;
      }
    }
    return config;
  },
  (error) => {
    if (dev) {
      console.error('✉️ ', error); // tslint:disable-line no-console
    }
    console.log('error: ', error);
    return Promise.reject(error);
  },
);

/**
 * Passes response.data to services.
 * In dev, intercepts response and logs it into console for dev
 */
api.interceptors.response.use(
  (response) => {
    if (dev) {
      console.info('📩 ', response); // tslint:disable-line no-console
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      console.log('Request Failed', error);
    }
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (isBrowser) {
        const loc = window.location.pathname;
        if (!(loc.includes('/sign_in') || loc.includes('/sign_up'))) {
          window.location.pathname = '/sign_in';
        }
      }
      throw new axios.Cancel(error.response);
    }
    if (error.response && error.response.status === 429) {
      console.log('Rate Limit Hit!', error.response);
      throw new axios.Cancel('Rate Limit');
    }
    /**
     * API should send an error message in the format
     * { error: <message> }
     */
    if (error.response && error.response.data) {
      if (dev) {
        console.error('Error: ', error.response.data.error); // tslint:disable-line no-console
      }
      console.log('Error on Response [expected]', error.response.data);

      return Promise.reject(error.response.data);
    }
    if (dev) {
      console.error('📩 ', error); // tslint:disable-line no-console
    }
    console.log('Error on Response [unexpected]', error);
    return Promise.reject(error.message);
  },
);

/**
 * Inject api instance to the services.
 * This allows the services to be tested separately if needed.
 */
import users from './users';
import bikes from './bikes';

// These will be used when accessing the services via the *browser*
const userSVC = users(api);
const bikeSVC = bikes(api);

export { userSVC, bikeSVC };
