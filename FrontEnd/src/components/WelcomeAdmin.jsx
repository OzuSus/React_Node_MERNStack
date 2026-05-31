import { Box, Typography, Paper, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';

const WelcomeAdmin = () => {
    const navigate = useNavigate();

    return (
        <Paper
            elevation={6}
            sx={{
                p: 6,
                borderRadius: 4,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #e0f7fa, #ffe0f0)',
                boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
                maxWidth: 800,
                mx: 'auto',
                mt: 6,
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                <DashboardIcon sx={{ fontSize: 80, color: '#0288d1' }} />
            </Box>

            <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ color: '#37474f', textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}
            >
                Chào mừng đến với Trang Quản Trị
            </Typography>

            <Typography
                variant="h6"
                sx={{
                    color: '#555',
                    mb: 4,
                    fontWeight: 400,
                    maxWidth: 600,
                    mx: 'auto',
                    lineHeight: 1.6,
                }}
            >
                Sử dụng thanh bên trái để quản lý đơn hàng, sản phẩm, người dùng và các chức năng khác.
            </Typography>

            <Button
                variant="contained"
                size="large"
                sx={{
                    px: 5,
                    py: 1.5,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #42a5f5, #7e57c2)',
                    color: 'white',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1rem',
                    transition: '0.3s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #1e88e5, #5e35b1)',
                        transform: 'scale(1.03)',
                    },
                }}
                onClick={() => navigate("/admin/dashboard")}
            >
                👉 Tới Dashboard ngay
            </Button>
        </Paper>
    );
};

export default WelcomeAdmin;
