import { RowDataPacket } from 'mysql2/promise';

export interface Company extends RowDataPacket {
  id: number;
  name: string;
  parent_company_id: number | null;
}
