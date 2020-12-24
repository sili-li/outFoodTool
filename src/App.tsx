import React from 'react';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import AppRouter from './router';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
};

export default App;
