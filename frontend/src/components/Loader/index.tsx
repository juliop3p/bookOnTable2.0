import React from 'react';
import { Spinner } from 'react-bootstrap';
import { FaSpinner } from 'react-icons/fa';

interface Props {
  loadedItems: boolean;
  lastPage: () => boolean;
  onPagination: () => void;
}

const Loader: React.FC<Props> = ({
  loadedItems,
  lastPage,
  onPagination,
}: Props) => {
  return (
    <div className="row justify-content-center mb-5">
      {!lastPage() ? (
        <div className="loader pointer" onClick={onPagination}>
          {!loadedItems ? (
            <Spinner animation="border" variant="light" />
          ) : (
            <FaSpinner size={20} color="#fff" />
          )}
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default Loader;
