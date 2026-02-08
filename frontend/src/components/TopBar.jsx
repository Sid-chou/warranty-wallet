import React from 'react';
import { Box, TextField, IconButton, Avatar, Typography, InputAdornment } from '@mui/material';
import { Search, Notifications } from '@mui/icons-material';

const TopBar = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                backgroundColor: 'var(--background-beige)',
                borderBottom: '1px solid var(--border-color)',
                px: 4,
                py: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
            }}
        >
            {/* Search Bar */}
            <TextField
                placeholder="Search warranties, products, or brands..."
                variant="outlined"
                size="small"
                sx={{
                    flexGrow: 1,
                    maxWidth: 600,
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        '& fieldset': {
                            borderColor: 'var(--border-color)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'var(--text-secondary)',
                        },
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search sx={{ color: 'var(--text-tertiary)', fontSize: 20 }} />
                        </InputAdornment>
                    ),
                }}
            />

            <Box sx={{ flexGrow: 1 }} />

            {/* Notification Icon */}
            <IconButton
                sx={{
                    color: 'var(--text-secondary)',
                    '&:hover': {
                        backgroundColor: 'rgba(184, 92, 78, 0.08)',
                    },
                }}
            >
                <Notifications />
            </IconButton>

            {/* User Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            lineHeight: 1.2,
                        }}
                    >
                        {user.username || 'User'}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.75rem',
                        }}
                    >
                        Premium Plan
                    </Typography>
                </Box>
                <Avatar
                    sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: 'var(--primary-terracotta)',
                        fontWeight: 600,
                    }}
                >
                    {(user.username || 'U')[0].toUpperCase()}
                </Avatar>
            </Box>
        </Box>
    );
};

export default TopBar;
