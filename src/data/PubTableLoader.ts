import { asset } from '../utils/utils';

type TableData = Record<string | number, any>;

export class PubTableLoader {
  private static tables: Record<string, TableData> = {};

  static async load(tablesToLoad: string[]): Promise<void> {
    const promises = tablesToLoad.map(async (name) => {
      const response = await fetch(asset(`tables/${name}.json`));
      if (!response.ok) throw new Error(`Failed to load ${name}.json`);
      const json = await response.json();

      const tableArray = json.data;
      const tableObject: TableData = {};

      for (const entry of tableArray) {
        const id = entry.id ?? entry.Id ?? entry.ID;
        if (id === undefined) {
          console.warn(`No ID found for entry in ${name}:`, entry);
          continue;
        }
        tableObject[id] = entry;
      }

      this.tables[name] = tableObject;
    });

    await Promise.all(promises);
  }

  static get(tableName: string): TableData {
    const table = this.tables[tableName];
    if (!table) {
      throw new Error(`Table ${tableName} not loaded`);
    }
    return table;
  }
}

export const PubTables: Record<string, TableData> = new Proxy(
  {},
  {
    get: (_target, prop: string) => {
      return PubTableLoader.get(prop);
    },
  }
);
