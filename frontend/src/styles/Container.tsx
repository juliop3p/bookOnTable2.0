import React from 'react';
import PropTypes from 'prop-types';

import Header from '../components/Header';
import Footer from '../components/Footer';

const Container: React.FC = ({ children }) => {
  return (
    <div className="container height-100 d-flex flex-column">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Container;

Container.propTypes = {
  children: PropTypes.node.isRequired,
};
