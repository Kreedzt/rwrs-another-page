export interface IDataTableItem {
  id: string;
  name: string;
  ipAddress: string;
  port: number;
  mapId: string;
  mapName: string;
  bots: number;
  country: string;
  currentPlayers: number;
  version: string;
  dedicated: boolean;
  mod: number;
  playerList: string[];
  comment: string;
  url: string;
  maxPlayers: number;
  mode: string;
  realm: string;
}
