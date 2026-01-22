import { useEffect, useState } from 'react';
import { Setting } from './types';
import { settingsApi } from './service/api';
import './App.css';

function App() {
  // Stores all of the settings 
  const [settings, setAllSettings] = useState<Setting[]>([]);

  // Stores one setting
  const [oneSetting, setOneSetting] = useState<Setting>();

  // Stores if the data was fetched 
  const [datafetched, setDatafetched] = useState(false);
  // Stores the error message
  const [error, setError] = useState('');

  // Total amount of settings
  const [total, setTotal] = useState(0);
  // offset for pagination
  const [offset, setOffset] = useState(0);
  // set limit 
  const limit = 10;

  // search bar constants to find one setting
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<Setting | null>(null);
  const [searching, setSearching] = useState(false);

  // Constant to get one setting
  const fetchSettings = async () => {
    // setting the data fetched to true
    setDatafetched(true);
    // clearing out the error message
    setError('');
    
    try {
      // Fetch all of the settings in the database using api service
      const response = await settingsApi.getAllSetting(limit, offset);
      setAllSettings(response.setting_list);
      setTotal(response.pagination.total);
    } catch (err) {
      setError('Failed to fetch settings');
      console.error(err);
    } finally {
      // Turn off the fetched status
      setDatafetched(false);  
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchId.trim()) {
      setError('Enter in a setting ID');
      return;
    }

    // set search constants
    setSearching(true);
    setError('');
    setSearchResult(null);
    
    try {
      // call frontend service 
      const given_id = await settingsApi.getOneSetting(searchId.trim());
      setSearchResult(given_id);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Invalid id!');
      } else {
        setError('Failed to search for setting');
      }
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchId('');
    setSearchResult(null);
    setError('');
  };

  // load the page by getting all of the settings and refresh when the offset changes
  useEffect(() => {
    fetchSettings();
  }, [offset]);

  // calculates the amount of pages the user sees
  const totalPages = Math.ceil(total / limit); 
  // calculates the page the user is on
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="App">
      <h1>Settings Management</h1>
      
      {/* Search Bar */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter setting ID (UUID)..."
            className="search-input"
          />
          <button type="submit" disabled={searching} className="search-btn">
            {searching ? 'Searching...' : 'Search'}
          </button>
          {searchResult && (
            <button type="button" onClick={clearSearch} className="clear-btn">
              Clear
            </button>
          )}
        </form>
      </div>

      {error && <div className="error">{error}</div>}
      
      {/* Search Result */}
      {searchResult && (
        <div className="search-result">
          <h2>Search Result</h2>
          <div className="setting-item">
            <p><strong>ID:</strong> {searchResult.id}</p>
            <pre>{JSON.stringify(searchResult.data, null, 2)}</pre>
            <p><small>Created: {new Date(searchResult.created_at).toLocaleString()}</small></p>
            <p><small>Updated: {new Date(searchResult.updated_at).toLocaleString()}</small></p>
          </div>
        </div>
      )}

      {/* Only show list if not showing search result */}
      {!searchResult && (
        <>
          <div className="info">
            Total Settings: {total} | Page {currentPage} of {totalPages || 1}
          </div>
          
          {datafetched ? (
            <div>Fetching Data...</div>
          ) : (
            <div className="settings-list">
              {settings.length === 0 ? (
                <p>No settings found.</p>
              ) : (
                settings.map((setting) => (
                  <div key={setting.id} className="setting-item">
                    <p><strong>ID:</strong> {setting.id}</p>
                    <pre>{JSON.stringify(setting.data, null, 2)}</pre>
                    <p><small>Created: {new Date(setting.created_at).toLocaleString()}</small></p>
                    <p><small>Updated: {new Date(setting.updated_at).toLocaleString()}</small></p>
                  </div>
                ))
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setOffset(offset + limit)}
                disabled={offset + limit >= total}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  }

export default App;
