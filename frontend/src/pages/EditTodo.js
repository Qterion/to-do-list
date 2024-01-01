import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditTodo = ({initialData, onClose}) => {
  const [formData, setFormData] = useState({
    title:initialData.title,
    description:initialData.description,
    tags:initialData.tags,
    uploaded_files: [],
  });
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, uploaded_files: files });
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const url = `http://127.0.0.1:8000/api/todo/edit/${initialData.id}/`;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('tags', formData.tags);

    formData.uploaded_files.forEach((file, index) => {
      data.append(`uploaded_files`, file);
    });

    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await axios.patch(url, data, {
        
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      window.location.reload();
      console.log(response.data);

      // Handle success, e.g., redirect to another page
    } catch (error) {
      console.error('Error creating todo:', error);
      navigate('/');
      // Handle error, e.g., display an error message
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Todo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className="justify-content-md-center">
            <Col xs={12} md={8}>
            <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formTags">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter tags (comma-separated)"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formFile">
              <Form.Label>Upload Files</Form.Label>
              <Form.Control
                type="file"
                name="uploaded_files"
                onChange={handleFileChange}
                multiple
              />
            </Form.Group>
          </Form>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={handleFormSubmit}>
          Update Todo
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditTodo;