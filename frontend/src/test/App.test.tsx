import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import * as api from '../service/api';

// Mock the API module to prevent actual HTTP calls during testing
vi.mock('../service/api');

describe('App Component', () => {
  
  // Clear all mocks before each test to ensure test isolation
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Checks that all the main heading renders correctly
  it('renders the app title', () => {
    const mockResponse = {
      setting_list: [],
      pagination: { total: 0, limit: 10, offset: 0 },
    };

    // Test the getAllSetting function to return our mock data
    vi.spyOn(api.settingsApi, 'getAllSetting').mockResolvedValue(mockResponse);

    // Render the App component
    render(<App />);
    
    // Assert that "Settings Manager" heading appears in the document
    expect(screen.getByText('Settings Manager')).toBeInTheDocument();
  });

  // Check that the settings are displayed when API returns data
  it('displays settings when data is fetched', async () => {
    // Mock API response with one setting
    const mockSettings = {
      setting_list: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          data: { theme: 'dark', language: 'en' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      pagination: { total: 1, limit: 10, offset: 0 },
    };

    // Test the getAllSetting function to return the test setting
    vi.spyOn(api.settingsApi, 'getAllSetting').mockResolvedValue(mockSettings);

    // Render the component
    render(<App />);

    // Check that the setting ID is displayed
    await waitFor(() => {
      expect(screen.getByText(/123e4567/)).toBeInTheDocument();
    });
  });

  // Check the error handling when API call fails
  it('displays error message when API fails', async () => {
    // Mock the API to throw an error (simulating network failure)
    vi.spyOn(api.settingsApi, 'getAllSetting').mockRejectedValue(new Error('API Error'));

    // Render the component
    render(<App />);

    // Wait for error handling to complete and verify error message is shown
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch settings/)).toBeInTheDocument();
    });
  });

  // Check that the empty state is displayed when no settings exist
  it('shows "No settings found" when list is empty', async () => {
    // Mock API response with empty settings list
    const mockResponse = {
      setting_list: [],
      pagination: { total: 0, limit: 10, offset: 0 },
    };

    // Mock the API call to return empty data
    vi.spyOn(api.settingsApi, 'getAllSetting').mockResolvedValue(mockResponse);

    // Render the component
    render(<App />);

    // Wait for data fetching and verify empty state message appears
    await waitFor(() => {
      expect(screen.getByText('No settings found.')).toBeInTheDocument();
    });
  });
});