import React from 'react';

import HeaderDashboard from '../../components/HeaderDashboard';
import Form from '../../components/FormCategory';

const FormCategory: React.FC = () => {
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

export default FormCategory;
