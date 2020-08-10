import React from 'react';
import PropTypes from 'prop-types';

import { AuthProvider } from './AuthContext';
import { DataProvider } from './DataContext';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <DataProvider>{children}</DataProvider>
  </AuthProvider>
);

export default AppProvider;

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
