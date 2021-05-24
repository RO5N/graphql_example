import { getBikes } from '../data/bikes';
import { Bike } from '../types/BikeTypes';
import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';

const schema = buildSchema(`
type Bike {
  bike_id: String
  lat: Float
  lon: Float
  is_reserved: Int
  is_disabled: Int
  vehicle_type: String
}

  type Query {
    bikes(id: String): [Bike]
  }
`);

const root = {
  bikes: async (props: any) => {
    if (props.id) {
      return await (await getBikes()).filter((bike: Bike) => bike.bike_id === props.id);
    }
    return await getBikes();
  },
};

export default graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
});
