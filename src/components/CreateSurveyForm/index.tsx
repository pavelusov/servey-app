'use client';

import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, Select, MenuItem, FormControl, InputLabel, Chip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Question, Survey } from '@/types';
import Link from 'next/link';

interface CreateSurveyFormProps {
  onSubmit: (title: string, questions: Question[]) => void;
  initialData?: Survey;
}

export const CreateSurveyForm: React.FC<CreateSurveyFormProps> = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>(initialData?.questions || []);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    text: '',
    type: 'text',
    options: [],
  });
  const [currentOption, setCurrentOption] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setQuestions(initialData.questions);
    }
  }, [initialData]);

  const handleAddQuestion = () => {
    if (currentQuestion.text) {
      setQuestions([...questions, { ...currentQuestion, id: Date.now().toString() }]);
      setCurrentQuestion({ id: '', text: '', type: 'text', options: [] });
      setCurrentOption('');
    }
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleAddOption = () => {
    if (currentOption && (currentQuestion.type === 'multipleChoice' || currentQuestion.type === 'radio')) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...(currentQuestion.options || []), currentOption],
      });
      setCurrentOption('');
    }
  };

  const handleRemoveOption = (option: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options?.filter(o => o !== option) || [],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit', title, questions);
    if (title && questions.length > 0) {
      onSubmit(title, questions);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {initialData ? 'Редактировать опрос' : 'Создать новый опрос'}
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="survey-title"
        label="Название опроса"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {questions.map((q, index) => (
        <Box key={q.id} sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
          <Typography variant="subtitle1">{`Вопрос ${index + 1}: ${q.text} (${q.type})`}</Typography>
          {q.options && q.options.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2">Варианты ответа:</Typography>
              {q.options.map((option, optionIndex) => (
                <Chip key={optionIndex} label={option} sx={{ mr: 1, mt: 1 }} />
              ))}
            </Box>
          )}
          <Button onClick={() => handleRemoveQuestion(q.id)} startIcon={<DeleteIcon />} sx={{ mt: 1 }}>
            Удалить
          </Button>
        </Box>
      ))}
      <Box sx={{ mt: 3 }}>
        <TextField
          margin="normal"
          required={questions.length === 0}
          fullWidth
          id="question-text"
          label="Текст вопроса"
          value={currentQuestion.text}
          onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="question-type-label">Тип вопроса</InputLabel>
          <Select
            labelId="question-type-label"
            id="question-type"
            value={currentQuestion.type}
            label="Тип вопроса"
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value as 'text' | 'multipleChoice' | 'radio', options: [] })}
          >
            <MenuItem value="text">Текстовый ответ</MenuItem>
            <MenuItem value="multipleChoice">Множественный выбор</MenuItem>
            <MenuItem value="radio">Одиночный выбор</MenuItem>
          </Select>
        </FormControl>
        {(currentQuestion.type === 'multipleChoice' || currentQuestion.type === 'radio') && (
          <Box sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              fullWidth
              id="option-text"
              label="Вариант ответа"
              value={currentOption}
              onChange={(e) => setCurrentOption(e.target.value)}
            />
            <Button onClick={handleAddOption} variant="outlined" sx={{ mt: 1 }}>
              Добавить вариант
            </Button>
            <Box sx={{ mt: 1 }}>
              {currentQuestion.options?.map((option, index) => (
                <Chip
                  key={index}
                  label={option}
                  onDelete={() => handleRemoveOption(option)}
                  sx={{ mr: 1, mt: 1 }}
                />
              ))}
            </Box>
          </Box>
        )}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleAddQuestion}
          sx={{ mt: 2 }}
        >
          Добавить вопрос
        </Button>
      </Box>
      <Button
        disabled={questions.length === 0}
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        {initialData ? 'Сохранить изменения' : 'Создать опрос'}
      </Button>
      <Link href="/admin/surveys" passHref>
        <Button component="a" fullWidth variant="outlined" sx={{ mt: 1 }}>
          Вернуться к списку опросов
        </Button>
      </Link>
    </Box>
  );
};
