'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Checkbox, TextField } from '@mui/material';
import { Survey, Question } from '@/types';

export default function TakeSurveyPage({ params }: { params: { id: string } }) {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<{[key: string]: string | string[]}>({});
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
      }
    };

    fetchSurvey();
  }, [params.id]);

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surveyId: params.id, answers }),
      });
      if (response.ok) {
        router.push(`/thank-you?surveyId=${params.id}`);
      } else {
        console.error('Failed to submit survey');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };

  if (!survey) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box component="form" onSubmit={handleSubmit} sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {survey.title}
        </Typography>
        {survey.questions.map((question: Question) => (
          <Box key={question.id} sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <FormLabel>{question.text}</FormLabel>
              {question.type === 'text' && (
                <TextField
                  fullWidth
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
              )}
              {question.type === 'radio' && (
                <RadioGroup
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                >
                  {question?.options && question.options.map((option: string, index: number) => (
                    <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                  ))}
                </RadioGroup>
              )}
              {question.type === 'multipleChoice' && (
                <Box>
                  {question?.options && question.options.map((option: string, index: number) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={(answers[question.id] as string[] || []).includes(option)}
                          onChange={(e) => {
                            const currentAnswers = answers[question.id] as string[] || [];
                            const newAnswers = e.target.checked
                              ? [...currentAnswers, option]
                              : currentAnswers.filter(a => a !== option);
                            handleAnswerChange(question.id, newAnswers);
                          }}
                        />
                      }
                      label={option}
                    />
                  ))}
                </Box>
              )}
            </FormControl>
          </Box>
        ))}
        <Button type="submit" variant="contained" color="primary">
          Отправить
        </Button>
      </Box>
    </Container>
  );
}
