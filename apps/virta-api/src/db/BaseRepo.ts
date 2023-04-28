import { RowDataPacket } from 'mysql2';
import { Database } from './Database';

export abstract class BaseRepository<T extends RowDataPacket> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  protected getConnection() {
    return Database.getInstance().getConnection();
  }

  public async findById(id: number): Promise<T | null> {
    const connection = this.getConnection();
    const [rows] = await connection.query<T[]>(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );

    rows.length > 0 ? rows[0] : null;

    return rows.length > 0 ? rows[0] : null;
  }

  // we can create some generic filtering and pagination here
  public async findAll(): Promise<T[]> {
    const connection = this.getConnection();
    const [rows] = await connection.query<T[]>(
      `SELECT * FROM ${this.tableName}`
    );
    return rows;
  }
}
