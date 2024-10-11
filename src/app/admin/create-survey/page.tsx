'use client';

import React from 'react';
import { Container } from '@mui/material';
import { CreateSurveyForm } from '@/components/CreateSurveyForm';
import { useRouter } from 'next/navigation';
import { Question } from '@/types';

export default function CreateSurveyPage() {
  const router = useRouter();

  const handleCreateSurvey = async (title: string, questions: Question[]) => {
    console.log('handleCreateSurvey', title, questions);
    try {
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, questions }),
      });

      if (response.ok) {
        router.push('/admin/surveys'); // Предполагаем, что у нас есть страница со списком опросов
      } else {
        // Обработка ошибки
        console.error('Failed to create survey');
      }
    } catch (error) {
      console.error('Error creating survey:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <CreateSurveyForm onSubmit={handleCreateSurvey} />
    </Container>
  );
}
