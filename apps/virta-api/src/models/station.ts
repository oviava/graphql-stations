import { RowDataPacket } from 'mysql2/promise';
import { Coordinates } from './coordinates';

export interface Station extends RowDataPacket {
  id: number;
  name: string;

  coordinates: Coordinates;
  company_id: number;
  address: string;
}

export type GroupedStations = {
  coordinates: Coordinates;
  stations: Station[];
};
