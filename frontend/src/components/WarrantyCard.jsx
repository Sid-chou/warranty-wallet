import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Box,
    IconButton,
    Collapse,
    Grid,
    LinearProgress,
} from '@mui/material';
import {
    Delete,
    ExpandMore,
    Timer,
    CalendarToday,
    Receipt,
    AttachMoney,
} from '@mui/icons-material';

const WarrantyCard = ({ warranty, onDelete }) => {
    const [expanded, setExpanded] = useState(false);
    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            updateCountdown();
        }, 1000);

        return () => clearInterval(timer);
    }, [warranty]);

    const updateCountdown = () => {
        if (!warranty.expiryDate) {
            setCountdown('Unknown');
            return;
        }

        const now = new Date();
        const expiry = new Date(warranty.expiryDate);
        const diff = expiry - now;

        if (diff < 0) {
            setCountdown('Expired');
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 30) {
            setCountdown(`${days} days`);
        } else if (days > 0) {
            setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
            setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        }
    };

    const getStatusColor = () => {
        switch (warranty.status) {
            case 'ACTIVE':
                return 'success';
            case 'EXPIRING_SOON':
                return 'warning';
            case 'EXPIRED':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusText = () => {
        switch (warranty.status) {
            case 'ACTIVE':
                return 'Active';
            case 'EXPIRING_SOON':
                return 'Expiring Soon';
            case 'EXPIRED':
                return 'Expired';
            default:
                return 'Unknown';
        }
    };

    const getProgressValue = () => {
        if (!warranty.expiryDate || !warranty.invoiceDate) return 0;

        const now = new Date();
        const start = new Date(warranty.invoiceDate);
        const end = new Date(warranty.expiryDate);

        const total = end - start;
        const elapsed = now - start;

        return Math.min(100, Math.max(0, (elapsed / total) * 100));
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 20px -10px rgba(0, 0, 0, 0.2)',
                },
            }}
        >
            <LinearProgress
                variant="determinate"
                value={getProgressValue()}
                color={getStatusColor()}
                sx={{ height: 4 }}
            />

            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" component="div" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
                        {warranty.productName || 'Unknown Product'}
                    </Typography>
                    <Chip
                        label={getStatusText()}
                        color={getStatusColor()}
                        size="small"
                        sx={{ ml: 1 }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Timer sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            Time Remaining:
                        </Typography>
                    </Box>
                    <Typography
                        variant="h5"
                        color={getStatusColor() + '.main'}
                        fontWeight="bold"
                        sx={{ ml: 3.5 }}
                    >
                        {countdown}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        Expires: {warranty.expiryDate ? new Date(warranty.expiryDate).toLocaleDateString() : 'Unknown'}
                    </Typography>
                </Box>

                {warranty.merchantName && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Store: {warranty.merchantName}
                    </Typography>
                )}

                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Grid container spacing={2}>
                            {warranty.invoiceNumber && (
                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">
                                        Invoice Number
                                    </Typography>
                                    <Typography variant="body2">{warranty.invoiceNumber}</Typography>
                                </Grid>
                            )}
                            {warranty.invoiceDate && (
                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">
                                        Purchase Date
                                    </Typography>
                                    <Typography variant="body2">
                                        {new Date(warranty.invoiceDate).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                            )}
                            {warranty.assetPrice && (
                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">
                                        Price
                                    </Typography>
                                    <Typography variant="body2">₹{warranty.assetPrice}</Typography>
                                </Grid>
                            )}
                            {warranty.warrantyPeriod && (
                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">
                                        Warranty Period
                                    </Typography>
                                    <Typography variant="body2">{warranty.warrantyPeriod}</Typography>
                                </Grid>
                            )}
                            {warranty.serialNumber && (
                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">
                                        Serial Number
                                    </Typography>
                                    <Typography variant="body2">{warranty.serialNumber}</Typography>
                                </Grid>
                            )}
                            {warranty.modelNumber && (
                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">
                                        Model Number
                                    </Typography>
                                    <Typography variant="body2">{warranty.modelNumber}</Typography>
                                </Grid>
                            )}
                            {warranty.paymentMethod && (
                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">
                                        Payment Method
                                    </Typography>
                                    <Typography variant="body2">{warranty.paymentMethod}</Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </Collapse>
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <IconButton
                    onClick={() => setExpanded(!expanded)}
                    sx={{
                        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                    }}
                    size="small"
                >
                    <ExpandMore />
                </IconButton>
                <IconButton
                    onClick={() => onDelete(warranty.id)}
                    color="error"
                    size="small"
                >
                    <Delete />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default WarrantyCard;
