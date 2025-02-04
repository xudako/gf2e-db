class TableLoader {
  private cache: Record<string, any> = {};

  private tables: Record<string, any> = import.meta.glob("./tables/*.json", {
    eager: true,
  });

  constructor() {
    Object.entries(this.tables).forEach(([key, value]) => {
      const tableName = key.replace("./tables/", "").replace(".json", "");
      this.cache[tableName] = this.transformData(value);
    });
  }

  private transformData(data: any): Record<string, any> {
    return data.data.reduce((acc: Record<string, any>, item: any) => {
      const firstKey = Object.keys(item)[0];
      if (firstKey) {
        acc[item[firstKey]] = item;
      }
      return acc;
    }, {});
  }

  public getTable(name: string): Record<string, any> {
    if (this.cache[name]) {
      return this.cache[name];
    }
    throw new Error(`Table ${name} not found`);
  }
}

type TablesProxy = {
  [key: string]: any;
};

const Tables = new Proxy(new TableLoader(), {
  get(target: TableLoader, prop: string) {
    return target.getTable(prop);
  },
}) as TablesProxy;

export default Tables;
