import { pool } from '../config/database';
import { Setting } from '../types/settings.type';

// Creates a setting with a given json
export const createSetting = async (given_data: any): Promise<Setting> =>{
    const query = `
    INSERT into settings (json_data)
    VALUES($1)
    RETURNING id, json_data, time_created as created_at, updated_log as updated_at
    `;
    const result = await pool.query(query, [JSON.stringify(given_data)]);
    return {
        id: result.rows[0].id,
        data: result.rows[0].json_data,
        created_at: result.rows[0].created_at,
        updated_at: result.rows[0].updated_at
      };
  };