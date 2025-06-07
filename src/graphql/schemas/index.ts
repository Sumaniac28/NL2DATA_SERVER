import { mergeTypeDefs } from '@graphql-tools/merge';
import { authSchema } from '@/graphql/schemas/auth';
import { coreDataSourceSchema } from '@/graphql/schemas/datasource';
import { postgresqlCollectionSchema } from '@/graphql/schemas/pgCollection';
import { aiChartSchema } from '@/graphql/schemas/aiChart';

export const mergedGQLSchema = mergeTypeDefs([
  authSchema,
  coreDataSourceSchema,
  postgresqlCollectionSchema,
  aiChartSchema
]);
