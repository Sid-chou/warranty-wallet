import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    LinearProgress,
    Alert,
    Paper,
} from '@mui/material';
import { CloudUpload, CheckCircle } from '@mui/icons-material';
import { warrantyAPI } from '../services/api';

const UploadDialog = ({ open, onClose, onSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [extractedData, setExtractedData] = useState(null);
    const [processingStatus, setProcessingStatus] = useState('idle');
    // idle | uploading | processing | done

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }

            setSelectedFile(file);
            setError('');

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file');
            return;
        }

        setUploading(true);
        setError('');
        setProcessingStatus('uploading');

        try {
            // Step 1 — submit job, get jobId instantly
            const response = await warrantyAPI.scanBillAsync(selectedFile);
            const { jobId } = response.data;

            setProcessingStatus('processing');

            // Step 2 — poll every 2 seconds
            const result = await pollForResult(jobId);

            setExtractedData(result);
            setProcessingStatus('done');

            // Auto-close after showing success
            setTimeout(() => {
                handleClose();
                onSuccess();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to scan bill. Please try again.');
            setProcessingStatus('idle');
        } finally {
            setUploading(false);
        }
    };

    // Polling helper
    const pollForResult = (jobId) => {
        return new Promise((resolve, reject) => {
            const maxAttempts = 30; // 30 × 2s = 60 seconds max wait
            let attempts = 0;

            const interval = setInterval(async () => {
                try {
                    attempts++;
                    const res = await warrantyAPI.getScanStatus(jobId);
                    const { status, data } = res.data;

                    if (status === 'done') {
                        clearInterval(interval);
                        resolve(JSON.parse(data));
                    }

                    if (status && status.startsWith('failed')) {
                        clearInterval(interval);
                        reject(new Error(res.data.reason || 'OCR failed'));
                    }

                    if (attempts >= maxAttempts) {
                        clearInterval(interval);
                        reject(new Error('Scan timed out. Please try again.'));
                    }
                } catch (err) {
                    clearInterval(interval);
                    reject(err);
                }
            }, 2000);
        });
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreview(null);
        setError('');
        setExtractedData(null);
        setProcessingStatus('idle');
        onClose();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect({ target: { files: [file] } });
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography component="span" variant="h6" fontWeight="bold">
                    Scan Bill for Warranty
                </Typography>
            </DialogTitle>

            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {extractedData ? (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                        <Typography variant="h6" color="success.main" gutterBottom>
                            Bill Scanned Successfully!
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Your warranty has been added to your dashboard
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {!preview ? (
                            <Paper
                                sx={{
                                    border: 2,
                                    borderColor: 'primary.main',
                                    borderStyle: 'dashed',
                                    borderRadius: 2,
                                    p: 4,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                }}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('file-input').click()}
                            >
                                <input
                                    id="file-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                />
                                <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    Drop your bill image here
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    or click to browse
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                    Supported formats: PNG, JPG, JPEG
                                </Typography>
                            </Paper>
                        ) : (
                            <Box>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        height: 300,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        mb: 2,
                                    }}
                                >
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </Box>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setPreview(null);
                                    }}
                                >
                                    Choose Different Image
                                </Button>
                            </Box>
                        )}

                        {processingStatus === 'uploading' && (
                            <Box sx={{ mt: 2 }}>
                                <LinearProgress />
                                <Typography variant="body2" color="primary" align="center" sx={{ mt: 1 }}>
                                    Uploading image...
                                </Typography>
                            </Box>
                        )}
                        {processingStatus === 'processing' && (
                            <Box sx={{ mt: 2 }}>
                                <LinearProgress color="warning" />
                                <Typography 
                                    variant="body2" 
                                    color="warning.main" 
                                    align="center" 
                                    sx={{ mt: 1 }}
                                >
                                    Scanning bill with AI... please wait
                                </Typography>
                            </Box>
                        )}
                        {processingStatus === 'done' && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="success.main" align="center">
                                    Scan complete!
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </DialogContent>

            {!extractedData && (
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                    >
                        {processingStatus === 'uploading' && 'Uploading...'}
                        {processingStatus === 'processing' && 'Processing...'}
                        {processingStatus === 'done' && 'Done!'}
                        {processingStatus === 'idle' && 'Scan Bill'}
                    </Button>
                </DialogActions>
            )}
        </Dialog>
    );
};

export default UploadDialog;
