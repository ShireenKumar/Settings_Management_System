import { useEffect, useState } from 'react';
import { Setting } from './types';
import { settingsApi } from './service/api';
import './App.css';

function App() {
  // Stores all of the settings 
  const [settings, setSettings] = useState<Setting[]>([]);
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

  // Constant to get one setting
  const fetchSettings = async () => {
    // setting the data fetched to true
    setDatafetched(true);
    // clearing out the error message
    setError('');
    
    try {
      // Fetch all of the settings in the database using api service
      const response = await settingsApi.getAllSetting(limit, offset);
      setSettings(response.setting_list);
      setTotal(response.pagination.total);
    } catch (err) {
      setError('Failed to fetch settings');
      console.error(err);
    } finally {
      // Turn off the fetched status
      setDatafetched(false);  
    }
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
      
      {error && <div className="error">{error}</div>}
      
      {/* Shows the total amount of settings */}
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
            // maps the settings into 'pretty print'
            settings.map((setting) => (
              <div key={setting.id} className="setting-item">
                <p><strong>ID:</strong> {setting.id}</p>
                <pre>{JSON.stringify(setting.data, null, 2)}</pre>
                <p><small>Created: {new Date(setting.created_at).toLocaleString()}</small></p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination controls */}
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
    </div>
  );

  }

export default App;
