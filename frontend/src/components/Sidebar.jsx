import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
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
    Shield,
} from '@mui/icons-material';
import logo1 from '../assets/logo1.png';

const SIDEBAR_WIDTH = 220;

const Sidebar = ({ open = true, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
            variant={isMobile ? "temporary" : "persistent"}
            anchor="left"
            open={open}
            onClose={onClose}
            sx={{
                width: open ? SIDEBAR_WIDTH : 0,
                flexShrink: 0,
                transition: 'width 0.3s ease',
                '& .MuiDrawer-paper': {
                    width: SIDEBAR_WIDTH,
                    boxSizing: 'border-box',
                    backgroundColor: '#FFFFFF',
                    borderRight: '1px solid var(--border-color)',
                    transition: 'transform 0.3s ease',
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Logo Section */}
                <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <img
                        src={logo1}
                        alt="Logo"
                        style={{
                            width: 78,
                            height: 78,
                            objectFit: 'contain',
                            marginRight: '-10px' // This "pulls" the text closer to the logo graphics
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            fontSize: '1.1rem',
                            letterSpacing: '0.2px',
                            lineHeight: 1.2
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
                                    borderRadius: '50px',
                                    backgroundColor: isActive(item.path)
                                        ? '#FDF0EB'
                                        : 'transparent',
                                    color: isActive(item.path)
                                        ? '#E8420A'
                                        : 'var(--text-secondary)',
                                    '&:hover': {
                                        backgroundColor: isActive(item.path)
                                            ? '#FDF0EB'
                                            : 'rgba(232, 66, 10, 0.04)',
                                    },
                                    py: 1.25,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive(item.path)
                                            ? '#E8420A'
                                            : 'var(--text-secondary)',
                                        minWidth: 40,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: '0.875rem',
                                        fontWeight: isActive(item.path) ? 600 : 500,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}

                </List>

                {/* Bottom Section (Logout) */}
                <Box sx={{ px: 2, pb: 2 }}>
                    <List disablePadding>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleLogout}
                                sx={{
                                    borderRadius: '50px',
                                    color: '#888',
                                    '&:hover': {
                                        backgroundColor: 'rgba(220, 38, 38, 0.04)',
                                    },
                                    py: 1.25,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: '#888',
                                        minWidth: 40,
                                    }}
                                >
                                    <Logout />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Logout"
                                    primaryTypographyProps={{
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>

                {/* Storage Usage */}
                {/* <Box sx={{ p: 2, m: 2, backgroundColor: '#FAFAFA', borderRadius: 2 }}>
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
                            backgroundColor: 'rgba(232, 66, 10, 0.1)',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: '#E8420A',
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
                </Box> */}
            </Box>
        </Drawer>
    );
};

export default Sidebar;
