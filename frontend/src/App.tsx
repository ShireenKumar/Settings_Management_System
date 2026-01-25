import { useEffect, useState } from 'react';
import { Setting } from './types';
import { settingsApi } from './service/api';
import './App.css';

// Making the created time intuitive
function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

function App() {
  // Stores all of the settings
  const [settings, setAllSettings] = useState<Setting[]>([]);

   // Stores if the data was fetched 
  const [datafetched, setDatafetched] = useState(false);

  // Stores the error message
  const [error, setError] = useState('');

  // Total amount of settings
  const [total, setTotal] = useState(0);
  // offset for pagination
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  // search bar constants to find one setting
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<Setting | null>(null);
  const [searching, setSearching] = useState(false);

  // Editing + creating setting modal components
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Delete button confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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

  // handleing the searching
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchId.trim()) {
      setError('Enter a setting ID');
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
        setError('Invalid ID!');
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

  useEffect(() => {
    fetchSettings();
  }, [offset, limit]);

  // Calculates the amount of pages using the total settings (given by the backend queries)
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.floor(offset / limit) + 1;

  // Modal to create a new setting

  const openCreateModal = () => {
    setJsonInput('');
    setError('');
    setModalError('');
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setJsonInput('');
    setModalError('');
  };

  // Handles the modal for creating a new setting 
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    // resets the error and makes the submitLoading to true
    setError('');
    setModalError('');
    setSubmitLoading(true);

    try {
      // When the user enters the jsonInput it sets that to data
      const data = JSON.parse(jsonInput);
      // calls the endpoint for posting a new setting
      await settingsApi.postSetting(data);
      // calls close create modal
      closeCreateModal();
      // then it fetches all the settings 
      fetchSettings();

    } catch (err: any) {
      const msg = err.message?.includes('JSON') ? 'Invalid JSON' : 'Failed to create setting';
      setModalError(msg);

    } finally {
      // at the end it sets the submite loading to false as the user submits
      setSubmitLoading(false);
    }
  };

  // when the user tries to edit the settings 
  const openEditModal = (s: Setting) => {
    // set setEditingSetting with the setting that is being edited 
    setEditingSetting(s);
    // Gets the data that is going to be edited
    setJsonInput(JSON.stringify(s.data, null, 2));
    setError('');
    setModalError('');
    setShowEditModal(true);
  };

  // gets rid of everything
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingSetting(null);
    setJsonInput('');
    setModalError('');
  };

  // Handles the edit setting function 
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSetting) return;

    setError('');
    setModalError('');
    setSubmitLoading(true);

    try {
      // 
      const data = JSON.parse(jsonInput);
      await settingsApi.putSetting(editingSetting.id, data);

      closeEditModal();
      fetchSettings();

      if (searchResult?.id === editingSetting.id) {
        setSearchResult({ ...searchResult, data, updated_at: new Date().toISOString() });
      }
    } catch (err: any) {
      const msg = err.message?.includes('JSON') ? 'Invalid JSON' : 'Failed to update setting';
      setModalError(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const requestDelete = (id: string) => setConfirmDeleteId(id);

  const cancelDelete = () => {
    setConfirmDeleteId(null);
    setDeletingId(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError('');

    try {
      await settingsApi.deleteSetting(id);
      setConfirmDeleteId(null);
      fetchSettings();
      
      if (searchResult?.id === id) clearSearch();
    } catch (err) {
      setError('Failed to delete setting');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div>
            <h1>Settings Manager</h1>
            <p className="subtitle">Manage your application settings with CRUD operations.</p>
          </div>
          <button type="button" className="btn-new" onClick={openCreateModal}>
            <span className="btn-icon">+</span> New Setting
          </button>
        </div>
      </header>

      <main className="app-main">
        {/* Search bar */}
        <section className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Search by setting ID (UUID)..."
              className="search-input"
              aria-label="Search by setting ID"
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
        </section>

        {error && <div className="error-banner" role="alert">{error}</div>}

        {/* Search result */}
        {searchResult && (
          <section className="search-result">
            <h2>Search Result</h2>
            <div className="setting-card">
              <div className="card-header">
                <span className="setting-id-label">Setting ID</span>
                <span className="setting-id">{searchResult.id}</span>
                <div className="card-actions">
                  <button
                    type="button"
                    className="icon-btn icon-edit"
                    onClick={() => openEditModal(searchResult)}
                    aria-label="Edit"
                  />
                  <button
                    type="button"
                    className="icon-btn icon-delete"
                    onClick={() => requestDelete(searchResult.id)}
                    aria-label="Delete"
                  />
                </div>
              </div>
              <pre className="json-block">{JSON.stringify(searchResult.data, null, 2)}</pre>
              <div className="card-footer">
                <span className="last-updated">Last updated: {formatTimeAgo(searchResult.updated_at)}</span>
                <span className="badge badge-active">Active</span>
              </div>
            </div>
          </section>
        )}

        {!searchResult && (
          <>
            <div className="summary-cards">
              <div className="summary-card">
                <span className="summary-label">Total Settings</span>
                <span className="summary-value">{total}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Current Page</span>
                <span className="summary-value">{currentPage} of {totalPages}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Items Per Page</span>
                <span className="summary-value">{limit}</span>
              </div>
            </div>

            {datafetched ? (
              <div className="loading-state">Loading settings…</div>
            ) : (
              <div className="settings-grid">
                {settings.length === 0 ? (
                  <p className="empty-state">No settings found.</p>
                ) : (
                  settings.map((s) => (
                    <div key={s.id} className="setting-card">
                      <div className="card-header">
                        <span className="setting-id-label">Setting ID</span>
                        <span className="setting-id">{s.id}</span>
                        <div className="card-actions">
                          <button
                            type="button"
                            className="icon-btn icon-edit"
                            onClick={() => openEditModal(s)}
                            aria-label="Edit"
                          />
                          <button
                            type="button"
                            className="icon-btn icon-delete"
                            onClick={() => requestDelete(s.id)}
                            aria-label="Delete"
                          />
                        </div>
                      </div>
                      <pre className="json-block">{JSON.stringify(s.data, null, 2)}</pre>
                      <div className="card-footer">
                        <span className="last-updated">Last updated: {formatTimeAgo(s.updated_at)}</span>
                        <span className="badge badge-active">Active</span>
                      </div>
                      {confirmDeleteId === s.id && (
                        <div className="delete-confirm">
                          <p>Delete this setting?</p>
                          <div className="delete-actions">
                            <button type="button" className="btn-cancel" onClick={cancelDelete}>Cancel</button>
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => handleDelete(s.id)}
                              disabled={deletingId === s.id}
                            >
                              {deletingId === s.id ? 'Deleting…' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {totalPages > 1 && !datafetched && (
              <div className="pagination">
                <button
                  type="button"
                  // Previous button which is the offset - limit
                  // Math max ensures the offset is never less than 0
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0}
                >
                  Previous
                </button>
                <span className="pagination-info"> 
                  Showing {offset + 1} to {Math.min(offset + limit, total)} of {total} settings
                </span>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                    // Here we are creating the array of page numbers
                      key={p}
                      type="button"
                      className={currentPage === p ? 'page-btn active' : 'page-btn'}
                      // This allows for the user to click on the page number and be taken to that page
                      onClick={() => setOffset((p - 1) * limit)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  // Going to the next page, setting offset to offset + limit 
                  // Disable the button is its at the last page
                  onClick={() => setOffset(offset + limit)}
                  disabled={offset + limit >= total}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Create modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeCreateModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>New Setting</h2>
            <form onSubmit={handleCreate}>
              {modalError && <div className="error-banner modal-err">{modalError}</div>}
              <label htmlFor="create-json">JSON Data</label>
              <textarea
                id="create-json"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"key": "value"}'
                rows={8}
                required
              />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeCreateModal}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitLoading}>
                  {submitLoading ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {showEditModal && editingSetting && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Setting</h2>
            <form onSubmit={handleEdit}>
              {modalError && <div className="error-banner modal-err">{modalError}</div>}
              <label htmlFor="edit-json">JSON Data</label>
              <textarea
                id="edit-json"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={8}
                required
              />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeEditModal}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitLoading}>
                  {submitLoading ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button type="button" className="help-float" aria-label="Help">?</button>
    </div>
  );
}

export default App;
