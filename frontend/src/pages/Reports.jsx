import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { TrendingUp, Assignment, PieChart } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatsCard from '../components/StatsCard';

const Reports = () => {
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
                        Reports & Analytics
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#888', fontSize: '14px', mb: 4 }}>
                        Insights and analytics for your warranties
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <StatsCard
                                icon={TrendingUp}
                                label="Average Warranty Period"
                                value="18 months"
                                iconBgColor="#E8420A"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatsCard
                                icon={Assignment}
                                label="Most Common Category"
                                value="Electronics"
                                iconBgColor="var(--status-active)"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatsCard
                                icon={PieChart}
                                label="Warranties Added"
                                value="12 this year"
                                iconBgColor="var(--status-warning)"
                            />
                        </Grid>
                    </Grid>

                    <Card sx={{ mt: 4, p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Coming Soon
                        </Typography>
                        <Typography color="text.secondary">
                            Detailed analytics and reporting features will be available soon, including
                            warranty expiration timelines, value protected over time, and category breakdowns.
                        </Typography>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default Reports;
