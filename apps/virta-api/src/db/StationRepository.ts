import { Station } from '../models/station';
import { BaseRepository } from './BaseRepo';
import { Point } from '../models/point';

export class StationRepository extends BaseRepository<Station> {
  constructor() {
    super('stations');
  }

  async getStationsByCompany(companyId: number) {
    const connection = this.getConnection();

    const stations = await connection.query(
      `SELECT * FROM ${this.tableName} WHERE company_id = ?`,
      [companyId]
    );
    return stations;
  }

  public async getStationsFromAllChildCompanies(
    companyId: number,
    coords: {
      x: number;
      y: number;
    },
    distanceInKm: number
  ): Promise<Station[]> {
    const connection = this.getConnection();

    const point = new Point(coords.x, coords.y);

    const [rows] = await connection.query<Station[]>(
      `WITH RECURSIVE company_hierarchy AS (
          SELECT id
          FROM companies
          WHERE id = ?
          
          UNION ALL
          
          SELECT c.id
          FROM companies c
          JOIN company_hierarchy ch ON c.parent_company_id = ch.id
      )
      SELECT s.*,
            ST_Distance_Sphere(s.coordinates, ?) / 1000 as distance_in_km
      FROM ${this.tableName} s
      JOIN company_hierarchy ch ON s.company_id = ch.id
      HAVING distance_in_km <= ?
      ORDER BY distance_in_km;`,
      [companyId, point, distanceInKm]
    );

    return rows;
  }
}
