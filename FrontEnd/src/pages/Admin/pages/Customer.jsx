import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Box, Grid, Card, CardContent, Button,FormControl,Select, MenuItem } from "@mui/material";

import PageTitle from "../../../components/Typography/PageTitle";
import ChartCard from "../../../components/Chart/ChartCard";
import ChartLegend from "../../../components/Chart/ChartLegend";
import UsersTable from "../components/UsersTable";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Customers = () => {
  const [yearlyData, setYearlyData] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const fetchGrowthData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users/regular/monthly-stats");
      const groupedByYear = {};

      Object.entries(response.data).forEach(([key, count]) => {
        const [year, month] = key.split("-");
        if (!groupedByYear[year]) groupedByYear[year] = [];
        groupedByYear[year].push({ month: `Tháng ${month}`, count });
      });

      Object.keys(groupedByYear).forEach(year => {
        groupedByYear[year].sort((a, b) => {
          const aMonth = parseInt(a.month.split(" ")[1]);
          const bMonth = parseInt(b.month.split(" ")[1]);
          return aMonth - bMonth;
        });
      });

      setYearlyData(groupedByYear);
    } catch (error) {
      console.error("Error fetching growth data:", error);
    }
  };

  useEffect(() => {
    fetchGrowthData();
  }, [refreshTrigger]);

  const currentData = yearlyData[selectedYear] || [];

  const chartData = {
    labels: currentData.map(item => item.month),
    datasets: [
      {
        label: 'Số lượng người dùng',
        data: currentData.map(item => item.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Tăng trưởng người dùng - Năm ${selectedYear}` },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  };

  const availableYears = Object.keys(yearlyData).sort();
  const currentYearIndex = availableYears.indexOf(String(selectedYear));

  const handlePrevYear = () => {
    if (currentYearIndex > 0) {
      setSelectedYear(Number(availableYears[currentYearIndex - 1]));
    }
  };

  const handleNextYear = () => {
    if (currentYearIndex < availableYears.length - 1) {
      setSelectedYear(Number(availableYears[currentYearIndex + 1]));
    }
  };

  return (
      <Box sx={{ p: 3 }}>
        <PageTitle>Quản lý Khách hàng</PageTitle>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Button variant="outlined" onClick={handlePrevYear} disabled={currentYearIndex <= 0}>
                    Năm trước
                  </Button>
                  <FormControl size="small">
                    <Select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                      {availableYears.map((year) => (
                          <MenuItem key={year} value={year}>
                            Năm {year}
                          </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button variant="outlined" onClick={handleNextYear} disabled={currentYearIndex >= availableYears.length - 1}>
                    Năm sau
                  </Button>
                </Box>

                <ChartCard title="Tăng trưởng người dùng">
                  <Line options={chartOptions} data={chartData} />
                  <ChartLegend legends={[{ title: 'Người dùng mới', color: 'rgb(75, 192, 192)' }]} />
                </ChartCard>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <UsersTable resultsPerPage={10}
                    onUserChange={() => setRefreshTrigger(prev => prev + 1)}/>
      </Box>
  );
};

export default Customers;
