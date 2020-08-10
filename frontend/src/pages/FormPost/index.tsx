import React from 'react';

import HeaderDashboard from '../../components/HeaderDashboard';
import Form from '../../components/FormPost';

const FormPost: React.FC = () => {
  return (
    <>
      <HeaderDashboard />
      <div className="row justify-content-center mt-5 mb-5">
        <div className="col col-lg-8">
          <Form />
        </div>
      </div>
    </>
  );
};

export default FormPost;
