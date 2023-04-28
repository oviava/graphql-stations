import { Company } from '../models/company';
import { BaseRepository } from './BaseRepo';

export class CompanyRepository extends BaseRepository<Company> {
  constructor() {
    super('companies');
  }

  async getChildCompanies(companyId: number): Promise<Company[]> {
    const connection = this.getConnection();

    const [childCompanies] = await connection.query<Company[]>(
      `SELECT * FROM ${this.tableName} WHERE parent_company_id = ?`,
      [companyId]
    );
    return childCompanies;
  }
}
