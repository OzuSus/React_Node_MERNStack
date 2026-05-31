import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableFooter, Avatar, Pagination, Box, Button, Typography
} from "@mui/material";
import AddUserModal from "../model/AddUserModal";
import {api, getAssetUrl} from "../../../utils/api";

const UsersTable = ({ resultsPerPage = 10, onUserChange }) => {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/regular");
      const data = Array.isArray(response.data) ? response.data : response.data.users || [];
      setUsers(data.map(user => ({...user, id: user.id || user._id})));
      setTotalUsers(data.length);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setIsModalOpen(true);
  };

  const handleUserAdded = () => {
    fetchUsers(); // Refresh the user list after adding
    setIsModalOpen(false);
    if (onUserChange) {
      onUserChange();
    }
  };

  // Table cell styles
  const tableCellStyle = {
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    maxWidth: '200px', // Adjust this value as needed
    padding: '12px 16px',
    borderBottom: '1px solid rgba(224, 224, 224, 1)'
  };

  // Table header styles
  const tableHeaderStyle = {
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    position: 'sticky',
    top: 0,
    zIndex: 1,
    ...tableCellStyle
  };

  return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Danh sách người dùng</Typography>
          <Button
              variant="contained"
              color="primary"
              onClick={handleAddUser}
          >
            Thêm User
          </Button>
        </Box>

        <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeaderStyle}>Avatar</TableCell>
                <TableCell sx={{ ...tableHeaderStyle, width: '15%' }}>Username</TableCell>
                <TableCell sx={{ ...tableHeaderStyle, width: '20%' }}>Email</TableCell>
                <TableCell sx={{ ...tableHeaderStyle, width: '15%' }}>Fullname</TableCell>
                <TableCell sx={{ ...tableHeaderStyle, width: '20%' }}>Address</TableCell>
                <TableCell sx={{ ...tableHeaderStyle, width: '15%' }}>Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                  .slice((page - 1) * resultsPerPage, page * resultsPerPage)
                  .map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell sx={tableCellStyle}>
                          <Avatar

                               src={getAssetUrl(user?.avatar, "/assets/userDefautAvatar.jpg")}
                               alt="Avatar"
                          />
                        </TableCell>
                        <TableCell sx={tableCellStyle}>{user.username}</TableCell>
                        <TableCell sx={tableCellStyle}>{user.email}</TableCell>
                        <TableCell sx={tableCellStyle}>{user.fullname}</TableCell>
                        <TableCell sx={tableCellStyle}>{user.address}</TableCell>
                        <TableCell sx={tableCellStyle}>{user.phone}</TableCell>
                      </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>

        {totalUsers > resultsPerPage && (
            <Pagination
                count={Math.ceil(totalUsers / resultsPerPage)}
                page={page}
                onChange={(e, p) => setPage(p)}
                sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
            />
        )}

        <AddUserModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onUserAdded={handleUserAdded}
        />
      </Box>
  );
};

export default UsersTable;
