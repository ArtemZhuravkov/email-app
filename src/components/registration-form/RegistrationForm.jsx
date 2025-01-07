import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css'

export default function RegistrationForm() {
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then((response) => {
              if (response.ok) {
                alert('Registration successful!');
                // Clear the form
                setFormData({
                  login: "",
                  password: "",
                  email: "",
                });
        
                // Navigate to login page
                navigate("/login");
            } 
        }).catch((error) => console.error('Error:', error));
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label htmlFor="username">Login:</label>
                <input type="text" id="username" name="username" onChange={handleChange} required autoComplete='off' />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" onChange={handleChange} required />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" onChange={handleChange} required autoComplete='off' />
            </div>
            <button className={styles.submitButton} type="submit">Register</button>
        </form>
    );
}
