import React from 'react';
import './SettingsList.css';
import { Setting } from '../types';

interface SettingsListProps {
  settings: Setting[];
  loading: boolean;
  onEdit: (setting: Setting) => void;
  onDelete: (uid: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SettingsList: React.FC<SettingsListProps> = ({
  settings,
  loading,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}) => {
  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  if (settings.length === 0) {
    return (
      <div className="empty-state">
        <p>No settings found. Create your first setting to get started!</p>
      </div>
    );
  }

  return (
    <div className="settings-list">
      <div className="settings-grid">
        {settings.map((setting) => (
          <div key={setting.uid} className="setting-card">
            <div className="setting-header">
              <h3>Setting ID: {setting.uid.substring(0, 8)}...</h3>
              <div className="setting-actions">
                <button
                  className="btn-secondary"
                  onClick={() => onEdit(setting)}
                >
                  Edit
                </button>
                <button
                  className="btn-danger"
                  onClick={() => onDelete(setting.uid)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="setting-content">
              <pre>{JSON.stringify(setting.data, null, 2)}</pre>
            </div>
            <div className="setting-footer">
              <small>
                Created: {new Date(setting.created_at).toLocaleString()}
              </small>
              <small>
                Updated: {new Date(setting.updated_at).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn-secondary"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn-secondary"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsList;
