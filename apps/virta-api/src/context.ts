import { CompanyRepository } from './db/CompanyRepository';
import { Database } from './db/Database';
import { StationRepository } from './db/StationRepository';

export const createContext = async () => {
  await Database.getInstance().connect();

  const companyRepository = new CompanyRepository();
  const stationRepository = new StationRepository();
  return {
    companyRepository,
    stationRepository,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
