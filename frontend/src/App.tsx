import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Container from './styles/Container';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import './styles/styles.css';
import 'react-toastify/dist/ReactToastify.css';

import AppProvider from './context';

import Routes from './routes';

const App: React.FC = () => {
  return (
    <>
      <AppProvider>
        <Router>
          <Container>
            <Routes />
          </Container>
        </Router>
      </AppProvider>
      <ToastContainer autoClose={3000} />
    </>
  );
};

export default App;
