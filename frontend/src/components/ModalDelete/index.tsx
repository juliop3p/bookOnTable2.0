import React from 'react';

import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import api from '../../services/api';

interface ModalProps {
  show: boolean;
  id: string;
  route: string;
  onClose: (success: boolean | false) => void;
}

const ModalDelete: React.FC<ModalProps> = ({
  show,
  onClose,
  id,
  route,
}: ModalProps) => {
  const handleDelete = async (): Promise<void> => {
    try {
      await api.delete(`/${route}/${id}`);
      toast.success(
        `${route === 'posts' ? 'Post' : 'Categoria'} deletada com sucesso!`,
      );
      onClose(true);
    } catch (err) {
      toast.error('Houve um erro!');
      onClose(false);
    }
  };

  return (
    <Modal animation={false} show={show} onHide={() => onClose(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Tem certeza que deseja deletar esse item?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Se você deletar não será possível recuperar esse conteúdo.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onClose(false)}>
          Fechar
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Deletar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDelete;
