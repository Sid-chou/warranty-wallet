import React from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Divider } from '@mui/material';
import { Person, Notifications, Storage, Security } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const Settings = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <TopBar />

                <Box sx={{ flexGrow: 1, p: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 1 }}>
                        Settings
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--text-secondary)', mb: 4 }}>
                        Manage your account and preferences
                    </Typography>

                    <Card sx={{ mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Person sx={{ color: 'var(--primary-terracotta)' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Profile Information
                                </Typography>
                            </Box>
                            <TextField
                                fullWidth
                                label="Username"
                                defaultValue={user.username || ''}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                defaultValue={user.email || ''}
                                type="email"
                                sx={{ mb: 2 }}
                            />
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: 'var(--primary-terracotta)',
                                    '&:hover': {
                                        backgroundColor: 'var(--primary-terracotta-hover)',
                                    },
                                }}
                            >
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Notifications sx={{ color: 'var(--primary-terracotta)' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Notifications
                                </Typography>
                            </Box>
                            <Typography color="text.secondary">
                                Get notified when warranties are about to expire
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Storage sx={{ color: 'var(--primary-terracotta)' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Storage
                                </Typography>
                            </Box>
                            <Typography color="text.secondary">
                                4.5GB of 10GB used • Premium Plan
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default Settings;
