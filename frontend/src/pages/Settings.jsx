import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Divider, Switch, FormControlLabel, Alert, CircularProgress } from '@mui/material';
import { Person, Notifications, Storage, Save } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { userAPI } from '../services/api';

const Settings = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settings, setSettings] = useState({
        notificationsEnabled: true,
        notificationEmail: '',
        username: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setFetching(true);
        try {
            const response = await userAPI.getSettings();
            setSettings(response.data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            setMessage({ type: 'error', text: 'Failed to load settings.' });
        } finally {
            setFetching(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await userAPI.updateSettings({
                notificationsEnabled: settings.notificationsEnabled,
                notificationEmail: settings.notificationEmail
            });
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update settings.' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    if (fetching) {
        return (
            <Box sx={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress sx={{ color: '#C0392B' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <Box
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}
            >
                <TopBar onToggleSidebar={handleToggleSidebar} />

                <Box sx={{ flexGrow: 1, p: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 1, fontSize: '26px' }}>
                        Settings
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#888', fontSize: '14px', mb: 4 }}>
                        Manage your account and preferences
                    </Typography>

                    {message.text && (
                        <Alert severity={message.type} sx={{ mb: 3, borderRadius: '12px' }}>
                            {message.text}
                        </Alert>
                    )}

                    <Card sx={{ mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Person sx={{ color: '#E8420A' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Profile Information
                                </Typography>
                            </Box>
                            <TextField
                                fullWidth
                                label="Username"
                                value={settings.username}
                                disabled
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Primary Email"
                                value={settings.email}
                                disabled
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                Profile details are managed by your account provider.
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Notifications sx={{ color: '#E8420A' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Email Notifications
                                </Typography>
                            </Box>
                            <Typography color="text.secondary" sx={{ mb: 3 }}>
                                Get notified when warranties are about to expire (30, 7, and 1 day remaining).
                            </Typography>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.notificationsEnabled}
                                        onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#C0392B',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#C0392B',
                                            },
                                        }}
                                    />
                                }
                                label="Enable Expiry Alerts"
                                sx={{ mb: 2, display: 'block' }}
                            />

                            <TextField
                                fullWidth
                                label="Alert Recipient Email"
                                value={settings.notificationEmail}
                                onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                                placeholder="Enter email for alerts"
                                helperText="We will send warranty alerts to this address."
                                sx={{ mb: 3 }}
                            />

                            <Button
                                variant="contained"
                                onClick={handleSave}
                                disabled={loading}
                                startIcon={<Save />}
                                sx={{
                                    backgroundColor: '#C0392B',
                                    borderRadius: '50px',
                                    fontWeight: 700,
                                    px: 4,
                                    '&:hover': {
                                        backgroundColor: '#A93226',
                                    },
                                }}
                            >
                                {loading ? 'Saving...' : 'Save Preferences'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Storage sx={{ color: '#E8420A' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Cloud Storage
                                </Typography>
                            </Box>
                            <Typography color="text.secondary">
                                Unlimited bill hosting is enabled on your account.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default Settings;
