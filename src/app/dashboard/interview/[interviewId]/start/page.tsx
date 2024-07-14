"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../../../../utils/db';
import { eq } from 'drizzle-orm';
import { MockInterview } from '../../../../../utils/schema';
import { Button } from '@/components/ui/button';
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import Link from 'next/link';

// Define the type for the params prop
interface StartInterviewProps {
    params: {
        interviewId: string;
    };
}

// Define the type for the interview data
interface InterviewData {
    mockId: string;
    jsonMockResp: string;
    jobPosition: string;
    jobDesc: string;
    jobExperience: string;
    createdBy: string;
    createdAt: string | null;
}

// Define the type for the mock interview questions
interface MockInterviewQuestion {
    Question: string;
    Answer: string;
}

const StartInterview: React.FC<StartInterviewProps> = ({ params }) => {
    const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState<MockInterviewQuestion[]>([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

    useEffect(() => {
        getInterviewDetails();
    }, [params]);

    const getInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewId));

        if (result.length > 0) {
            console.log(result[0]);
            const cleanJsonString = result[0].jsonMockResp
                .replace(/`/g, '') // Remove backticks
                .trim(); // Trim whitespace
            const jsonMockResp = JSON.parse(cleanJsonString);
            console.log(jsonMockResp);

            setMockInterviewQuestions(jsonMockResp);
            setInterviewData(result[0]);
        } else {
            console.log('Interview not found');
        }
    };

    return (
        <div className='max-w-6xl mx-auto p-5'> {/* Added wrapper for consistent width */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <QuestionSection
                    mockInterviewQuestions={mockInterviewQuestions}
                    activeQuestionIndex={activeQuestionIndex} />
                {interviewData && (
                    <RecordAnswerSection
                        mockInterviewQuestions={mockInterviewQuestions}
                        activeQuestionIndex={activeQuestionIndex}
                        interviewData={interviewData} />
                )}
            </div>
            <div className='flex justify-end gap-6 mt-5'>
                {activeQuestionIndex > 0 &&
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}
                {activeQuestionIndex !== mockInterviewQuestions?.length - 1 &&
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>}
                {activeQuestionIndex === mockInterviewQuestions?.length - 1 &&
                    <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
                        <Button>End Interview</Button>
                    </Link>
                }
            </div>
        </div>
    );
};

export default StartInterview;
