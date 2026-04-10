import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { authAPI } from '../services/api';
import googleIcon from '../assets/google.png';
import logo1 from '../assets/logo1.png';
import './Login.css';

const chartData = [
    { name: 'Electronics', count: 75, fill: '#E8420A' },
    { name: 'Appliances', count: 55, fill: '#22c55e' },
    { name: 'Vehicles', count: 40, fill: '#facc15' },
];

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [oauthProviders, setOauthProviders] = useState([]);
    const [providersLoading, setProvidersLoading] = useState(true);
    const [providersError, setProvidersError] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const oauthError = params.get('error');
        if (oauthError) {
            setError(oauthError);
        }
    }, [location.search]);

    useEffect(() => {
        const loadOAuthProviders = async () => {
            setProvidersLoading(true);
            try {
                const response = await authAPI.getOAuthProviders();
                setOauthProviders(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setOauthProviders([]);
                setProvidersError(true);
            } finally {
                setProvidersLoading(false);
            }
        };

        loadOAuthProviders();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(formData);
            localStorage.setItem('user', JSON.stringify(response.data));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthLogin = (providerId) => {
        window.location.href = authAPI.getOAuthAuthorizationUrl(providerId);
    };

    const getProviderLabel = (providerId, providerName) => {
        if (providerId === 'google') {
            return 'Continue with Google';
        }

        if (providerId === 'github') {
            return 'Continue with GitHub';
        }

        return `Continue with ${providerName}`;
    };

    const getProviderIcon = (providerId) => {
        if (providerId === 'google') {
            return {type:'image',value:googleIcon};
        }

        if (providerId === 'github') {
            return {type:'icon',value:'code'}
        }

        return {type:'icon',value:'login'};
    };

    return (
        <div className="login-page">
            {/* ===== Left Panel - Hero with floating cards ===== */}
            <div className="login-left-panel">
                <div className="login-left-blur-1"></div>
                <div className="login-left-blur-2"></div>

                {/* Brand */}
                <div className="login-brand" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div className="login-brand-icon">
                        <img 
                            src={logo1} 
                            alt="Logo" 
                            style={{ 
                                width: 68, 
                                height: 68, 
                                objectFit: 'contain', 
                                
                            }} 
                        />
                    </div>
                    <span className="login-brand-name" style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.2px' }}>
                        Warranty Wallet
                    </span>
                </div>

                {/* Floating Cards */}
                <div className="login-cards-area">
                    <div className="login-cards-container">

                        {/* Main Chart Card */}
                        <div className="login-float-card login-card-chart">
                            <div className="login-card-chart-header">
                                <span>Warranty Overview</span>
                                <span className="material-symbols-outlined" style={{ color: '#9ca3af', fontSize: 18 }}>more_horiz</span>
                            </div>
                            <div className="login-chart-bars" style={{ width: '100%', height: 140 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 600 }} 
                                            dy={8}
                                        />

                                        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={40}>
                                            {
                                                chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Active Warranties Card */}
                        <div className="login-float-card login-card-active" style={{ transform: 'rotate(-6deg)' }}>
                            <div className="login-card-active-header">
                                <div className="login-card-icon login-card-icon-orange">
                                    <span className="material-symbols-outlined">shield</span>
                                </div>
                                <span className="login-card-badge">
                                    <span className="material-symbols-outlined">arrow_upward</span>
                                    3 added
                                </span>
                            </div>
                            <div className="login-card-number">24</div>
                            <div className="login-card-label">Active Warranties</div>
                        </div>

                        {/* Samsung TV Notification Card */}
                        <div className="login-float-card login-card-notification" style={{ transform: 'rotate(3deg)' }}>
                            <div className="login-card-notification-header">
                                <div className="login-card-notification-icon">
                                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications_active</span>
                                </div>
                                <div className="login-card-notification-info">
                                    <p className="login-card-notification-title">Samsung TV</p>
                                    <div className="login-card-notification-badge">12 days left</div>
                                </div>
                            </div>
                            <p className="login-card-notification-date">Expires Mar 15, 2025</p>
                        </div>

                        {/* Bosch Refrigerator Card */}
                        <div className="login-float-card login-card-product" style={{ transform: 'rotate(-3deg)' }}>
                            <div className="login-card-product-header">
                                <div className="login-card-icon login-card-icon-green">
                                    <span className="material-symbols-outlined">qr_code_scanner</span>
                                </div>
                                <div className="login-card-product-info">
                                    <p>Bosch Refrigerator</p>
                                    <p>Purchase: Jan 2024</p>
                                </div>
                            </div>
                            <div className="login-card-product-footer">
                                <span className="login-card-product-price">$12,402</span>
                                <div className="login-card-product-avatars">
                                    <div style={{ background: '#e5e7eb' }}></div>
                                    <div style={{ background: '#d1d5db' }}></div>
                                    <div style={{ background: '#9ca3af' }}></div>
                                    <div style={{
                                        background: '#E8420A',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 8,
                                        fontWeight: 700,
                                    }}>+4</div>
                                </div>
                            </div>
                        </div>

                        {/* Alerts Card */}
                        <div className="login-float-card login-card-alerts" style={{ transform: 'rotate(6deg)' }}>
                            <div className="login-card-alerts-icon">
                                <span className="material-symbols-outlined">notifications</span>
                            </div>
                            <div className="login-card-number" style={{ fontSize: 30 }}>6</div>
                            <div className="login-card-label">Alerts This Month</div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ===== Right Panel - Login Form ===== */}
            <div className="login-right-panel">
                {/* Mobile Brand */}
                <div className="login-form-container">
                    <div className="login-form-header">
                        <h1 className="login-form-title">Sign in to Warranty Wallet</h1>
                        <p className="login-form-subtitle">Manage and track all your warranties in one place.</p>
                    </div>

                    {error && (
                        <div className="login-error-alert">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="login-field-group">
                            <label className="login-field-label" htmlFor="login-username">Username</label>
                            <div className="login-field-input-wrapper">
                                <input
                                    id="login-username"
                                    className="login-field-input"
                                    type="text"
                                    name="username"
                                    placeholder="Enter your username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    autoFocus
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="login-field-group">
                            <label className="login-field-label" htmlFor="login-password">Password</label>
                            <div className="login-field-input-wrapper">
                                <input
                                    id="login-password"
                                    className="login-field-input login-field-input-password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    <span className="material-symbols-outlined">
                                        {showPassword ? 'visibility' : 'visibility_off'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="login-options-row">
                            <label className="login-remember-label">
                                <input type="checkbox" className="login-remember-checkbox" />
                                <span className="login-remember-text">Remember me</span>
                            </label>
                            <a href="#" className="login-forgot-link">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            className="login-submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <div className="login-oauth-section">
                        <div className="login-divider">
                            <span>or sign in with</span>
                        </div>

                        <div className="login-oauth-buttons">
                            {providersLoading ? (
                                <div className="login-oauth-btn-skeleton"></div>
                            ) : providersError ? (
                                <button
                                    type="button"
                                    className="login-oauth-btn"
                                    onClick={() => handleOAuthLogin('google')}
                                >
                                    <img 
                                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                                        alt="" 
                                        className="login-provider-icon" 
                                    />
                                    Continue with Google
                                </button>
                            ) : (
                                oauthProviders.map((provider) => {
                                    const iconData = getProviderIcon(provider.id);
                                    return (
                                        <button
                                            key={provider.id}
                                            type="button"
                                            className="login-oauth-btn"
                                            onClick={() => handleOAuthLogin(provider.id)}
                                        >
                                            {iconData.type === 'image' ? (
                                                <img 
                                                    src={iconData.value} 
                                                    alt="" 
                                                    className="login-provider-icon"
                                                />
                                            ) : (
                                                <span className="material-symbols-outlined">
                                                    {iconData.value}
                                                </span>
                                            )}
                                            {getProviderLabel(provider.id, provider.name)}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="login-signup-link">
                        <p>
                            Don't have an account?
                            <Link to="/signup">Sign Up now</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
