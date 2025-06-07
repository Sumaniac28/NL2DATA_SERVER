import { AuthResolver } from '@/graphql/resolvers/auth';
import { CoreDatasourceResolver } from '@/graphql/resolvers/datasource';
import { PostgreSQLCollectionResolver } from '@/graphql/resolvers/pgCollection';
import { AiChartResolver } from '@/graphql/resolvers/aiChart';
import { ChartInfoResolver } from '@/graphql/resolvers/chartInfo';

export const mergedGQLResolvers = [
  AuthResolver,
  CoreDatasourceResolver,
  PostgreSQLCollectionResolver,
  AiChartResolver,
  ChartInfoResolver
];
