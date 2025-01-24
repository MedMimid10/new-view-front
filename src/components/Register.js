import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api.js';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// import './Auth.css';
import './Login.js';

const Register = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
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

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        try {
            await authService.register(formData);
            // Auto login after registration
            await authService.login({
                username: formData.username,
                password: formData.password
            });
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="auth-container">
            <Card className="auth-card">
                <Card.Body>
                    <h2 className="text-center mb-4">Register</h2>
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
                                placeholder="Choose a username"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
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
                                    placeholder="Choose a password"
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

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm your password"
                            />
                        </Form.Group>

                        <Button
                            className="w-100 mb-3"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Register'}
                        </Button>
                    </Form>

                    <div className="text-center">
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;