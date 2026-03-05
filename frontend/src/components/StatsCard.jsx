import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

const StatsCard = ({ icon: Icon, label, value, iconBgColor = '#E8420A' }) => {
    return (
        <Card
            sx={{
                height: '100%',
                boxShadow: 'var(--shadow-sm)',
                borderRadius: '16px',
                transition: 'box-shadow 0.2s',
                '&:hover': {
                    boxShadow: 'var(--shadow-md)',
                },
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '12px',
                            backgroundColor: iconBgColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        {Icon && <Icon sx={{ color: 'white', fontSize: 22 }} />}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#888',
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
                                color: '#1a1a1a',
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
