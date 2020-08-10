import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

import { useData } from '../../context/DataContext';

import HeaderDashboard from '../../components/HeaderDashboard';
import Modal from '../../components/ModalDelete';
import Loader from '../../components/Loader';
import noImg from '../../assets/no-image.png';

import './styles.css';

const Dashboard: React.FC = () => {
  const history = useHistory();

  const {
    posts,
    categories,
    loadedPosts,
    loadedCategories,
    handlePaginationPosts,
    handlePaginationCategories,
    isLastPostPage,
    isLastCategoriesPage,
    deletePostById,
    deleteCategoryById,
  } = useData();

  const [idToDelete, setIdToDelete] = useState<string>('');
  const [routeToDelete, setRouteToDelete] = useState<string>('');

  const [show, setShow] = useState<boolean>(false);

  const handleClose = (success: boolean | false) => {
    if (success) {
      if (routeToDelete === 'categories') {
        deleteCategoryById(idToDelete);
      } else {
        deletePostById(idToDelete);
      }
    }

    setShow(false);
  };

  const handleShow = (id: string, type: string) => {
    setRouteToDelete(type);
    setIdToDelete(id);
    setShow(true);
  };

  const navigateToFormPost = (id: string) => history.push('/formpost', id);

  const navigateToFormCategory = (id: string) =>
    history.push('/formcategory', id);

  return (
    <>
      <HeaderDashboard />
      <Modal
        onClose={handleClose}
        id={idToDelete}
        route={routeToDelete}
        show={show}
      />
      <div className="row">
        <Link
          to="/formcategory"
          type="button"
          className="btn btn-primary mx-5 text-uppercase"
        >
          Criar Categoria
        </Link>
        <Link
          to="/formpost"
          type="button"
          className="btn btn-primary text-uppercase"
        >
          Criar um novo Post
        </Link>
      </div>
      <div className="col">
        <hr />
      </div>
      <div className="row pl-4">
        <div className="col">
          <h3>Posts</h3>
        </div>
      </div>
      <div className="row p-3 justify-content-center">
        {posts.map((post) => (
          <div className="card m-3" style={{ width: '20rem' }} key={post._id}>
            <div
              className="pointer"
              onClick={() => {
                history.push('/content', post._id);
              }}
            >
              <img
                className="card-img-top"
                src={post.imageURL !== '' ? post.imageURL : noImg}
                alt="The Boys"
              />
            </div>
            <div className="card-body">
              <p>
                <strong>{post.category.title}</strong>
                <span> - </span>
                <span>{post.title}</span>
              </p>
              <p className="lead">{post.description}</p>
            </div>
            <div className="card-footer bg-dark d-flex justify-content-between">
              <div>
                <FaEdit
                  size={20}
                  color="#ebd834"
                  className="pointer"
                  onClick={() => navigateToFormPost(post._id)}
                />
              </div>
              <FaTrash
                className="pointer"
                size={20}
                color="#f64c75"
                onClick={() => handleShow(post._id, 'posts')}
              />
            </div>
          </div>
        ))}
      </div>
      <Loader
        loadedItems={loadedPosts}
        lastPage={isLastPostPage}
        onPagination={handlePaginationPosts}
      />
      <hr />
      <div className="row pl-4 mt-5">
        <div className="col">
          <h3>Categorias</h3>
        </div>
      </div>
      <div className="row p-3 justify-content-center">
        {categories.map((category) => (
          <div
            className="card m-3"
            style={{ width: '14rem' }}
            key={category._id}
          >
            <div>
              <img
                className="card-img-top"
                src={category.imageURL !== '' ? category.imageURL : noImg}
                alt="The Boys"
              />
            </div>
            <div className="card-body">
              <strong>{category.title}</strong>
            </div>
            <div className="card-footer bg-dark d-flex justify-content-between">
              <FaEdit
                size={20}
                color="#ebd834"
                className="pointer"
                onClick={() => navigateToFormCategory(category._id)}
              />
              <FaTrash
                className="pointer"
                size={20}
                color="#f64c75"
                onClick={() => handleShow(category._id, 'categories')}
              />
            </div>
          </div>
        ))}
      </div>
      <Loader
        loadedItems={loadedCategories}
        lastPage={isLastCategoriesPage}
        onPagination={handlePaginationCategories}
      />
    </>
  );
};

export default Dashboard;
