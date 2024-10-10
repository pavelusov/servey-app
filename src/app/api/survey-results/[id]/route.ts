import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
    const answers = await prisma.answer.findMany({
      where: {
        question: {
          surveyId: Number(id)
        }
      },
      include: {
        question: true
      }
    });

    const results: {[key: string]: {[key: string]: number}} = {};

    answers.forEach(answer => {
      if (!results[answer.questionId]) {
        results[answer.questionId] = {};
      }
      if (!results[answer.questionId][answer.value]) {
        results[answer.questionId][answer.value] = 0;
      }
      results[answer.questionId][answer.value]++;
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching survey results:', error);
    return NextResponse.json({ error: 'Failed to fetch survey results' }, { status: 500 });
  }
}
