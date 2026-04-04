import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  Divider,
  Grid,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { warrantyAPI } from "../services/api";
import {
  CATEGORY_CONFIG,
  CATEGORY_ORDER,
  categorizeWarranty,
  groupWarrantiesByCategory,
} from "../services/categoryUtils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStatusStyle = (status) => {
  switch (status) {
    case "ACTIVE":
      return { color: "#10b981", bg: "#d1fae5", label: "ACTIVE" };
    case "EXPIRING_SOON":
      return { color: "#f59e0b", bg: "#fef3c7", label: "EXPIRING SOON" };
    case "EXPIRED":
      return { color: "#ef4444", bg: "#fee2e2", label: "EXPIRED" };
    default:
      return { color: "#9ca3af", bg: "#f3f4f6", label: status || "UNKNOWN" };
  }
};

const getDaysRemaining = (expiryDate) => {
  if (!expiryDate) return null;
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry - now;
  if (diff < 0) return null;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ─── CategoryWarrantyCard sub-component ───────────────────────────────────────

const CategoryWarrantyCard = ({ warranty }) => {
  const catName = categorizeWarranty(warranty);
  const catConfig = CATEGORY_CONFIG[catName] || CATEGORY_CONFIG["Other"];
  const statusStyle = getStatusStyle(warranty.status);
  const daysRemaining = getDaysRemaining(warranty.expiryDate);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "visible",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.13)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Category chip — top left */}
      <Box sx={{ position: "absolute", top: -11, left: 14, zIndex: 2 }}>
        <Chip
          label={`${catConfig.emoji} ${catName}`}
          size="small"
          sx={{
            background: catConfig.gradient,
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.67rem",
            height: 22,
            borderRadius: "6px",
            letterSpacing: "0.3px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
            "& .MuiChip-label": { px: 1 },
          }}
        />
      </Box>

      {/* Status chip — top right */}
      <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
        <Chip
          label={statusStyle.label}
          size="small"
          sx={{
            backgroundColor: statusStyle.bg,
            color: statusStyle.color,
            fontWeight: 700,
            fontSize: "0.67rem",
            height: 22,
            borderRadius: "6px",
            letterSpacing: "0.5px",
            "& .MuiChip-label": { px: 1 },
          }}
        />
      </Box>

      <CardContent sx={{ pt: 3.5, pb: 2, flexGrow: 1, px: 2.5 }}>
        {/* Product Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            color: "#1a1a1a",
            mb: 0.4,
            pr: 9,
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {warranty.productName || "Unknown Product"}
        </Typography>

        {/* Merchant + Serial */}
        <Typography
          variant="body2"
          sx={{ color: "#9ca3af", fontSize: "0.8rem", mb: 2 }}
        >
          {warranty.merchantName || "Unknown Merchant"}
          {warranty.serialNumber
            ? ` • SN: …${warranty.serialNumber.slice(-8)}`
            : ""}
        </Typography>

        <Divider sx={{ mb: 2, borderColor: "rgba(0,0,0,0.06)" }} />

        {/* Dates row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#bdbdbd",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                display: "block",
                mb: 0.3,
              }}
            >
              Purchased
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "0.82rem", color: "#333" }}
            >
              {formatDate(warranty.invoiceDate)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              sx={{
                color: "#bdbdbd",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                display: "block",
                mb: 0.3,
              }}
            >
              Expires
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: "0.82rem",
                color: warranty.status === "EXPIRED" ? "#ef4444" : "#333",
              }}
            >
              {formatDate(warranty.expiryDate)}
            </Typography>
          </Box>
        </Box>

        {/* Days remaining / expired pill */}
        {daysRemaining !== null ? (
          <Box
            sx={{
              mt: 0.5,
              px: 1.5,
              py: 0.6,
              borderRadius: "8px",
              backgroundColor: statusStyle.bg,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: statusStyle.color,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: statusStyle.color,
                fontWeight: 700,
                fontSize: "0.75rem",
              }}
            >
              {daysRemaining === 0
                ? "Expires today"
                : `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining`}
            </Typography>
          </Box>
        ) : warranty.status === "EXPIRED" ? (
          <Box
            sx={{
              mt: 0.5,
              px: 1.5,
              py: 0.6,
              borderRadius: "8px",
              backgroundColor: "#fee2e2",
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#ef4444",
                flexShrink: 0,
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: "#ef4444", fontWeight: 700, fontSize: "0.75rem" }}
            >
              Warranty expired
            </Typography>
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
};

// ─── "All" card config ────────────────────────────────────────────────────────

const ALL_CARD_CONFIG = {
  color: "#E8420A",
  gradient: "linear-gradient(135deg, #E8420A 0%, #c0392b 100%)",
  emoji: "🗂️",
};

// ─── Main page component ──────────────────────────────────────────────────────

const Categories = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch warranties on mount — redirect to /login if no user session
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || !user.token) {
      navigate("/login");
      return;
    }

    const fetchWarranties = async () => {
      try {
        setLoading(true);
        const response = await warrantyAPI.getAllWarranties();
        const data = response.data;
        setWarranties(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch warranties:", err);
        setWarranties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWarranties();
  }, [navigate]);

  // Group all warranties by category (memoised)
  const grouped = useMemo(
    () => groupWarrantiesByCategory(warranties),
    [warranties],
  );

  // Filtered list for the cards grid
  const displayWarranties = useMemo(() => {
    const base =
      selectedCategory === "All" ? warranties : grouped[selectedCategory] || [];
    if (!searchQuery.trim()) return base;
    const q = searchQuery.toLowerCase();
    return base.filter(
      (w) =>
        (w.productName || "").toLowerCase().includes(q) ||
        (w.merchantName || "").toLowerCase().includes(q),
    );
  }, [warranties, grouped, selectedCategory, searchQuery]);

  // Build the category pill array shown in the grid
  const categoryPills = useMemo(() => {
    const hasAny = warranties.length > 0;

    // No warranties yet → show all categories with 0 so the user can see what's available
    if (!hasAny) {
      return [
        { name: "All", count: 0, config: ALL_CARD_CONFIG },
        ...CATEGORY_ORDER.map((cat) => ({
          name: cat,
          count: 0,
          config: CATEGORY_CONFIG[cat],
        })),
      ];
    }

    // Only show categories that actually have items (plus "All")
    const pills = [
      { name: "All", count: warranties.length, config: ALL_CARD_CONFIG },
    ];
    for (const cat of CATEGORY_ORDER) {
      const count = grouped[cat]?.length || 0;
      if (count > 0) {
        pills.push({ name: cat, count, config: CATEGORY_CONFIG[cat] });
      }
    }
    return pills;
  }, [warranties, grouped]);

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

  const selectedConfig =
    selectedCategory === "All"
      ? ALL_CARD_CONFIG
      : CATEGORY_CONFIG[selectedCategory] || CATEGORY_CONFIG["Other"];

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--background-beige, #fafafa)",
      }}
    >
      <Sidebar open={sidebarOpen} />

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.3s ease",
        }}
      >
        <TopBar onToggleSidebar={handleToggleSidebar} />

        <Box sx={{ flexGrow: 1, p: 4 }}>
          {/* ── Page header ───────────────────────────────────────── */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1a1a1a",
              mb: 0.75,
              fontSize: "26px",
            }}
          >
            Categories
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#888", fontSize: "14px", mb: 3 }}
          >
            Browse and filter your warranties by category
          </Typography>

          {/* ── Search bar ────────────────────────────────────────── */}
          <TextField
            placeholder="Search by product or merchant name…"
            variant="outlined"
            fullWidth
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              mb: 3,
              maxWidth: 560,
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                backgroundColor: "#fff",
                "& fieldset": {
                  borderColor: "#e0e0e0",
                  borderWidth: "1.5px",
                },
                "&:hover fieldset": { borderColor: "#bdbdbd" },
                "&.Mui-focused fieldset": {
                  borderColor: "#E8420A",
                  borderWidth: "2px",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9ca3af", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          {/* ── Category pills grid ───────────────────────────────── */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
            {categoryPills.map(({ name, count, config }) => {
              const isSelected = selectedCategory === name;
              return (
                <Tooltip
                  key={name}
                  title={`${count} ${count === 1 ? "item" : "items"}`}
                  placement="top"
                  arrow
                >
                  <Card
                    onClick={() => setSelectedCategory(name)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "16px",
                      border: isSelected
                        ? `2px solid ${config.color}`
                        : "2px solid transparent",
                      boxShadow: isSelected
                        ? "0 8px 24px rgba(0,0,0,0.12)"
                        : "0 2px 8px rgba(0,0,0,0.06)",
                      transform: isSelected
                        ? "translateY(-3px)"
                        : "translateY(0)",
                      transition: "all 0.2s ease",
                      minWidth: 148,
                      backgroundColor: "#fff",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        py: "12px !important",
                        px: 2,
                      }}
                    >
                      {/* Emoji icon box */}
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: "14px",
                          background: config.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.5rem",
                          flexShrink: 0,
                          boxShadow: isSelected
                            ? `0 4px 14px ${config.color}55`
                            : "0 2px 6px rgba(0,0,0,0.10)",
                          transition: "box-shadow 0.2s ease",
                        }}
                      >
                        {config.emoji}
                      </Box>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: isSelected ? config.color : "#1a1a1a",
                            fontSize: "0.85rem",
                            lineHeight: 1.2,
                            mb: 0.3,
                            transition: "color 0.2s",
                          }}
                        >
                          {name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#9ca3af",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                          }}
                        >
                          {count} {count === 1 ? "item" : "items"}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Tooltip>
              );
            })}
          </Box>

          {/* ── Section divider ───────────────────────────────────── */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Divider sx={{ flexGrow: 1 }} />
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: "#9ca3af",
                fontSize: "0.8rem",
                fontWeight: 500,
                whiteSpace: "nowrap",
                px: 1,
              }}
            >
              {loading ? (
                "Loading…"
              ) : (
                <>
                  {displayWarranties.length}{" "}
                  {displayWarranties.length === 1 ? "item" : "items"} in{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: selectedConfig.color }}
                  >
                    {selectedCategory}
                  </Box>
                </>
              )}
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>

          {/* ── Loading spinner ───────────────────────────────────── */}
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 12,
              }}
            >
              <CircularProgress sx={{ color: "#E8420A" }} size={40} />
            </Box>
          )}

          {/* ── Warranty cards grid ───────────────────────────────── */}
          {!loading && displayWarranties.length > 0 && (
            <Grid container spacing={3}>
              {displayWarranties.map((warranty) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={
                    warranty.id ||
                    `${warranty.productName}-${warranty.expiryDate}-${Math.random()}`
                  }
                >
                  <CategoryWarrantyCard warranty={warranty} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* ── Empty state ───────────────────────────────────────── */}
          {!loading && displayWarranties.length === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 12,
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "20px",
                  background: selectedConfig.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.4rem",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.14)",
                  mb: 1,
                }}
              >
                {selectedConfig.emoji}
              </Box>

              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1a1a1a" }}
              >
                {searchQuery
                  ? "No matching warranties"
                  : warranties.length === 0
                    ? "No warranties yet"
                    : `No warranties in ${selectedCategory}`}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#9ca3af",
                  textAlign: "center",
                  maxWidth: 380,
                  lineHeight: 1.6,
                }}
              >
                {searchQuery
                  ? `No warranties match "${searchQuery}". Try adjusting your search.`
                  : warranties.length === 0
                    ? "Add your first warranty by scanning a bill from the dashboard."
                    : `You don't have any warranties in the ${selectedCategory} category yet.`}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Categories;
