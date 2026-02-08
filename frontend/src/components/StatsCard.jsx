import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

const StatsCard = ({ icon: Icon, label, value, iconBgColor = 'var(--primary-terracotta)' }) => {
    return (
        <Card
            sx={{
                height: '100%',
                boxShadow: 'var(--shadow-sm)',
                borderRadius: 'var(--border-radius-md)',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                    boxShadow: 'var(--shadow-md)',
                },
            }}
        >
            <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            backgroundColor: iconBgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        {Icon && <Icon sx={{ color: 'white', fontSize: 20 }} />}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'var(--text-secondary)',
                                fontSize: '0.8125rem',
                                fontWeight: 500,
                                mb: 0.25,
                            }}
                        >
                            {label}
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'var(--text-primary)',
                                fontWeight: 700,
                                fontSize: '1.375rem',
                            }}
                        >
                            {value}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default StatsCard;
