import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

const AdminNavigation = () => {

  const navItems = [
    { title: 'Главная', href: '/admin' },
    { title: 'Опросы', href: '/admin/surveys' },
    { title: 'Пользователи', href: '/admin/users' },
    { title: 'Аналитика', href: '/admin/analytics' },
    { title: 'Настройки', href: '/admin/settings' },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Админ панель
        </Typography>
        <Box>
          {navItems.map((item, index) => (
            <Link key={index} href={item.href} passHref>
              <Button color="inherit" component="a">
                {item.title}
              </Button>
            </Link>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavigation;