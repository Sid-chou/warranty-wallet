import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Grid,
    Tabs,
    Tab,
    CircularProgress,
} from '@mui/material';
import { Logout, Upload } from '@mui/icons-material';
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
    const [user, setUser] = useState({});

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
        fetchWarranties();
    }, []);

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

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
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

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        Warranty Wallet
                    </Typography>
                    <Typography variant="body1" sx={{ mr: 3 }}>
                        Welcome, {user.username}!
                    </Typography>
                    <Button
                        color="inherit"
                        startIcon={<Upload />}
                        onClick={() => setUploadDialogOpen(true)}
                        sx={{ mr: 2 }}
                    >
                        Scan Bill
                    </Button>
                    <Button
                        color="inherit"
                        startIcon={<Logout />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Your Warranties
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Track and manage all your product warranties in one place
                    </Typography>
                </Box>

                <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    sx={{ mb: 3 }}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label={`All (${warranties.length})`} />
                    <Tab
                        label={`Active (${warranties.filter(w => w.status === 'ACTIVE').length})`}
                        sx={{ color: 'success.main' }}
                    />
                    <Tab
                        label={`Expiring Soon (${warranties.filter(w => w.status === 'EXPIRING_SOON').length})`}
                        sx={{ color: 'warning.main' }}
                    />
                    <Tab
                        label={`Expired (${warranties.filter(w => w.status === 'EXPIRED').length})`}
                        sx={{ color: 'error.main' }}
                    />
                </Tabs>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
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
                                        bgcolor: 'background.paper',
                                        borderRadius: 4,
                                    }}
                                >
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No warranties found
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Upload a bill to get started
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Upload />}
                                        onClick={() => setUploadDialogOpen(true)}
                                    >
                                        Scan Your First Bill
                                    </Button>
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
            </Container>

            <UploadDialog
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                onSuccess={handleUploadSuccess}
            />
        </Box>
    );
};

export default Dashboard;
