import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2';

@Injectable()
export class MysqlClient {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_SCHEMA,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  public async executeSql(
    sql: string,
    params?: Array<any>,
  ): Promise<{
    results: any;
    fields: mysql.FieldPacket[];
    connection?: mysql.PoolConnection;
  }> {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, params, (error, results, fields) => {
        if (error) {
          reject(error);
        }
        resolve({ results, fields });
      });
    });
  }

  public async runConnection(): Promise<mysql.PoolConnection> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((error, connection) => {
        if (error) {
          reject(error);
        }
        resolve(connection);
      });
    });
  }

  public async beginTransaction(
    connection: mysql.PoolConnection,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.beginTransaction((error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }

  public async commit(connection: mysql.PoolConnection): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.commit((error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }

  public async rollback(connection: mysql.PoolConnection): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.rollback((error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }

  public async release(connection: mysql.PoolConnection): Promise<void> {
    return new Promise((resolve) => {
      connection.release();
      resolve();
    });
  }
}
