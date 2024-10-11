'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import { Survey, Question } from '@/types';

export default function SurveyResultsPage({ params }: { params: { id: string } }) {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [results, setResults] = useState<{[key: string]: {[key: string]: number}}>({});

  useEffect(() => {
    const fetchSurveyAndResults = async () => {
      try {
        const surveyResponse = await fetch(`/api/surveys/${params.id}`);
        const resultsResponse = await fetch(`/api/survey-results/${params.id}`);

        if (surveyResponse.ok && resultsResponse.ok) {
          const surveyData = await surveyResponse.json();
          const resultsData = await resultsResponse.json();
          setSurvey(surveyData);
          setResults(resultsData);
        } else {
          console.error('Failed to fetch survey or results');
        }
      } catch (error) {
        console.error('Error fetching survey or results:', error);
      }
    };

    fetchSurveyAndResults();
  }, [params.id]);

  if (!survey) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="caption" component="h1" gutterBottom>
          Результаты опроса:
        </Typography>
        <Typography variant="h4" component="h1" gutterBottom>{survey.title}</Typography>
        <List>
          {survey.questions.map((question: Question) => (
            <Paper key={question.id} elevation={2} sx={{ mb: 2, p: 2 }}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={question.text}
                  secondary={
                    <Box>
                      {Object.entries(results[question.id] || {}).map(([answer, count], index) => (
                        <Typography key={index} variant="body2">
                          {answer}: {count} response(s)
                        </Typography>
                      ))}
                    </Box>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      </Box>
    </Container>
  );
}
