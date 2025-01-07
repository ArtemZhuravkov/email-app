import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Pagination } from '../../components/pagination/Pagination';
import styles from './styles.module.css'

const ITEMS_PER_PAGE = 8;

export function Home() {
    const [user, setUser] = useState(null);
    const [emails, setEmails] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmails = async (url, basicAuth) => {
            setLoading(true);
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        'Authorization': `Basic ${basicAuth}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch emails");
                }

                const data = await response.json();
                setEmails((prevEmails) => [...prevEmails, ...data.results]);

                // If there's a next page URL, fetch the next batch of emails
                if (data.next) {
                    fetchEmails(data.next, basicAuth);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error(error.message);
            } finally {
                //
            }
        };

        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (savedUser) setUser(savedUser);
        else navigate('/login');

        const basicAuth = btoa(`${savedUser.login}:${savedUser.password}`);
        fetchEmails(`${process.env.REACT_APP_API_BASE_URL}/emails/`, basicAuth)
    }, [navigate]);


    const totalEmails = emails.length;
    const totalPages = Math.ceil(totalEmails / ITEMS_PER_PAGE);

    // Get the emails for the current page
    const currentEmails = emails.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div>
            <header className={styles.header}>
                <div>
                    <p>Logged in as: {user?.username} ({user?.email})</p>
                </div>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    Logout
                </button>
            </header>
            <main className={styles.main}>
                <button className={styles.sendEmailButton} onClick={() => navigate('/send-email')}>
                    Send an Email
                </button>
                {loading ? <p>Loading...</p> : (
                    <div>
                        <table className={styles.emailTable}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Recipient</th>
                                    <th>Subject</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEmails.map((email) => (
                                    <tr key={email.id}>
                                        <td>{email.id}</td>
                                        <td>{email.recipient}</td>
                                        <td>{email.subject}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </main>
        </div>
    )
}
