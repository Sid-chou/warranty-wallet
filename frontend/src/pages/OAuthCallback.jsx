import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Login.css';

const OAuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userId = params.get('userId');
        const username = params.get('username');
        const email = params.get('email');
        const error = params.get('error');

        if (token && userId && username && email) {
            localStorage.setItem('user', JSON.stringify({
                token,
                id: userId,
                username,
                email,
            }));
            navigate('/dashboard', { replace: true });
            return;
        }

        const errorMessage = error || 'OAuth login failed. Please try again.';
        navigate(`/login?error=${encodeURIComponent(errorMessage)}`, { replace: true });
    }, [location.search, navigate]);

    return (
        <div className="login-page">
            <div className="login-right-panel">
                <div className="login-form-container">
                    <div className="login-form-header">
                        <h1 className="login-form-title">Completing sign-in</h1>
                        <p className="login-form-subtitle">We are finishing your OAuth session.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OAuthCallback;
