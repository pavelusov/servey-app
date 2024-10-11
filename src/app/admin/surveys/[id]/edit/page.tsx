'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { CreateSurveyForm } from '@/components/CreateSurveyForm';
import { Survey, Question } from '@/types';

export default function EditSurveyPage({ params }: { params: { id: string } }) {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`/api/surveys/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setSurvey(data);
        } else {
          console.error('Failed to fetch survey');
        }
      } catch (error) {
        console.error('Error fetching survey:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [params.id]);

  const handleSubmit = async (title: string, questions: Question[]) => {
    console.log('PUT SUBMIT')
    try {
      const response = await fetch(`/api/surveys/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, questions }),
      });

      if (response.ok) {
        router.push('/admin/surveys');
      } else {
        console.error('Failed to update survey');
      }
    } catch (error) {
      console.error('Error updating survey:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!survey) {
    return (
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Опрос не найден
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <CreateSurveyForm onSubmit={handleSubmit} initialData={survey} />
    </Container>
  );
}
