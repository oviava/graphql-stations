import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { CompanyType } from './CompanyType';
import { GroupedStationType, StationType } from './StationType';
import { GroupedStations, Station } from '../models/station';

const groupStationsByCoordinates = (stations: Station[]) => {
  return stations.reduce((acc: GroupedStations[], station) => {
    const groupedStation = acc.find(
      (groupedStation) =>
        groupedStation.coordinates.x === station.coordinates.x &&
        groupedStation.coordinates.y === station.coordinates.y
    );

    if (groupedStation) {
      groupedStation.stations.push(station);
    } else {
      acc.push({
        coordinates: station.coordinates,
        stations: [station],
      });
    }

    return acc;
  }, []);
};

/**
 * I haven't done graphql in 3 years now, I started with doing
 * the implementation Relay compatible to use Relay as a client
 *
 * I've went back as it was eating too much of my time reading docs
 */

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      findAllChildStations: {
        type: new GraphQLList(GroupedStationType),
        args: {
          coords: {
            type: new GraphQLInputObjectType({
              name: 'CoordinatesInput',
              fields: {
                x: { type: new GraphQLNonNull(GraphQLFloat) },
                y: { type: new GraphQLNonNull(GraphQLFloat) },
              },
            }),
          },
          distanceInKm: { type: new GraphQLNonNull(GraphQLFloat) },
          companyId: { type: new GraphQLNonNull(GraphQLInt) },
        },
        resolve: async (_root, args, context) => {
          const stations: Station[] =
            await context.stationRepository.getStationsFromAllChildCompanies(
              args.companyId,
              args.coords,
              args.distanceInKm
            );

          console.log(stations);

          return groupStationsByCoordinates(stations);
        },
      },
      /** maped these extra fields as en example */
      Company: {
        type: CompanyType,
        args: {
          id: { type: GraphQLInt },
        },
        resolve: (_root, args, context) => {
          return context.companyRepository.findById(args.id);
        },
      },
      Companies: {
        type: new GraphQLList(CompanyType),
        resolve: (_root, _args, context) => {
          return context.companyRepository.findAll();
        },
      },
      Station: {
        type: StationType,
        args: {
          id: { type: GraphQLInt },
        },
        resolve: (_root, args, context) => {
          return context.stationRepository.findById(args.id);
        },
      },
    },
  }),
});
