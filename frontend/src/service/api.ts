import axios from 'axios';
import { Setting, SettingsResponse } from '../types';

// Grabs backend url
const API_BACKEND_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BACKEND_URL,
});

// frontend service to use endpoints created in the backend
export const settingsApi = {

    // calls endpoint to create a setting
    postSetting: async (given_data: any): Promise<Setting> => {
        const response = await api.post('/settings', given_data);
        return response.data;
    }, 
    // calls endpoint to update a setting
    putSetting: async (given_id: string, given_data: any): Promise<Setting> => {
        const response = await api.put(`/settings/${given_id}`, given_data);
        return response.data;
    }, 
    
    // calls endpoint to delete a setting
    deleteSetting: async (given_id: string): Promise<void> => {
        await api.delete(`/settings/${given_id}`);
    }, 
    
    // calls endpoint to get all settings
    getAllSetting: async (limit = 10, offset = 0): Promise<SettingsResponse> => {
        const response = await api.get(`/settings?limit=${limit}&offset=${offset}`);
        return response.data;
    },
    
    // calls endpoint to get one setting
    getOneSetting: async (given_id: string): Promise<Setting> => {
        const response = await api.get(`/settings/${given_id}`);
        return response.data;
    },
    
};