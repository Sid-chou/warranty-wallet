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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

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
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <Box
                sx={{
                    flexGrow: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}
            >
                <TopBar onToggleSidebar={handleToggleSidebar} />

                <Box sx={{ flexGrow: 1, p: 4 }}>
                    {/* Page Header */}
                    <Box sx={{ 
                        mb: 4, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: 2,
                    }}>
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: '#1a1a1a',
                                    mb: 1,
                                    fontSize: '26px',
                                }}
                            >
                                Your Warranties
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#888',
                                    fontSize: '14px',
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
                                backgroundColor: '#C0392B',
                                color: 'white',
                                px: 3,
                                py: 1.5,
                                borderRadius: '50px',
                                fontWeight: 700,
                                boxShadow: 'var(--shadow-sm)',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#A93226',
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
                                    fontSize: '0.875rem',
                                    color: '#999',
                                    '&.Mui-selected': {
                                        color: '#E8420A',
                                        fontWeight: 700,
                                    },
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#E8420A',
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
                            <CircularProgress sx={{ color: '#E8420A' }} />
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
                                                    backgroundColor: '#C0392B',
                                                    borderRadius: '50px',
                                                    fontWeight: 700,
                                                    '&:hover': {
                                                        backgroundColor: '#A93226',
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
