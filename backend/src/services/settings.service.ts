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

  // Updates/edits a setting
  export const editSetting = async (given_id: string, given_data: any): Promise<Setting> =>{
    const query = `
    UPDATE settings
        SET json_data = $1, updated_log = NOW()
        WHERE id = $2
        RETURNING id, json_data, time_created as created_at, updated_log as updated_at
    `;
    const result = await pool.query(query, [JSON.stringify(given_data), given_id]);
    return {
        id: result.rows[0].id,
        data: result.rows[0].json_data,
        created_at: result.rows[0].created_at,
        updated_at: result.rows[0].updated_at
      };
  };

// Deletes a setting based on user id
export const deleteSetting = async (given_id: string): Promise<void> =>{
    const query = `
    DELETE FROM settings 
        WHERE id = $1
    `;
    await pool.query(query, [given_id]);
    };

// Reading all the settings (with pagination)
export const readAllSetting = async (limit = 10, offset = 0): Promise<{setting_list: Setting[]; total: number}> => {
    
    // Grab the total amount of settings to help with pagination later on
    const countQuery = `
        SELECT COUNT(*) 
        FROM settings`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);
    
    // Get the settings with the set limit and offset for pagination
    const query = `
        SELECT 
            id, 
            json_data as data,    
            time_created as created_at,
            updated_log as updated_at  
        FROM settings
        ORDER BY time_created DESC
        LIMIT $1 
        OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    const setting_list: Setting[] = result.rows;
    
    return {setting_list, total};
}

// Reading one of the settings based on the uid
export const readOneSetting = async (given_id: string): Promise<Setting> => {
    
    // Get the settings with the set limit and offset for pagination
    const query = `
        SELECT 
            id, 
            json_data as data,    
            time_created as created_at,
            updated_log as updated_at
        FROM settings
        WHERE id = $1
    `;
    const result = await pool.query(query, [given_id]);
    
    return {
        id: result.rows[0].id,
        data: result.rows[0].data,
        created_at: result.rows[0].created_at,
        updated_at: result.rows[0].updated_at
      };
}