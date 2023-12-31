import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// eto realno ktoto budet proveryat ili vy prosto tak etu huinyu skidivaete?
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { Button } from 'react-bootstrap';


import DeleteTodoItem from '../components/DeleteTodoItem';
import UpdateCheckbox from '../components/UpdateCheckBox';
import DownloadFIle from '../components/DownloadFile';
import DeleteFile from '../components/DeleteFile';
import EditTodo from './EditTodo';
const DetailsPage = () => {
  const [todoData, setTodoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Dofetch, SetDoFetch]=useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [showEditModal, setShowEditModal] = useState(false);
  console.log(params.pageid)
  const apiUrl = `http://127.0.0.1:8000/api/todo/${params.pageid}`;
  const accessToken = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl, { headers });
        const data = await response.json();

        if (response.ok) {
          setTodoData(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [Dofetch]);

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleDelete = async () => {
    await DeleteTodoItem(params.pageid);
    navigate('/');
    
  };
  const handleCheckboxChange = async () => {
    const updatedTodoData = todoData;
    updatedTodoData.completed=!updatedTodoData.completed;
    setTodoData(updatedTodoData);
    await UpdateCheckbox(params.pageid,updatedTodoData.completed)
    SetDoFetch(!Dofetch);
    
  };
  const HandleDownload= async(fileId, filename)=>{
    DownloadFIle(fileId,filename);
  } 
  const HandleFileDelete= async(fileId)=>{
    DeleteFile(fileId);
  };
  const handleEditButtonClick = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };
  return (
    <Card className="container mt-5">
      {todoData && (
        <Container>
            {showEditModal && (
        <EditTodo
          initialData={{
            id:todoData.id,
            title: todoData.title,
            description: todoData.description,
            tags: todoData.tags.join(', '), 
          }}
          onClose={handleCloseEditModal}
        > </EditTodo>
      )}
    
            <Row>
            <h1 className="mb-4 text-center mx-auto">{todoData.title}</h1>
            </Row>
           <Row>
           <p className="mb-2">{todoData.description}</p>
           </Row>
          <Row>
          
          </Row>
          
          <Row>
            <Col>
          <Stack direction="horizontal" gap={2}>
          <p className="mb-2">Completed: </p>
          <input
                    type="checkbox"
                    checked={todoData.completed}
                    onChange={() => handleCheckboxChange()}
                    style={{ width: '30px', height: '30px', margin:'0', padding:'0' }}
                  />
             <Button variant="warning" onClick={handleEditButtonClick}>Edit</Button>
            <Button variant="danger" onClick={() => handleDelete(todoData.id)} >Delete</Button>
            
            
          </Stack>
          </Col>
          <Col >
          <Stack direction="horizontal" gap={2} className="justify-content-end" style={{textAlign:'right'}}>
          <p className="mb-2">Tags:</p>
                  {todoData.tags.map((tag, index) => (
                      <Badge key={index} bg="primary">
                      {tag}
                    </Badge>
                  ))}
                  
        </Stack>
          </Col>
          </Row>
          <Row>
            <ul className="list-group list-group-flush mt-4">
                {todoData.files.map((file) => (
                
                <li key={file.id} className="list-group-item">
                    <Stack direction="horizontal" gap={2}>
                    <a href={file.file} target="_blank" rel="noopener noreferrer">
                    {file.file.substring(file.file.lastIndexOf('/') + 1)}
                    </a>
                    <Button onClick={() => HandleDownload(file.id, file.file.substring(file.file.lastIndexOf('/') + 1))}>Download</Button>
                    <Button variant='danger' onClick={() => HandleFileDelete(file.id)}>Delete</Button>
                    </Stack>
                </li>
                
                ))}
            </ul>
          </Row>
          <Row className="justify-content-between">
        
            <Col ><Card.Text>Created At: 
                  
                  {new Date(todoData.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
            </Card.Text></Col>
            <Col ><Card.Text className="justify-content-end" style={{textAlign:'right'}}>Updated At: 
                  
                  {new Date(todoData.updated_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
            </Card.Text> </Col>
     
          </Row>
        </Container>
      )}
    </Card>
  );
};

export default DetailsPage;