import { GraphQLFloat, GraphQLNonNull, GraphQLObjectType } from 'graphql';

export const CoordinatesType = new GraphQLObjectType({
  name: 'Coordinates',
  fields: () => ({
    x: { type: new GraphQLNonNull(GraphQLFloat) },
    y: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});
