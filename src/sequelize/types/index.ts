import { QueryInterface } from 'sequelize';
import { umzug } from '..';

export interface Context {
  context: QueryInterface;
}

export type Migration = typeof umzug._types.migration;
