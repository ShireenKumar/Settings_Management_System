import React, { useState, useEffect } from 'react';
import './App.css';
import SettingsList from './components/SettingsList';
import SettingsForm from './components/SettingsForm';
import { Setting } from './types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchSettings = async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/settings?page=${pageNum}&limit=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      setSettings(data.data);
      setTotalPages(data.pagination.totalPages);
      setPage(data.pagination.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleCreate = async (jsonData: object) => {
    try {
      const response = await fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });
      if (!response.ok) {
        throw new Error('Failed to create settings');
      }
      await fetchSettings(page);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create settings');
    }
  };

  const handleUpdate = async (uid: string, jsonData: object) => {
    try {
      const response = await fetch(`${API_URL}/settings/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });
      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
      await fetchSettings(page);
      setEditingSetting(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    }
  };

  const handleDelete = async (uid: string) => {
    if (!window.confirm('Are you sure you want to delete this setting?')) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/settings/${uid}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete settings');
      }
      await fetchSettings(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete settings');
    }
  };

  const handleEdit = (setting: Setting) => {
    setEditingSetting(setting);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingSetting(null);
    setShowForm(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Settings Management System</h1>
      </header>
      <main className="App-main">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
        
        {!showForm ? (
          <>
            <div className="toolbar">
              <button onClick={() => setShowForm(true)} className="btn-primary">
                Create New Setting
              </button>
            </div>
            <SettingsList
              settings={settings}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              page={page}
              totalPages={totalPages}
              onPageChange={fetchSettings}
            />
          </>
        ) : (
          <SettingsForm
            setting={editingSetting}
            onSubmit={editingSetting ? (data) => handleUpdate(editingSetting.uid, data) : handleCreate}
            onCancel={handleCancel}
          />
        )}
      </main>
    </div>
  );
}

export default App;
