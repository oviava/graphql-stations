import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { Context } from '../context';
import { Station } from '../models/station';
import { CompanyType } from './CompanyType';
import { CoordinatesType } from './Coordinates';

export const StationType = new GraphQLObjectType<Station, Context>({
  name: 'Station',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    coordinates: {
      type: CoordinatesType,
    },
    address: { type: new GraphQLNonNull(GraphQLString) },
    company: {
      type: CompanyType,
      resolve: (station, _arg, context) => {
        return context.companyRepository.findById(station.company_id);
      },
    },
  }),
});

export const GroupedStationType = new GraphQLObjectType({
  name: 'GroupedStation',
  fields: () => ({
    coordinates: {
      type: CoordinatesType,
    },
    stations: {
      type: new GraphQLList(StationType),
    },
  }),
});
