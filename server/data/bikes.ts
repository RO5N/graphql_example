import axios from 'axios';
import { Bike } from '../types/BikeTypes';

export const getBikes = async () => {
  var data: Bike[] = [];
  await axios.get('https://api.helbiz.com/admin/reporting/arlington/gbfs/free_bike_status.json').then((response) => {
    data = response.data.data.bikes;
  });
  return data;
};
