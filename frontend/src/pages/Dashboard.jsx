import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Grid,
    Tabs,
    Tab,
    CircularProgress,
} from '@mui/material';
import { Add, Receipt, Warning, CheckCircle } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatsCard from '../components/StatsCard';
import WarrantyCard from '../components/WarrantyCard';
import UploadDialog from '../components/UploadDialog';
import { warrantyAPI } from '../services/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [warranties, setWarranties] = useState([]);
    const [filteredWarranties, setFilteredWarranties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login');
            return;
        }
        fetchWarranties();
    }, [navigate]);

    useEffect(() => {
        filterWarranties();
    }, [warranties, tabValue]);

    const fetchWarranties = async () => {
        try {
            setLoading(true);
            const response = await warrantyAPI.getAllWarranties();
            setWarranties(response.data);
        } catch (error) {
            console.error('Failed to fetch warranties:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterWarranties = () => {
        let filtered = warranties;

        switch (tabValue) {
            case 0: // All
                filtered = warranties;
                break;
            case 1: // Active
                filtered = warranties.filter(w => w.status === 'ACTIVE');
                break;
            case 2: // Expiring Soon
                filtered = warranties.filter(w => w.status === 'EXPIRING_SOON');
                break;
            case 3: // Expired
                filtered = warranties.filter(w => w.status === 'EXPIRED');
                break;
            default:
                filtered = warranties;
        }

        setFilteredWarranties(filtered);
    };

    const handleUploadSuccess = () => {
        setUploadDialogOpen(false);
        fetchWarranties();
    };

    const handleDelete = async (id) => {
        try {
            await warrantyAPI.deleteWarranty(id);
            fetchWarranties();
        } catch (error) {
            console.error('Failed to delete warranty:', error);
        }
    };

    // Calculate statistics
    const totalAssets = warranties.reduce((sum, w) => sum + (parseFloat(w.assetPrice) || 0), 0);
    const expiringSoonCount = warranties.filter(w => w.status === 'EXPIRING_SOON').length;
    const activeCount = warranties.filter(w => w.status === 'ACTIVE').length;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <TopBar />

                <Box sx={{ flexGrow: 1, p: 4 }}>
                    {/* Page Header */}
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    mb: 1,
                                }}
                            >
                                Your Warranties
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                Manage and track protection for all your assets in one place.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setUploadDialogOpen(true)}
                            sx={{
                                backgroundColor: 'var(--primary-terracotta)',
                                color: 'white',
                                px: 3,
                                py: 1.5,
                                borderRadius: 'var(--border-radius-sm)',
                                fontWeight: 600,
                                boxShadow: 'var(--shadow-sm)',
                                '&:hover': {
                                    backgroundColor: 'var(--primary-terracotta-hover)',
                                    boxShadow: 'var(--shadow-md)',
                                },
                            }}
                        >
                            Add New Warranty
                        </Button>
                    </Box>

                    {/* Tabs */}
                    <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'var(--border-color)' }}>
                        <Tabs
                            value={tabValue}
                            onChange={(e, newValue) => setTabValue(newValue)}
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: '0.9375rem',
                                    color: 'var(--text-secondary)',
                                    '&.Mui-selected': {
                                        color: 'var(--primary-terracotta)',
                                    },
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: 'var(--primary-terracotta)',
                                    height: 3,
                                    borderRadius: '3px 3px 0 0',
                                },
                            }}
                        >
                            <Tab label={`All Warranties (${warranties.length})`} />
                            <Tab label={`Active (${warranties.filter(w => w.status === 'ACTIVE').length})`} />
                            <Tab label={`Expiring Soon (${warranties.filter(w => w.status === 'EXPIRING_SOON').length})`} />
                            <Tab label={`Expired (${warranties.filter(w => w.status === 'EXPIRED').length})`} />
                        </Tabs>
                    </Box>

                    {/* Stats Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={4}>
                            <StatsCard
                                icon={Receipt}
                                label="Total Assets"
                                value={`$${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatsCard
                                icon={Warning}
                                label="Expiring Soon"
                                value={`${expiringSoonCount} Product${expiringSoonCount !== 1 ? 's' : ''}`}
                                iconBgColor="var(--status-warning)"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatsCard
                                icon={CheckCircle}
                                label="Active Protection"
                                value={`${activeCount} Item${activeCount !== 1 ? 's' : ''}`}
                                iconBgColor="var(--status-active)"
                            />
                        </Grid>
                    </Grid>

                    {/* Warranty Cards */}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress sx={{ color: 'var(--primary-terracotta)' }} />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredWarranties.length === 0 ? (
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            py: 8,
                                            px: 2,
                                            bgcolor: 'white',
                                            borderRadius: 'var(--border-radius-md)',
                                            boxShadow: 'var(--shadow-sm)',
                                        }}
                                    >
                                        <Typography variant="h6" color="var(--text-secondary)" gutterBottom>
                                            No warranties found
                                        </Typography>
                                        <Typography variant="body2" color="var(--text-tertiary)" sx={{ mb: 3 }}>
                                            {tabValue === 0 ? 'Upload a bill to get started' : 'No warranties in this category'}
                                        </Typography>
                                        {tabValue === 0 && (
                                            <Button
                                                variant="contained"
                                                startIcon={<Add />}
                                                onClick={() => setUploadDialogOpen(true)}
                                                sx={{
                                                    backgroundColor: 'var(--primary-terracotta)',
                                                    '&:hover': {
                                                        backgroundColor: 'var(--primary-terracotta-hover)',
                                                    },
                                                }}
                                            >
                                                Scan Your First Bill
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                            ) : (
                                filteredWarranties.map((warranty) => (
                                    <Grid item xs={12} sm={6} md={4} key={warranty.id}>
                                        <WarrantyCard warranty={warranty} onDelete={handleDelete} />
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    )}
                </Box>
            </Box>

            <UploadDialog
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                onSuccess={handleUploadSuccess}
            />
        </Box>
    );
};

export default Dashboard;
