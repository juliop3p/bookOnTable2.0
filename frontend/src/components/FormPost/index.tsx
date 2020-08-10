import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';

import { FaFileSignature } from 'react-icons/fa';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

// For Draft.js
import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateToHTML } from 'draft-js-export-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import api from '../../services/api';
import { useData } from '../../context/DataContext';

interface CategoryData {
  _id: string;
  title: string;
}

interface CategoryResponse {
  categories: CategoryData[];
}

const FormPost: React.FC = () => {
  const history = useHistory();
  const id = history.location.state;
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    imageURL: '',
    videoURL: '',
    category: '',
  });

  const [textEnglish, setTextEnglish] = useState(() =>
    EditorState.createEmpty(),
  );

  const [textPortuguese, setTextPortuguese] = useState(() =>
    EditorState.createEmpty(),
  );

  const [summary, setSummary] = useState(() => EditorState.createEmpty());

  const { getPostById } = useData();

  const convertHtmlToDraft = (data: string) => {
    const blocksFromHtml = htmlToDraft(data);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap,
    );
    const editorState = EditorState.createWithContent(contentState);

    return editorState;
  };

  useEffect(() => {
    async function loadCategories(): Promise<void> {
      const { data } = await api.get<CategoryResponse>('/categories', {
        params: {
          all: true,
        },
      });
      setCategories(data.categories);
    }

    loadCategories();
  }, []);

  useEffect(() => {
    const loadPost = () => {
      getPostById(String(id)).then((post) => {
        const {
          title,
          description,
          type,
          imageURL,
          videoURL,
          textEnglish,
          textPortuguese,
          summary,
        } = post;

        setTextEnglish(convertHtmlToDraft(textEnglish));
        setTextPortuguese(convertHtmlToDraft(textPortuguese));
        setSummary(convertHtmlToDraft(summary));

        return setFormData({
          title,
          description,
          type,
          imageURL,
          videoURL,
          category: post.category._id,
        });
      });
    };

    if (id) {
      loadPost();
    }
  }, [history, id, getPostById]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const currentData = {
      ...formData,
      textEnglish: stateToHTML(textEnglish.getCurrentContent()),
      textPortuguese: stateToHTML(textPortuguese.getCurrentContent()),
      summary: stateToHTML(summary.getCurrentContent()),
    };

    try {
      const schema = Yup.object().shape({
        title: Yup.string().required('Título é obrigatório.'),
        type: Yup.string().required('Tipo é obrigatório.'),
        description: Yup.string().required('Descrição é obrigatório.'),
        imageURL: Yup.string().required('URL da imagem é obrigatório.'),
        videoURL: Yup.string().required('URL do vídeo é obrigatório.'),
        textEnglish: Yup.string().required('Texto em inglês é obrigatório.'),
        textPortuguese: Yup.string().required(
          'Texto em português é obrigatório.',
        ),
        summary: Yup.string().required('Sumário é obrigatório.'),
        category: Yup.string().required('Categoria é obrigatório.'),
      });

      await schema.validate(currentData, {
        abortEarly: false,
      });

      if (id) {
        const response = await api.put(`/posts/${id}`, currentData);

        if (response.status === 200) {
          history.push('/dashboard');
          toast.success('Post Criada com sucesso!');
        }
      } else {
        const response = await api.post('/posts', currentData);

        if (response.status === 200) {
          history.push('/dashboard');
          toast.success('Post Criada com sucesso!');
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

  const { title, description, type, imageURL, videoURL, category } = formData;

  return (
    <form className="card p-2" onSubmit={handleSubmit}>
      <div className="col d-flex flex-column justify-content-center align-items-center my-3">
        <h3>Criar novo Post</h3>
        <FaFileSignature size={50} color="#333" />
      </div>
      <input
        type="text"
        name="title"
        className="form-control mb-3"
        placeholder="Digite o titulo do post"
        value={title}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="description"
        className="form-control mb-3"
        placeholder="Digite a descrição do post"
        maxLength={60}
        value={description}
        onChange={handleInputChange}
      />
      <select
        name="type"
        onChange={handleInputChange}
        value={type}
        className="form-control mb-3"
      >
        <option value="">Selecione o tipo do post</option>
        <option value="movie">Filme</option>
        <option value="tvshow">Série</option>
      </select>
      <input
        type="text"
        name="imageURL"
        className="form-control mb-3"
        placeholder="URL da imagem"
        value={imageURL}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="videoURL"
        className="form-control mb-3"
        placeholder="URL do vídeo"
        value={videoURL}
        onChange={handleInputChange}
      />
      <Editor
        editorState={textEnglish}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={setTextEnglish}
      />
      <div className="mb-3" />
      <Editor
        editorState={textPortuguese}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={setTextPortuguese}
      />
      <div className="mb-3" />
      <Editor
        editorState={summary}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={setSummary}
      />
      <div className="mb-3" />
      <select
        name="category"
        className="form-control mb-3"
        onChange={handleInputChange}
        value={category}
      >
        <option value="">Selecione a Categoria</option>
        {categories.map((data: CategoryData) => (
          <option value={data._id} key={data._id}>
            {data.title}
          </option>
        ))}
      </select>
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
    </form>
  );
};

export default FormPost;
