'use client';
import React, { useEffect } from 'react';
import { db } from '../../../../../utils/db';
import { UserAnswer } from '../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Define the type for the params prop
interface FeedbackProps {
    params: {
        interviewId: string;
    };
}

// Define the type for feedback items
interface FeedbackItem {
    id: number;
    mockIdRef: string;
    userId: string;
    question: string;
    correctAns: string;
    userAns: string;
    rating: string;
    feedback: string;
    userEmail?: string;
    createdAt?: string;
}

const Feedback: React.FC<FeedbackProps> = ({ params }) => {
    const [feedback, setFeedback] = React.useState<FeedbackItem[]>([]);
    const router = useRouter();

    useEffect(() => {
        getFeedback();
    }, []);

    const getFeedback = async () => {
        const result: any = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, params.interviewId))
            .orderBy(UserAnswer.id);
        console.log(result);
        setFeedback(result);
    };

    return (
        <div className='flex flex-col items-center p-10'>
            <div className='w-full max-w-6xl'> {/* Set a max width for responsiveness */}
                {feedback?.length === 0 ? (
                    <h2 className='text-red-500 font-bold text-3xl mt-10'>No feedback available</h2>
                ) : (
                    <>
                       <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-green-500'>Congratulations!</h2>
                        <h2 className='font-bold text-2xl mt-5'>Here is your interview feedback</h2>
                        <h2 className='text-primary text-lg my-3'>Your overall interview rating: <strong>3/10</strong></h2>
                        <h2>Find below the interview questions with correct answers, your answers, and feedback for improvement.</h2>
                        {feedback.map((item) => (
                            <Collapsible key={item.id} className='mt-7'>
                                <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full'>
                                    {item.question} <ChevronsUpDown className='h-5 w-5' />
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className='flex flex-col gap-2'>
                                        <h2 className="text-red-500 p-2 border rounded-lg"><strong>Rating:</strong> {item.rating}</h2>
                                        <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer:</strong> {item.userAns}</h2>
                                        <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer:</strong> {item.correctAns}</h2>
                                        <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-blue-900'><strong>Feedback:</strong> {item.feedback}</h2>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                    </>
                )}

                <Button onClick={() => router.replace('/dashboard')} className='mt-5'>Go Home</Button>
            </div>
        </div>
    );
};

export default Feedback;
