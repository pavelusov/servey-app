import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { surveyId, answers } = await request.json();

  try {
    const response = await prisma.response.create({
      data: {
        surveyId: Number(surveyId),
        userId: Number(session.user.id),
        answers: {
          create: Object.entries(answers).map(([questionId, value]) => ({
            questionId: Number(questionId),
            value: Array.isArray(value) ? value.join(', ') : value,
          })),
        },
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error saving survey response:', error);
    return NextResponse.json({ error: 'Failed to save survey response' }, { status: 500 });
  }
}
