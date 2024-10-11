'use client';

import React from 'react';
import { Container, Typography, Grid, Paper, Button, Box } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session?.user?.isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  const adminLinks = [
    { title: 'Управление опросами', href: '/admin/surveys', description: 'Создание, редактирование и удаление опросов' },
    { title: 'Управление пользователями', href: '/admin/users', description: 'Просмотр и управление учетными записями пользователей' },
    { title: 'Аналитика', href: '/admin/analytics', description: 'Просмотр статистики и отчетов по опросам' },
    { title: 'Настройки', href: '/admin/settings', description: 'Настройки приложения и системные параметры' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Административная панель
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Добро пожаловать, {session.user.name}! Выберите раздел для управления:
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {adminLinks.map((link, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 200 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {link.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                  {link.description}
                </Typography>
                <Link href={link.href} passHref>
                  <Button variant="contained" color="primary" fullWidth>
                    Перейти
                  </Button>
                </Link>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminDashboard;