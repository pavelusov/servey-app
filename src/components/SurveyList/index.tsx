'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Survey } from '@/types';
import Link from 'next/link';

interface SurveyListProps {
  surveys: Survey[];
  onDelete: (id: string) => void;
}

export const SurveyList: React.FC<SurveyListProps> = ({ surveys, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell align="right">Кол-во вопросов</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {surveys.map((survey) => (
            <TableRow
              key={survey.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {survey.title}
              </TableCell>
              <TableCell align="right">{survey.questions.length}</TableCell>
              <TableCell align="right">
                <Link href={`/admin/surveys/${survey.id}`} passHref>
                  <Button component="a" variant="outlined" sx={{ mr: 1 }}>Просмотр</Button>
                </Link>
                <Link href={`/admin/surveys/${survey.id}/edit`} passHref>
                  <Button component="a" variant="outlined" sx={{ mr: 1 }}>Редактировать</Button>
                </Link>
                <Button variant="outlined" color="error" onClick={() => onDelete(survey.id)}>
                  Удалить
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
