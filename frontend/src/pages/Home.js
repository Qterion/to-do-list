import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import DeleteTodoItem from '../components/DeleteTodoItem';
import UpdateCheckbox from '../components/UpdateCheckBox';

const Home = () => {
  const [todoData, setTodoData] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParam = new URLSearchParams(location.search).get('search') || '';
  const tagParam = new URLSearchParams(location.search).get('tag') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNums, setPageNums] = useState(1);
  const [randomChange, setRandomChange]=useState(false);
  const handleDelete = async (item) => {
    await DeleteTodoItem(item);
    setRandomChange(!randomChange);
  };
  const handleCreate = () => {
    navigate('/create');
  };
  const handleOpen = (taskid) => {
    navigate(`/details/${taskid}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`http://127.0.0.1:8000/api/todo/?search=${searchParam}&tag=${tagParam}&page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();

        if (data.message === 'Blog fetched successfully') {
          setTodoData(data.data);
          setTags(data.tags);
          setSelectedTag(tagParam);
          setPageNums(data.num_pages);
        } else {
          console.error('Error fetching data');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [searchParam, currentPage,tagParam,randomChange, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.search.value;
    const queryParams = new URLSearchParams();
    if (searchTerm) {
      queryParams.append('search', searchTerm);
    }
    if (selectedTag) {
      queryParams.append('tag', selectedTag);
    }
    navigate(`?${queryParams.toString()}`);
  };

  const handleTagClick = (tag) => {
    // Set the selected tag and fetch data with the tag filter
    setSelectedTag(tag);
    const queryParams = new URLSearchParams();
    queryParams.append('search', searchParam);
    queryParams.append('tag', tag);
    setCurrentPage(1)
    navigate(`?${queryParams.toString()}`);
  };

  const handleResetTagFilter = () => {
    // Reset the selected tag and fetch data without the tag filter
    setSelectedTag(null);
    setCurrentPage(1)
    const queryParams = new URLSearchParams();
    if (searchParam) {
      queryParams.append('search', searchParam);
    }
    navigate(`?${queryParams.toString()}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('page', newPage);
    navigate(`?${queryParams.toString()}`);
  };
  
  
  const handleCheckboxChange = async (taskId) => {
    // Find the task by ID
    const updatedTodoData = todoData.map((todo) =>
      todo.id === taskId ? { ...todo, completed: !todo.completed } : todo
    );
    setTodoData(updatedTodoData);
    const todoToUpdate = todoData.find(todo => todo.id === taskId);
    UpdateCheckbox(taskId,!todoToUpdate.completed)
  };

  
    
  return (
    <div className="container mt-5">
      <Stack direction="horizontal" gap={5} style={{marginBottom:'10px'}}>
      <Button onClick={handleCreate}>Create New Task</Button>
      </Stack>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search todos..."
            name="search"
            defaultValue={searchParam}
          />
          <button type="submit" className="btn btn-outline-secondary">
            Search
          </button>
        </div>
      </form>

      <div className="btn-group mb-3">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`btn btn-outline-primary ${selectedTag === tag ? 'active' : ''}`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </button>
        ))}
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleResetTagFilter}
        >
          Reset
        </button>
      </div>

      <div className="row">
        {todoData.map((todo) => (
          <div key={todo.id} className="col-md-6">
            <Card style={{ width: '30rem' ,margin: '10px', marginLeft:'0'}}>
              <Card.Body>
              <Card.Text>
                  <Stack direction="horizontal" gap={2}>
                  {todo.tags.map((tag, index) => (
                      <Badge key={index} bg="primary">
                      {tag}
                    </Badge>
                  ))}
                  </Stack>
                </Card.Text>
                <Card.Title>{todo.title}</Card.Title>

                <Card.Text>
                  {todo.description.length > 100
                    ? `${todo.description.substring(0, 100)}......`
                    : todo.description}
                </Card.Text>
                <Card.Text>
                  
                  {new Date(todo.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </Card.Text>
                <Stack direction="horizontal" gap={2}>
                <Button variant="secondary" onClick={() => handleOpen(todo.id)}>Open task</Button>
                <Button variant="danger" onClick={() => handleDelete(todo.id)} >Delete</Button>
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleCheckboxChange(todo.id)}
                    style={{ width: '30px', height: '30px', margin:'0', padding:'0' }}
                  />

                  </Stack>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content mt-3">
    {[...Array(pageNums).keys()].map((page) => (
      <Button style={{ margin:'10px', marginLeft:"0"}}
        key={page + 1}
        variant={currentPage === page + 1 ? 'primary' : 'secondary'}
        onClick={() => handlePageChange(page + 1)}
      >
        {page + 1}
      </Button>
    ))}
  </div>
    </div>
  );
};

export default Home;

