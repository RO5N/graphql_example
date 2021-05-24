import { AxiosPromise } from 'axios';

const API_PATH = process.env.API_PATH;

type API = {
  get: (url: string) => AxiosPromise;
};

const bikes = (api: API) => {
  const getBikes = () =>
    api.get(
      API_PATH +
        `/graphql?query={
    bikes{
      bike_id
      lat
      lon
      is_reserved
      is_disabled
      vehicle_type
    }
  }`,
    );
  const getBike = (id: string) =>
    api.get(
      API_PATH +
        `/graphql?query={
    bikes(id: "${id}"){
      bike_id
      lat
      lon
      is_reserved
      is_disabled
      vehicle_type
    }
  }`,
    );

  return {
    getBikes,
    getBike,
  };
};

export default bikes;
