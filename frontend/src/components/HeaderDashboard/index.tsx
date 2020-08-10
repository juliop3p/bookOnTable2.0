import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

import { useAuth } from '../../context/AuthContext';

const HeaderDashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <>
      <div className="row p-3">
        <div className="col">
          <Link to="/dashboard">
            <h2>Dashboard</h2>
          </Link>
          <strong className="text-muted">
            Bem-vindo a Dashboard, &nbsp;
            {user.name}
            <span>.</span>
          </strong>
        </div>
        <div className="col d-flex justify-content-end align-items-center">
          <span onClick={signOut} className="pointer">
            <strong>Sair</strong>
            &nbsp;
            <FaSignOutAlt size={18} color="#333" />
          </span>
        </div>
      </div>
      <div className="col">
        <hr />
      </div>
    </>
  );
};

export default HeaderDashboard;
