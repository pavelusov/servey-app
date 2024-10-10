'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Container, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const surveyId = searchParams.get('surveyId');

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Спасибо!
        </Typography>
        <Typography variant="body1">
          Ваш ответ был записан. Мы ценим ваше участие в этом опросе.
        </Typography>
        {surveyId && (
          <Button
            component={Link}
            href={`/survey-results/${surveyId}`}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Посмотреть результаты
          </Button>
        )}
        <Button
          component={Link}
          href="/"
          variant="outlined"
          color="primary"
          sx={{ mt: 2, ml: 2 }}
        >
         На главную
        </Button>
      </Box>
    </Container>
  );
}
