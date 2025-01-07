import React, { useEffect, useState } from 'react';
import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import { useNavigate } from 'react-router-dom';
import { InlineStyleControls } from '../../components/inline-style-controls/InlineStyleControls';
import styles from './styles.module.css'

export function SendEmail() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({ sender: null, recipient: '', subject: '' });
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const navigate = useNavigate();


    useEffect(() => {
        // Fetch user info from localStorage or API
        // Redirect to login if user is not authenticated
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (savedUser) setUser(savedUser);
        setFormData((prev) => ({ ...prev, sender: savedUser.id }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = editorState.getCurrentContent().getPlainText();

        const emailPayload = {
            ...formData,
            message,
        };
        const basicAuth = btoa(`${user.login}:${user.password}`);
        fetch(`${process.env.REACT_APP_API_BASE_URL}/emails/`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailPayload),
        }).then((response) => {
            if (response.ok) {
                alert('Email sent successfully!');
                navigate('/');
            }
        });
    };


    const handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return "handled";
        }
        return "not-handled";
    };

    const toggleInlineStyle = (style) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    };
    return (
        <div>
            <button
                type="button"
                className={styles.backButton}
                onClick={() => navigate("/")}
            >
                Back to Home
            </button>
            <div className={styles.container}>

                <h1>Send Email</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Sender:
                            <span className={styles.senderEmail}>{user?.email}</span>
                        </label>
                    </div>
                    <div>
                        <label>
                            Recipient:
                            <input
                                type="email"
                                name="recipient"
                                value={formData.recipient}
                                onChange={handleChange}
                                required
                                autoComplete='off'
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Subject:
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                autoComplete='off'
                            />
                        </label>
                    </div>
                    <div>
                        <label>Text:</label>
                        <InlineStyleControls
                            editorState={editorState}
                            onToggle={toggleInlineStyle}
                        />
                        <div className={styles.editorContainer}>
                            <Editor
                                editorState={editorState}
                                onChange={setEditorState}
                                handleKeyCommand={handleKeyCommand}
                                placeholder="Write your email text here..."
                            />
                        </div>
                    </div>
                    <button type="submit">Send</button>
                </form>

            </div>
        </div>
    );
}
