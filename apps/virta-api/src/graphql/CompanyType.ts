import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { Context } from '../context';
import { Company } from '../models/company';
import { StationType } from './StationType';

export const CompanyType = new GraphQLObjectType<Company, Context>({
  name: 'Company',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    parentCompany: {
      type: CompanyType,
      resolve: (company, _args, context) => {
        return context.companyRepository.findById(company.parent_company_id);
      },
    },
    stations: {
      type: new GraphQLList(StationType),
      resolve: (company, args, context) => {
        const childStations = context.stationRepository.getStationsByCompany(
          company.id
        );
        return childStations;
      },
    },
  }),
});
