import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import { Container, Alert, Form, Button } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate ();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/account/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        const { refresh, access } = data.data.token;

        // Store tokens in local storage
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('accessToken', access);

        console.log('Login successful!');
        navigate('/');
      } else {
        // Handle login failure
        console.error('Login failed:', data.message);
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      setErrorMessage('An error occurred during login.');
    }
  };
  const GoToRegister = () =>{
    navigate('/register')

  }

  return (
    <Container style={{marginTop:"10px"}}>
      <Row className="justify-content-md-center"  md={2}>

      
      {errorMessage && (
        <Alert variant="danger">
          {errorMessage}
        </Alert>
      )}
      <Form onSubmit={handleLogin}>
        <h2>Login Page</h2>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Stack direction="horizontal" gap={2} >
        <Button type="submit" variant="primary">
          Login
        </Button>
        <Button variant="secondary" onClick={GoToRegister}>
          Go to Register
        </Button>
        </Stack>
      </Form>
      </Row>
    </Container>
  );
};

export default LoginForm;