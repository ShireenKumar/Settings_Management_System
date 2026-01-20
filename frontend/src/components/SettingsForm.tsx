import React, { useState, useEffect } from 'react';
import './SettingsForm.css';
import { Setting } from '../types';

interface SettingsFormProps {
  setting: Setting | null;
  onSubmit: (data: object) => void;
  onCancel: () => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({
  setting,
  onSubmit,
  onCancel,
}) => {
  const [jsonInput, setJsonInput] = useState('{\n  \n}');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (setting) {
      setJsonInput(JSON.stringify(setting.data, null, 2));
    } else {
      setJsonInput('{\n  \n}');
    }
    setError(null);
  }, [setting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const parsed = JSON.parse(jsonInput);
      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('JSON must be an object');
      }
      onSubmit(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError('Cannot format invalid JSON');
    }
  };

  return (
    <div className="settings-form-container">
      <div className="settings-form">
        <h2>{setting ? 'Edit Setting' : 'Create New Setting'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="json-input">JSON Configuration:</label>
            <div className="input-toolbar">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleFormat}
              >
                Format JSON
              </button>
            </div>
            <textarea
              id="json-input"
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setError(null);
              }}
              className={error ? 'error' : ''}
              rows={20}
              placeholder='{\n  "key": "value"\n}'
            />
            {error && <div className="field-error">{error}</div>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {setting ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsForm;
