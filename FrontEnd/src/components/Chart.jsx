import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer} from "recharts";
import {useContext, useEffect, useState} from "react";
import {Box, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {OrderContext} from "../context/OrderContext";

const COLORS = [
    "#42a5f5", "#66bb6a", "#ffca28", "#ef5350", "#ab47bc", "#29b6f6", "#ffa726", "#26a69a"
];
export const MonthlyRevenueChart = () => {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [data, setData] = useState([]);
    const { getMonthlyRevenue } = useContext(OrderContext);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getMonthlyRevenue(year);
            setData(result);
        };
        fetchData();
    }, [year]);

    const handleChange = (event) => {
        setYear(event.target.value);
    };
    const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="primary">Doanh thu theo năm</Typography>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Năm</InputLabel>
                    <Select value={year} label="Năm" onChange={handleChange}>
                        {yearOptions.map((y) => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 5 }} barSize={40}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#42a5f5" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#478ed1" stopOpacity={0.7} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#8884d8" />
                    <YAxis stroke="#8884d8" />
                    <Tooltip contentStyle={{backgroundColor: '#ffffff', borderRadius: 10, borderColor: '#ccc', fontSize: 14}} />
                    <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]}/>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};
export const CategoryPieChart = () => {
    const [data, setData] = useState([]);
    const {getCategoryRevenue } = useContext(OrderContext);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getCategoryRevenue();
            setData(result);
        };
        fetchData();
    }, []);

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={15}>
                {(percent * 100).toFixed(0)}%
            </text>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={465}>
            <PieChart>
                <Pie data={data} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={150} labelLine={false} label={renderCustomizedLabel}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2}/>
                    ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: 10, borderColor: '#ccc' }} labelStyle={{ color: '#333', fontWeight: 'bold', fontSize: '20px' }}/>
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
        </ResponsiveContainer>
    );
};