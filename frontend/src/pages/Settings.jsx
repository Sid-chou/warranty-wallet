import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Divider } from '@mui/material';
import { Person, Notifications, Storage, Security } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const Settings = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleToggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar open={sidebarOpen} />

            <Box
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
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
                                    backgroundColor: '#C0392B',
                                    borderRadius: '50px',
                                    fontWeight: 700,
                                    '&:hover': {
                                        backgroundColor: '#A93226',
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
                                <Notifications sx={{ color: '#E8420A' }} />
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
                                <Storage sx={{ color: '#E8420A' }} />
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
