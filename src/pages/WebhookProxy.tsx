
import React, { useEffect } from 'react';

// This component is just for routing - the actual webhook will be handled server-side
const WebhookProxy: React.FC = () => {
  useEffect(() => {
    // This page shouldn't be accessed directly by users
    window.location.href = '/';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Webhook Endpoint</h1>
        <p className="text-gray-600">This endpoint is for payment notifications only.</p>
      </div>
    </div>
  );
};

export default WebhookProxy;
