import React from 'react';
import AdminNavigation from '@/components/AdminNavigation';
import { Box } from '@mui/material';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      <AdminNavigation />
      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}