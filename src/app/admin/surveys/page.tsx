'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { SurveyList } from '@/components/SurveyList';
import { Survey } from '@/types';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.isAdmin) {
      fetchSurveys();
    }
  }, [session, status, router]);

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

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот опрос?')) {
      try {
        const response = await fetch(`/api/surveys/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setSurveys(surveys.filter(survey => survey.id !== id));
        } else {
          console.error('Failed to delete survey');
        }
      } catch (error) {
        console.error('Error deleting survey:', error);
      }
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session?.user?.isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Список опросов
        </Typography>
        <Link href="/admin/create-survey" passHref>
          <Button component="a" variant="contained" sx={{ mb: 2 }}>
            Создать новый опрос
          </Button>
        </Link>
        <SurveyList surveys={surveys} onDelete={handleDelete} />
      </Box>
    </Container>
  );
}
