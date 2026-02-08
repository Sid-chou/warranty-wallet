import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Category as CategoryIcon } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const Categories = () => {
    const categories = [
        { name: 'Electronics', count: 5, color: '#667eea' },
        { name: 'Appliances', count: 3, color: '#f59e0b' },
        { name: 'Furniture', count: 2, color: '#10b981' },
        { name: 'Automotive', count: 1, color: '#ef4444' },
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <TopBar />

                <Box sx={{ flexGrow: 1, p: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 1 }}>
                        Categories
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--text-secondary)', mb: 4 }}>
                        Browse warranties by category
                    </Typography>

                    <Grid container spacing={3}>
                        {categories.map((category) => (
                            <Grid item xs={12} sm={6} md={3} key={category.name}>
                                <Card
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: 'var(--shadow-sm)',
                                        '&:hover': {
                                            boxShadow: 'var(--shadow-md)',
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: '12px',
                                                    backgroundColor: category.color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <CategoryIcon sx={{ color: 'white' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {category.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {category.count} items
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default Categories;
