import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css'

export default function AuthorizationForm() {
    const [formData, setFormData] = useState({ login: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const basicAuth = btoa(`${formData.login}:${formData.password}`);
        fetch(`${process.env.REACT_APP_API_AUTHORIZATION_URL}/`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.ok) alert('Login successful!');
        }).then(() => {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/users/current/`, {
                method: "GET",
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                    'Content-Type': 'application/json',
                },
            }).then((res) => res.json()).then((data) => {
                if (data.detail) {
                    alert(data.detail);
                    navigate('/login');
                } else {
                    localStorage.setItem('user', JSON.stringify({ ...formData, ...data }));
                    navigate('/');
                }
            }).catch((err) => setError(err.message));
        })
            .catch((err) => setError(err.message));
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <div className={styles.inputGroup}>
                <label htmlFor="login">Login:</label>
                <input type="text" id="login" name="login" onChange={handleChange} required autoComplete='off' />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" onChange={handleChange} required />
            </div>
            <button className={styles.submitButton} type="submit">Login</button>
            <p className={styles.linkText}>
                Don't have an account? <Link to="/register">Register here</Link>.
            </p>
        </form>
    );
}
