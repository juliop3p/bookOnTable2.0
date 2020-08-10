import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { FaFileSignature } from 'react-icons/fa';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import api from '../../services/api';
import { useData } from '../../context/DataContext';

interface CategoryData {
  title?: string;
  description?: string;
  imageURL?: string;
}

interface CategoryResponse {
  title: string;
  description: string;
  imageURL: string;
}

const FormCategory: React.FC = () => {
  const history = useHistory();
  const id = history.location.state;
  const [formData, setFormData] = useState<CategoryData>();
  const { getCategoryById } = useData();

  useEffect(() => {
    const loadCategory = () => {
      getCategoryById(String(id)).then((category) => {
        const { title, description, imageURL } = category;

        return setFormData({
          title,
          description,
          imageURL,
        });
      });
    };

    if (id) {
      loadCategory();
    }
  }, [history, id, getCategoryById]);

  const handleSubmit = async (data: CategoryData): Promise<void> => {
    try {
      const schema = Yup.object().shape({
        title: Yup.string().required('Título é obrigatório.'),
        description: Yup.string().required('Descrição é obrigatório.'),
        imageURL: Yup.string().required('URL da imagem é obrigatório.'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      if (id) {
        const response = await api.put(`/categories/${id}`, data);

        if (response.status === 200) {
          history.push('/dashboard');
          toast.success('Categoria Criada com sucesso!');
        }
      } else {
        const response = await api.post('/categories', data);

        if (response.status === 200) {
          history.push('/dashboard');
          toast.success('Categoria Criada com sucesso!');
        }
      }
    } catch (err) {
      if (err.errors) {
        err.errors.map((error: string) => toast.error(error));
      } else if (err.message) {
        toast.error(err.message);
      }
    }
  };

  return (
    <Form initialData={formData} className="card p-2" onSubmit={handleSubmit}>
      <div className="col d-flex flex-column justify-content-center align-items-center my-3">
        <h3>Criar Categoria</h3>
        <FaFileSignature size={50} color="#333" />
      </div>
      <Input
        type="text"
        name="title"
        className="form-control mb-3"
        placeholder="Digite o titulo do post"
      />
      <Input
        type="text"
        name="description"
        className="form-control mb-3"
        placeholder="Digite a descrição do post"
      />
      <Input
        type="text"
        name="imageURL"
        className="form-control mb-3"
        placeholder="URL da imagem"
      />
      <div className="d-flex">
        <button type="submit" className="btn btn-success col-4 my-3 mr-3">
          Salvar
        </button>
        <button
          type="button"
          className="btn btn-secondary col-4 my-3"
          onClick={() => history.goBack()}
        >
          Voltar
        </button>
      </div>
    </Form>
  );
};

export default FormCategory;
