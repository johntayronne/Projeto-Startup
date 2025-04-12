import React from 'react';
// Next.js handles routing through its file-based routing system

const App: React.FC = () => {
  // This component is no longer needed for routing purposes as Next.js handles routing
  // through its file-based routing system. However, it's still being imported in index.tsx
  return (
    <div className="min-h-screen bg-gray-50">
      <p>This component is deprecated. Next.js handles routing through its file-based routing system.</p>
    </div>
  );
}

export default App;