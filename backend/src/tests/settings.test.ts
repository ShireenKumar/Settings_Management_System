import request from 'supertest';
import express from 'express';
import settingsRoutes from '../routes/settings.routes';
import * as settingsService from '../services/settings.service';

// Mock the settings service
jest.mock('../services/settings.service');

const app = express();
app.use(express.json());

// Getting the route to test
app.use('/settings', settingsRoutes);

describe('Settings API', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  // test post
  describe('POST /settings', () => {
    it('should create a new setting and return 201', async () => {
      const mockSetting = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        data: { theme: 'dark', language: 'en' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (settingsService.createSetting as jest.Mock).mockResolvedValue(mockSetting);

      const response = await request(app)
        .post('/settings')
        .send({ theme: 'dark', language: 'en' })
        .expect(201);

      expect(response.body).toEqual(mockSetting);
      expect(settingsService.createSetting).toHaveBeenCalledWith({ theme: 'dark', language: 'en' });
    });

    it('should return 400 when request body is empty', async () => {
      const response = await request(app)
        .post('/settings')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(settingsService.createSetting).not.toHaveBeenCalled();
    });
  });

  // test get one setting
  describe('GET /settings/:uid', () => {
    it('should return a setting when it exists', async () => {
      const mockSetting = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        data: { theme: 'dark' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (settingsService.readOneSetting as jest.Mock).mockResolvedValue(mockSetting);

      const response = await request(app)
        .get('/settings/123e4567-e89b-12d3-a456-426614174000')
        .expect(200);

      expect(response.body).toEqual(mockSetting);
    });

    it('should return 404 when setting does not exist', async () => {
      (settingsService.readOneSetting as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/settings/nonexistent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Setting not found');
    });
  });

  // test delete setting
  describe('DELETE /settings/:uid', () => {
    it('should return 204 when deleting a setting (idempotent)', async () => {
      (settingsService.deleteSetting as jest.Mock).mockResolvedValue(undefined);

      await request(app)
        .delete('/settings/123e4567-e89b-12d3-a456-426614174000')
        .expect(204);

      expect(settingsService.deleteSetting).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });
  });

  describe('GET /settings', () => {
    it('should return paginated list of settings', async () => {
      const mockResponse = {
        setting_list: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            data: { theme: 'dark' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '223e4567-e89b-12d3-a456-426614174001',
            data: { theme: 'light' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        total: 2,
      };

      (settingsService.readAllSetting as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .get('/settings?limit=5&offset=2')
        .expect(200);

      expect(response.body).toHaveProperty('setting_list');
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.setting_list).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
      expect(settingsService.readAllSetting).toHaveBeenCalledWith(5, 2);
    });

    it('should use default pagination values when not provided', async () => {
      const mockResponse = {
        setting_list: [],
        total: 0,
      };

      (settingsService.readAllSetting as jest.Mock).mockResolvedValue(mockResponse);

      await request(app)
        .get('/settings')
        .expect(200);

      expect(settingsService.readAllSetting).toHaveBeenCalledWith(10, 0);
    });
  });

  describe('PUT /settings/:uid', () => {
    it('should update a setting and return 200', async () => {
      const mockSetting = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        data: { theme: 'light', fontSize: 16 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (settingsService.editSetting as jest.Mock).mockResolvedValue(mockSetting);

      const response = await request(app)
        .put('/settings/123e4567-e89b-12d3-a456-426614174000')
        .send({ theme: 'light', fontSize: 16 })
        .expect(200);

      expect(response.body).toEqual(mockSetting);
      expect(settingsService.editSetting).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        { theme: 'light', fontSize: 16 }
      );
    });

    it('should return 404 when updating non-existent setting', async () => {
      (settingsService.editSetting as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/settings/nonexistent-id')
        .send({ theme: 'dark' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Setting not found');
    });

    it('should return 400 when request body is empty', async () => {
      const response = await request(app)
        .put('/settings/123e4567-e89b-12d3-a456-426614174000')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(settingsService.editSetting).not.toHaveBeenCalled();
    });
  });
});