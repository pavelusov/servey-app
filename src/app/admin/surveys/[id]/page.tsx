'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Chip, Button } from '@mui/material';
import { Survey, Question } from '@/types';

export default function AdminSurveyViewPage({ params }: { params: { id: string } }) {
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

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!survey) {
    return <Typography>Survey not found</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {survey.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Created: {new Date(survey.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Last Updated: {new Date(survey.updatedAt).toLocaleString()}
        </Typography>
        <List>
          {survey.questions.map((question: Question, index: number) => (
            <Paper key={question.id} elevation={2} sx={{ mb: 2, p: 2 }}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`Вопрос ${index + 1}: ${question.text}`}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        Type: {question.type}
                      </Typography>
                      {question.options && (
                        <Box sx={{ mt: 1 }}>
                          {question.options.map((option: string, optionIndex: number) => (
                            <Chip key={optionIndex} label={option} sx={{ mr: 1, mb: 1 }} />
                          ))}
                        </Box>
                      )}
                    </>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="primary" onClick={() => router.push(`/admin/surveys/${params.id}/edit`)}>
            Редактировать
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => router.push('/admin/surveys')}>
            Вернуться к опросам
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
