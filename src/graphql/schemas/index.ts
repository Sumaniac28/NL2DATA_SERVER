import { mergeTypeDefs } from '@graphql-tools/merge';
import { authSchema } from '@/graphql/schemas/auth';

export const mergedGQLSchema = mergeTypeDefs([authSchema]);
