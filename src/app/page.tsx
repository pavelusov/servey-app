'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Typography, Box, Button, List, ListItem, ListItemText, Paper } from '@mui/material';
import Link from 'next/link';
import { Survey } from '@/types';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('/api/surveys');
        if (response.ok) {
          const data = await response.json();
          setSurveys(data);
        } else {
          console.error('Failed to fetch surveys');
        }
      } catch (error) {
        console.error('Error fetching surveys:', error);
      }
    };

    fetchSurveys();
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Опросы
        </Typography>
        {status === 'authenticated' ? (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Приветсвуем, {session.user?.name}! Пройдите опросы:
            </Typography>
            <List>
              {surveys.map((survey) => (
                <Paper key={survey.id} elevation={2} sx={{ mb: 2 }}>
                  <ListItem
                    secondaryAction={
                      <Button component={Link} href={`/surveys/${survey.id}`} variant="contained" color="primary">
                        Пройти опрос
                      </Button>
                    }
                  >
                    <ListItemText primary={survey.title} />
                  </ListItem>
                </Paper>
              ))}
            </List>
          </>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Пожалуйста войдите или зарегистрируйтесь, чтобы пройти опрос
            </Typography>
            <Button component={Link} href="/login" variant="contained" color="primary" sx={{ mr: 2 }}>
              Вход
            </Button>
            <Button component={Link} href="/signup" variant="outlined" color="primary">
              Регистрация
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}
