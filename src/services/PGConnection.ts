import { Pool, PoolClient } from 'pg';
import { IDataSourceDocument, IQueryProp } from '@/interfaces/datasource.interface';
import { GraphQLError } from 'graphql';
import { DatasourceService } from '@/services/DataSourceService';

export async function testPostgreSQLConnection(data: IDataSourceDocument): Promise<string> {
  let client: PoolClient | null = null;
  const { databaseName, databaseUrl, username, password, port } = data;

  const pool: Pool = new Pool({
    host: databaseUrl!,
    user: username!,
    password: password!,
    port: parseInt(`${port}`, 10) ?? 5432,
    database: databaseName!,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    maxUses: 7500,
    ssl:{
      rejectUnauthorized: false 
    }
  });

  try {
    client = await pool.connect();
    await client.query('SELECT 1');
    return 'Successfully connected to PostgreSQL';
  } catch (error: any) {
    throw new GraphQLError(error?.message);
  } finally {
    if (client) client.release();
  }
}

export async function getPostgreSQLCollections(projectId: string, schema: string = 'public'): Promise<string[]> {
  let client: PoolClient | null = null;
  try {
    const project = await DatasourceService.getDataSourceByProjectId(projectId);
    const { databaseName, databaseUrl, username, password, port } = project;

    const pool: Pool = new Pool({
      host: databaseUrl!,
      user: username!,
      password: password!,
      port: parseInt(`${port}`, 10) ?? 5432,
      database: databaseName!,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      maxUses: 7500
    });

    const query = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = $1
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

    client = await pool.connect();
    const result = await client.query(query, [schema]);
    return result.rows.map((row) => row.table_name);
  } catch (error: any) {
    throw new GraphQLError(error?.message);
  } finally {
    if (client) client.release();
  }
}

export async function executePostgreSQLQuery(data: IQueryProp): Promise<Record<string, unknown>[]> {
  let client: PoolClient | null = null;
  try {
    const { projectId, sqlQuery } = data;
    const project = await DatasourceService.getDataSourceByProjectId(projectId);
    const { databaseName, databaseUrl, username, password, port } = project;

    const pool: Pool = new Pool({
      host: databaseUrl!,
      user: username!,
      password: password!,
      port: parseInt(`${port}`, 10) ?? 5432,
      database: databaseName!,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      maxUses: 7500
    });

    client = await pool.connect();
    const result = await client.query(sqlQuery);
    return result.rows ?? [];
  } catch (error: any) {
    throw new GraphQLError(error?.message);
  } finally {
    if (client) client.release();
  }
}
