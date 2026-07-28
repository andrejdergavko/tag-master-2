import { useState } from 'react';
import { Button } from 'antd';

export default function InvoicesPage() {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Ready');

  const handleFetchFirstMessage = async () => {
    try {
      setError(null);
      setStatus('Loading...');

      const result = await window.electron.mail.fetchInboxPreview();
      setStatus(`Loaded: ${JSON.stringify(result)}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to fetch inbox preview';
      setError(message);
      setStatus('Failed');
    }
  };

  return (
    <div>
      <Button type="primary" onClick={handleFetchFirstMessage}>
        Fetch First Message
      </Button>
      <div style={{ marginTop: 16 }}>{status}</div>
      {error ? <div style={{ marginTop: 8, color: 'red' }}>{error}</div> : null}
    </div>
  );
}
