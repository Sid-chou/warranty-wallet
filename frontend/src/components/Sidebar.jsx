import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    LinearProgress,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Receipt,
    Category,
    Analytics,
    Settings as SettingsIcon,
    Logout,
} from '@mui/icons-material';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Overview', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'My Warranties', icon: <Receipt />, path: '/dashboard' },
        { text: 'Categories', icon: <Category />, path: '/categories' },
        { text: 'Reports', icon: <Analytics />, path: '/reports' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard' || location.pathname === '/';
        }
        return location.pathname === path;
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 'var(--sidebar-width)',
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 'var(--sidebar-width)',
                    boxSizing: 'border-box',
                    backgroundColor: 'var(--sidebar-gray)',
                    borderRight: '1px solid var(--border-color)',
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Logo Section */}
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '8px',
                            backgroundColor: 'var(--primary-terracotta)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '1.25rem',
                        }}
                    >
                        W
                    </Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            fontSize: '1.125rem',
                        }}
                    >
                        Warranty Wallet
                    </Typography>
                </Box>

                {/* Navigation Menu */}
                <List sx={{ px: 2, flexGrow: 1 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    borderRadius: '8px',
                                    backgroundColor: isActive(item.path)
                                        ? 'rgba(184, 92, 78, 0.1)'
                                        : 'transparent',
                                    color: isActive(item.path)
                                        ? 'var(--primary-terracotta)'
                                        : 'var(--text-secondary)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(184, 92, 78, 0.08)',
                                    },
                                    py: 1.25,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive(item.path)
                                            ? 'var(--primary-terracotta)'
                                            : 'var(--text-secondary)',
                                        minWidth: 40,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: '0.9375rem',
                                        fontWeight: isActive(item.path) ? 600 : 500,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}

                    {/* Logout */}
                    <ListItem disablePadding sx={{ mt: 1 }}>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                borderRadius: '8px',
                                color: 'var(--text-secondary)',
                                '&:hover': {
                                    backgroundColor: 'rgba(184, 92, 78, 0.08)',
                                },
                                py: 1.25,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: 'var(--text-secondary)',
                                    minWidth: 40,
                                }}
                            >
                                <Logout />
                            </ListItemIcon>
                            <ListItemText
                                primary="Logout"
                                primaryTypographyProps={{
                                    fontSize: '0.9375rem',
                                    fontWeight: 500,
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>

                {/* Storage Usage */}
                <Box sx={{ p: 2, m: 2, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 2 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'var(--text-secondary)',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            letterSpacing: '0.5px',
                        }}
                    >
                        Storage Usage
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={45}
                        sx={{
                            my: 1,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(184, 92, 78, 0.1)',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: 'var(--primary-terracotta)',
                                borderRadius: 3,
                            },
                        }}
                    />
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'var(--text-tertiary)',
                            fontSize: '0.75rem',
                        }}
                    >
                        4.5GB of 10GB used
                    </Typography>
                </Box>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
