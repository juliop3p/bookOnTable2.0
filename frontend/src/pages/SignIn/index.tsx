import React, { useCallback } from 'react';
import { Form, Input } from '@rocketseat/unform';
import { FaUser, FaKey } from 'react-icons/fa';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import './styles.css';

import { useAuth } from '../../context/AuthContext';

interface SignInFormData {
  email?: string;
  password?: string;
}

const SignIn: React.FC = () => {
  const { signIn } = useAuth();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        const schema = Yup.object().shape({
          email: Yup.string().email().required('O e-mail é obrigatório'),
          password: Yup.string().required('A senha é obrigatoria'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        signIn({
          email: data.email,
          password: data.password,
        });
      } catch (err) {
        err.errors.map((error: string) => toast.error(error));
      }
    },
    [signIn],
  );

  return (
    <div className="container-fluid height-100 d-flex align-items-center justify-content-center bg-darkpurple-p">
      <div className="col col-lg-4 col-md-6">
        <div className="card bg-white">
          <div className="card-header">
            <h3 className="text-center font-weight-bold">Login</h3>
          </div>
          <div className="card-body">
            <Form onSubmit={handleSubmit}>
              <div className="input-group form-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FaUser size={20} color="#333" />
                  </span>
                </div>
                <Input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Digite o seu E-mail"
                />
              </div>
              <div className="input-group form-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FaKey size={20} color="#333" />
                  </span>
                </div>
                <Input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Digite sua senha"
                />
              </div>
              <button type="submit" className="btn btn-dark w-100">
                <span className="text-uppercase text-lead">Entrar</span>
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
