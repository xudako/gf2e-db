import { asset } from '../utils/utils';

type TableData = Record<string | number, any>;

export class TableLoader {
  private static tables: Record<string, TableData> = {};

  static async load(tablesToLoad: string[]): Promise<void> {
    const promises = tablesToLoad.map(async (name) => {
      const response = await fetch(asset(`tables/${name}.json`));
      if (!response.ok) throw new Error(`Failed to load ${name}.json`);
      const json = await response.json();

      const tableArray = json.data;
      const tableObject: TableData = {};

      if (!Array.isArray(tableArray) || tableArray.length === 0) {
        throw new Error(`No data found in ${name}.json`);
      }
      const firstKey = Object.keys(tableArray[0])[0];
      for (const entry of tableArray) {
        const id = entry[firstKey];
        if (id === undefined) {
          console.warn(`No value for key "${firstKey}" in entry in ${name}:`, entry);
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

export const Tables: Record<string, TableData> = new Proxy(
  {},
  {
    get: (_target, prop: string) => {
      return TableLoader.get(prop);
    },
  }
);
