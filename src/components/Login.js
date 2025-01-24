import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { authService, cartService } from '../services/api.js';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// import './Auth.css';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const returnTo = location.state?.returnTo || '/';
    
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login(formData);
            // Handle post-login cart action if exists
            if (location.state?.product) {
                await cartService.addToCart(
                    location.state.product.id,
                    location.state.quantity
                );
            }
            navigate(returnTo);
        } catch (error) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="auth-container">
  <Card className="auth-card">
    <Card.Body>
      <h2 className="text-center mb-4">Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <div className="password-input-group">
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
            <Button
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </Button>
          </div>
        </Form.Group>

        <Button
          className="w-100 mb-3"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </Button>
      </Form>

      <div className="text-center">
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </Card.Body>
  </Card>
</Container>

    );
};

export default Login;
