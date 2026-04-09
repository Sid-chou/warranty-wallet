import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Laptop,
  Headphones,
  Watch,
  Article,
  PictureAsPdf,
} from "@mui/icons-material";
import { TbTrash } from "react-icons/tb";

const WarrantyCard = ({ warranty, onDelete }) => {
  const [countdown, setCountdown] = useState("");

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this warranty?")) {
      onDelete(warranty.id);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(timer);
  }, [warranty]);

  const updateCountdown = () => {
    if (!warranty.expiryDate) {
      setCountdown("Unknown");
      return;
    }

    const now = new Date();
    const expiry = new Date(warranty.expiryDate);
    const diff = expiry - now;

    if (diff < 0) {
      setCountdown("Expired");
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    setCountdown(`${days} days`);
  };

  const getStatusColor = () => {
    switch (warranty.status) {
      case "ACTIVE":
        return "var(--status-active)";
      case "EXPIRING_SOON":
        return "var(--status-warning)";
      case "EXPIRED":
        return "var(--status-error)";
      default:
        return "var(--text-tertiary)";
    }
  };

  const getStatusBgColor = () => {
    switch (warranty.status) {
      case "ACTIVE":
        return "var(--status-active-bg)";
      case "EXPIRING_SOON":
        return "var(--status-warning-bg)";
      case "EXPIRED":
        return "var(--status-error-bg)";
      default:
        return "#f5f5f5";
    }
  };

  const getStatusText = () => {
    if (
      warranty.status === "EXPIRING_SOON" &&
      countdown !== "Expired" &&
      countdown !== "Unknown"
    ) {
      return `EXPIRING IN ${countdown.toUpperCase()}`;
    }
    switch (warranty.status) {
      case "ACTIVE":
        return "ACTIVE";
      case "EXPIRED":
        return "EXPIRED";
      default:
        return warranty.status;
    }
  };

  // Get product icon based on category or product name
  const getProductIcon = () => {
    const productName = (warranty.productName || "").toLowerCase();
    if (
      productName.includes("laptop") ||
      productName.includes("macbook") ||
      productName.includes("computer")
    ) {
      return <Laptop sx={{ fontSize: 48 }} />;
    }
    if (
      productName.includes("headphone") ||
      productName.includes("earphone") ||
      productName.includes("airpod")
    ) {
      return <Headphones sx={{ fontSize: 48 }} />;
    }
    if (productName.includes("watch") || productName.includes("smartwatch")) {
      return <Watch sx={{ fontSize: 48 }} />;
    }
    return <Article sx={{ fontSize: 48 }} />;
  };

  const getPrimaryAction = () => {
    if (warranty.status === "EXPIRED") return "Renew";
    if (warranty.status === "EXPIRING_SOON") return "Extend";
    return "Claim";
  };

  const handleExportPdf = async () => {
    try {
      const { exportWarrantyPDF } = await import("../services/pdfService");
      await exportWarrantyPDF(warranty);
    } catch (error) {
      console.error("Failed to export PDF:", error);
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "var(--shadow-sm)",
        borderRadius: "16px",
        transition: "all 0.2s",
        position: "relative",
        "&:hover": {
          boxShadow: "var(--shadow-md)",
        },
      }}
    >
      {/* Delete Button (Top Left) */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 2,
        }}
      >
        <Tooltip title="Delete Warranty" placement="top" arrow>
          <IconButton
            onClick={handleDelete}
            size="small"
            sx={{
              backgroundColor: "rgba(192, 57, 43, 0.04)",
              color: "#C0392B",
              "&:hover": {
                backgroundColor: "rgba(192, 57, 43, 0.11)",
                color: "#A93226",
              },
            }}
          >
            <TbTrash size={18} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Status Badge */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1,
        }}
      >
        <Chip
          label={getStatusText()}
          sx={{
            backgroundColor: getStatusBgColor(),
            color: getStatusColor(),
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 24,
            borderRadius: "6px",
            letterSpacing: "0.5px",
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, textAlign: "center", pt: 3 }}>
        {/* Product Icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            color: "var(--text-primary)",
          }}
        >
          {getProductIcon()}
        </Box>

        {/* Product Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "var(--text-primary)",
            mb: 0.5,
            fontSize: "1.125rem",
          }}
        >
          {warranty.productName || "Unknown Product"}
        </Typography>

        {/* Manufacturer + Serial */}
        <Typography
          variant="body2"
          sx={{
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            mb: 3,
          }}
        >
          {warranty.merchantName || "Unknown"} • Serial:{" "}
          {warranty.serialNumber?.slice(-8) || "N/A"}
        </Typography>

        {/* Dates in Two Columns */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography
              variant="caption"
              sx={{
                color: "var(--text-tertiary)",
                fontSize: "0.75rem",
                display: "block",
                mb: 0.5,
              }}
            >
              Purchase Date
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              {warranty.invoiceDate
                ? new Date(warranty.invoiceDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="caption"
              sx={{
                color: "var(--text-tertiary)",
                fontSize: "0.75rem",
                display: "block",
                mb: 0.5,
              }}
            >
              Expires
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              {warranty.expiryDate
                ? new Date(warranty.expiryDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      {/* Action Buttons */}
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            color: "var(--text-secondary)",
            borderColor: "var(--border-color)",
            borderRadius: "50px",
            fontWeight: 600,
            "&:hover": {
              borderColor: "var(--text-secondary)",
              backgroundColor: "rgba(0,0,0,0.02)",
            },
          }}
        >
          View Details
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleExportPdf}
          startIcon={<PictureAsPdf />}
          sx={{
            color: "#C0392B",
            borderColor: "#C0392B",
            borderRadius: "50px",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#A93226",
              backgroundColor: "rgba(192, 57, 43, 0.05)",
            },
          }}
        >
          PDF
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#C0392B",
            borderRadius: "50px",
            fontWeight: 700,
            boxShadow: "var(--shadow-sm)",
            "&:hover": {
              backgroundColor: "#A93226",
              boxShadow: "var(--shadow-md)",
            },
          }}
        >
          {getPrimaryAction()}
        </Button>
      </CardActions>
    </Card>
  );
};

export default WarrantyCard;
