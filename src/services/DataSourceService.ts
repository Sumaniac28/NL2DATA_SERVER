import AppDataSource from '@/database/config';
import { ChartInfo } from '@/entities/chartInfo.entity';
import { Datasource } from '@/entities/datasource.entity';
import { IDataSource } from '@/interfaces/auth.interface';
import { IDataSourceDocument, IDataSourceProjectID } from '@/interfaces/datasource.interface';
import { GraphQLError } from 'graphql';

export class DatasourceService {
  static async createNewDataSource(data: IDataSourceDocument): Promise<IDataSourceDocument> {
    try {
      const datasourceRepository = AppDataSource.getRepository(Datasource);
      const datasource = new Datasource();

      datasource.userId = data.userId!;
      datasource.projectId = data.projectId;
      datasource.type = data.type!;
      datasource.databaseUrl = data.databaseUrl!;
      datasource.port = data.port!;
      datasource.databaseName = data.databaseName!;
      datasource.username = data.username!;
      datasource.password = data.password!;

      const result = await datasourceRepository.save(datasource);
      return result;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  static async getDataSourceByProjectId(projectid: string): Promise<IDataSourceDocument> {
    try {
      const datasourceRepository = AppDataSource.getRepository(Datasource);
      const result: IDataSourceDocument = (await datasourceRepository.findOne({
        where: { projectId: projectid }
      })) as unknown as IDataSourceDocument;
      return result;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  static async getDataSourceById(datasourceId: string): Promise<IDataSourceDocument> {
    try {
      const datasourceRepository = AppDataSource.getRepository(Datasource);
      const result: IDataSourceDocument = (await datasourceRepository.findOne({
        where: { id: datasourceId }
      })) as unknown as IDataSourceDocument;
      return result;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  static async getDataSources(userid: string): Promise<IDataSource[]> {
    try {
      const datasourceRepository = AppDataSource.getRepository(Datasource);
      const result: IDataSourceDocument[] = (await datasourceRepository.find({
        where: { userId: userid },
        order: { createdAt: 'DESC' }
      })) as unknown as IDataSourceDocument[];
      const datasources: IDataSource[] = result.map((item) => {
        const { id, projectId, type, databaseName } = item;
        return {
          id,
          projectId,
          type,
          database: databaseName && databaseName.length > 0 ? databaseName : ''
        };
      }) as IDataSource[];
      return datasources;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  static async editDataSource(data: IDataSourceDocument): Promise<IDataSourceProjectID[]> {
    try {
      const datasourceRepository = AppDataSource.getRepository(Datasource);

      const existing = await datasourceRepository.findOne({
        where: { id: data.id }
      });

      if (!existing) {
        throw new GraphQLError('Datasource not found');
      }

      existing.projectId = data.projectId;
      existing.type = data.type!;
      existing.databaseUrl = data.databaseUrl!;
      existing.port = data.port!;
      existing.databaseName = data.databaseName!;
      existing.username = data.username!;
      existing.password = data.password!;

      await datasourceRepository.save(existing);

      const result: IDataSourceProjectID[] = await this.getDataSources(`${data.userId}`);
      return result;
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  static async deleteDatasource(datasourceId: string): Promise<boolean> {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.manager.delete(ChartInfo, {
        datasourceId
      });

      await queryRunner.manager.delete(Datasource, {
        id: datasourceId
      });

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      // Rollback transaction
      await queryRunner.rollbackTransaction();
      throw new GraphQLError('Failed to delete datasource');
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
}
