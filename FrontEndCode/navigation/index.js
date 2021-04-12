import React from 'react';
import { AuthProvider } from './AuthProvider.js';
import Routes from './Routes';

const Providers = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default Providers;