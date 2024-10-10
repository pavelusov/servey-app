import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {Survey} from "@/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const survey: Survey = await prisma.survey.findUnique({
      where: { id: Number(id) },
      include: {
        questions: {
          select: {
            id: true,
            text: true,
            type: true,
            options: true,
          },
        },
      },
    });

    if (!survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 });
    }

    // Преобразуем options из JSON строки обратно в массив
    const formattedSurvey = {
      ...survey,
      questions: survey.questions.map(question => ({
        ...question,
        options: question.options ? JSON.parse(question.options) : [],
      })),
    };

    return NextResponse.json(formattedSurvey);
  } catch (error) {
    console.error('Error fetching survey:', error);
    return NextResponse.json({ error: 'Failed to fetch survey' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = Number(params.id);
  const { title, questions } = await request.json();

  try {
    // Используем транзакцию для обеспечения целостности данных
    const updatedSurvey = await prisma.$transaction(async (tx) => {
      // Обновляем заголовок опроса
      const survey = await tx.survey.update({
        where: { id },
        data: { title },
      });

      // Удаляем существующие вопросы
      await tx.question.deleteMany({
        where: { surveyId: id },
      });

      // Создаем новые вопросы
      for (const q of questions) {
        await tx.question.create({
          data: {
            surveyId: id,
            text: q.text,
            type: q.type,
            options: q.options ? JSON.stringify(q.options) : null,
          },
        });
      }

      // Получаем обновленные вопросы
      const updatedQuestions = await tx.question.findMany({
        where: { surveyId: id },
      });

      return { ...survey, questions: updatedQuestions };
    });

    return NextResponse.json(updatedSurvey);
  } catch (error) {
    console.error('Error updating survey:', error);
    return NextResponse.json({ error: 'Failed to update survey', details: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = Number(params.id);

  try {
    // Используем транзакцию для обеспечения целостности данных при удалении
    await prisma.$transaction(async (tx) => {
      // Сначала удаляем все ответы, связанные с вопросами этого опроса
      await tx.answer.deleteMany({
        where: {
          question: {
            surveyId: id
          }
        }
      });

      // Затем удаляем все ответы на опрос
      await tx.response.deleteMany({
        where: {
          surveyId: id
        }
      });

      // Удаляем все вопросы, связанные с опросом
      await tx.question.deleteMany({
        where: {
          surveyId: id
        }
      });

      // Наконец, удаляем сам опрос
      await tx.survey.delete({
        where: { id }
      });
    });

    return NextResponse.json({ message: 'Survey and all related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting survey:', error);
    return NextResponse.json({ error: 'Failed to delete survey', details: (error as Error).message }, { status: 500 });
  }
}