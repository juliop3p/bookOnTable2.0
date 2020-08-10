import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookReader } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <div className="container my-3">
      <Link
        to="/"
        className="d-flex align-items-center justify-content-center no-link-style "
      >
        <FaBookReader size={30} color="#333" />
        <span className="lead ml-3">Book on Table</span>
      </Link>
      <hr />
    </div>
  );
};

export default Header;
