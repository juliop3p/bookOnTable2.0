import React from 'react';
import { useHistory } from 'react-router-dom';

import { useData } from '../../context/DataContext';

import Loader from '../../components/Loader';

const Home: React.FC = () => {
  const history = useHistory();
  const {
    posts,
    loadedPosts,
    handlePaginationPosts,
    isLastPostPage,
  } = useData();

  return (
    <>
      <div className="container">
        <div className="row p-3 justify-content-center">
          {posts.map((post) => (
            <div
              className="card mx-2 my-4 justify-content-between card-hover card-height"
              key={post._id}
              style={{ width: '18rem' }}
              onClick={() => {
                history.push('/content', post._id);
              }}
            >
              <div
                className="img"
                style={{ backgroundImage: `url(${post.imageURL})` }}
              />
              <div className="body">
                <div className="d-flex flex-column align-items-center">
                  <small className="text-center">{post.category.title}</small>
                  <div className="little-hr" />
                </div>
                <h5>{post.title}</h5>
                {/* <hr /> */}
                <p className="lead">{post.description}</p>
              </div>
            </div>
          ))}
        </div>
        <Loader
          loadedItems={loadedPosts}
          lastPage={isLastPostPage}
          onPagination={handlePaginationPosts}
        />
      </div>
    </>
  );
};

export default Home;
