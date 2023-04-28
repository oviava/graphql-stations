import * as mysql2 from 'mysql2/promise';

export class Database {
  private static instance: Database;
  private connection: mysql2.Connection;

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    this.connection = await mysql2.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    });
  }

  public getConnection(): mysql2.Connection {
    return this.connection;
  }
}
