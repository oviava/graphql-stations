import { Database } from '../db/Database';
import { Point } from '../models/point';
import { companyData } from './companyData';
import { stationData } from './stationData';

const createStationsTableQuery = `
  CREATE TABLE IF NOT EXISTS stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    coordinates POINT NOT NULL,
    company_id INT,
    address VARCHAR(255) NOT NULL,
    SPATIAL INDEX(coordinates)
  );
`;

const createCompaniesTableQuery = `
    CREATE TABLE IF NOT EXISTS companies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      parent_company_id INT NULL,
      name VARCHAR(255) NOT NULL,
      FOREIGN KEY (parent_company_id) REFERENCES companies(id)
    );
`;

const companyQuery = `INSERT IGNORE INTO companies (id, name, parent_company_id) VALUES ? `;
const stationQuery = `INSERT IGNORE INTO stations (name, id, company_id, address, coordinates) VALUES ?`;

export const generateSeed = async () => {
  await Database.getInstance().connect();
  const connection = Database.getInstance().getConnection();

  connection.execute(createCompaniesTableQuery);
  connection.execute(createStationsTableQuery);

  const convertedStationData = stationData.map((station) => [
    station.name,
    station.id,
    station.company_id,
    station.address,
    new Point(station.latitude, station.longitude),
  ]);

  const convertedCompanyData = companyData.map((company) => [
    company.id,
    company.name,
    company.parent_company_id,
  ]);

  // we're not gonna try/catch here, any errors will be caught in the error middleware
  await connection.query(companyQuery, [convertedCompanyData]);
  await connection.query(stationQuery, [convertedStationData]);
};
