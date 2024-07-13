"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../../../../../utils/db';
import { eq } from 'drizzle-orm';
import { MockInterview } from '../../../../../../utils/schema';
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
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
            const jsonMockResp = JSON.parse(result[0].jsonMockResp);
            console.log(jsonMockResp);

            setMockInterviewQuestions(jsonMockResp);
            setInterviewData(result[0]);
        } else {
            console.log('Interview not found');
        }
    };

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <QuestionSection mockInterviewQuestions={mockInterviewQuestions}
                    activeQuestionIndex={activeQuestionIndex} />
                <RecordAnswerSection />
            </div>
        </div>
    );
};

export default StartInterview;
