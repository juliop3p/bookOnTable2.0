import React, { createContext, useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import api from '../services/api';

interface SignInCredentials {
  email?: string;
  password?: string;
}

interface AuthResponseData {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string;
  user: UserData;
}

interface AuthContextData {
  user: UserData;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@bookOnTable:token');
    const user = localStorage.getItem('@bookOnTable:user');

    if (token && user) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post<AuthResponseData>('sessions', {
      email,
      password,
    });

    const { id, name, token } = response.data;
    const user = { id, name, email };

    localStorage.setItem('@bookOnTable:token', token);
    localStorage.setItem('@bookOnTable:user', JSON.stringify(user));

    api.defaults.headers.Authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@bookOnTable:token');
    localStorage.removeItem('@bookOnTable:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
