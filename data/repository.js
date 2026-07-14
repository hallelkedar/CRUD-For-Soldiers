import { getPool } from "./setup.js";

const pool = getPool();

const createRepo = (tableName) => {
  return {
    async getAll() {
      const query = `SELECT * FROM ${tableName}`;
      const [items] = await pool.execute(query);
      return items;
    },

    async getById(id) {
      const query = `
            SELECT * FROM ${tableName}
            WHERE id = ?
            `;
      const [items] = await pool.execute(query);
      return [item];
    },
    async createItem(data) {
      const keys = Object.keys(data).join(", ");
      const values = Object.values(data);
      const placeholders = values.map((_) => "?").join(", ");

      const query = `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders})`;
      const [result] = await pool.execute(query, values);
      return result.effectedId;
    },
    async updateItem(id, data) {
      const setQuery = Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = Object.values(data);
      const query = `
            UPDATE ${tableName}
            SET ${setQuery}
            WHERE id = ?
            `;
      const [result] = await pool.execute(query, [values, id]);
      return result.affectedRows > 0;
    },
    async deleteItem(id) {
      const query = `
            DELETE FROM ${tableName}
            WHERE id = ?
            `;
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    },
  };
};

export const soldierRepo = createRepo("soldiers");

soldierRepo.updateStatus = async (id, status) => {
    const query = `
    UPDATE ${tableName}
    SET status = ?
    WHERE id = ?
    `
    const [ result ] = await pool.execute(query, [status, id])
    return result.affectedRows > 0;
};

