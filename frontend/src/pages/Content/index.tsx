import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Parser from 'html-react-parser';
import { DiscussionEmbed } from 'disqus-react';

import { useData } from '../../context/DataContext';

interface PostData {
  _id: string;
  title: string;
  description: string;
  type: string;
  imageURL: string;
  videoURL: string;
  textEnglish: string;
  textPortuguese: string;
  summary: string;
}

const Content: React.FC = () => {
  const history = useHistory();
  const { getPostById } = useData();
  const [post, setPost] = useState<PostData>({} as PostData);
  const id = history.location.state;

  useEffect(() => {
    getPostById(String(id)).then((post) => setPost(post));
  }, [id, getPostById]);

  return post ? (
    <>
      <div className="row justify-content-center">
        <div className="embed-responsive embed-responsive-16by9 col">
          <iframe
            title="video"
            className="embed-responsive-item"
            src={post.videoURL}
            allowFullScreen
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <hr />
          <h3>{post.title}</h3>
          <h4 className="lead">{post.description}</h4>
          <hr />
        </div>
      </div>
      <div className="row bg-white rounded p-2">
        <div className="col" style={{ borderRight: '1px solid #3335' }}>
          <div className="text-center mb-3">
            <strong>Inglês</strong>
          </div>
          {Parser(post.textEnglish || '')}
        </div>
        <div className="col">
          <div className="text-center mb-3">
            <strong className="text-center mb-3">Português</strong>
          </div>
          {Parser(post.textPortuguese || '')}
        </div>
        <div className="col-12">
          <hr />
          <div className="text-center mb-3">
            <strong>Sumário</strong>
          </div>
          {Parser(post.summary || '')}
        </div>
      </div>
      <div className="row my-5">
        <div className="col">
          <DiscussionEmbed
            shortname="BookOnTable"
            config={{
              url: `${window.location.href}/${String(id)}`,
              identifier: post._id,
              title: post.title,
            }}
          />
        </div>
      </div>
    </>
  ) : (
    <div>loading</div>
  );
};

export default Content;
