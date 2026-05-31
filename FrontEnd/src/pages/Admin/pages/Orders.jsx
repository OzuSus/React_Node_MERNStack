import React, {useContext, useState} from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PageTitle from "../../../components/Typography/PageTitle";
import OrdersTable from "../../../components/OrdersTable";
import {PurchaseHistoryContext} from "../../../context/PurchaseHistoryContext";

const Orders = () => {
  const {allStatuses} = useContext(PurchaseHistoryContext)
  const [resultsPerPage, setResultPerPage] = useState(10);
  const [filter, setFilter] = useState("All");


  const handleFilter = (filter_name) => {
      setFilter(filter_name);
  };

  return (
    <Box>
      <PageTitle>Orders</PageTitle>

      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" color="text.primary" mb={2}>
        <HomeIcon sx={{ color: "primary.main", mr: 1 }} />
        <NavLink to="/app/dashboard" style={{ marginRight: 8, color: "#6b46c1", textDecoration: "none" }}>
          Dashboard
        </NavLink>
        <Typography variant="body2">{">"}</Typography>
        <Typography variant="body2" sx={{ mx: 1 }}>
          Orders
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mt: 3, mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" color="text.secondary">
              Filter Orders
            </Typography>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="filter-label">Status</InputLabel>
              <Select
                labelId="filter-label"
                value={filter}
                label="Status"
                onChange={(e) => handleFilter(e.target.value)}
              >
                  <MenuItem value="All">All</MenuItem>
                  {allStatuses.map((status) => (
                      <MenuItem key={status.id} value={status.name}>
                          {status.name}
                      </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <TextField
              label="Results on Table"
              type="number"
              value={resultsPerPage}
              onChange={(e) => setResultPerPage(Number(e.target.value))}
              size="small"
              sx={{ width: 150 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <OrdersTable resultsPerPage={resultsPerPage} filter={filter} />
    </Box>
  );
};

export default Orders;
