import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { Mic, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';
import { chatSession } from '../../../../../../utils/GeminiAI';
import { db } from '../../../../../../utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { UserAnswer } from '../../../../../../utils/schema';

// Define the types for the props and interview data
interface MockInterviewQuestion {
    Question: string;
    Answer: string;
}

interface RecordAnswerSectionProps {
    mockInterviewQuestions: MockInterviewQuestion[];
    activeQuestionIndex: number;
    interviewData: InterviewData; // Add interviewData to props
}

interface InterviewData {
    mockId: string;
    jsonMockResp: string;
    jobPosition: string;
    jobDesc: string;
    jobExperience: string;
    createdBy: string;
    createdAt: string | null;
}

const RecordAnswerSection: React.FC<RecordAnswerSectionProps> = ({ mockInterviewQuestions, activeQuestionIndex, interviewData }) => {
    const [userAnswer, setUserAnswer] = useState<string>('');
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    const {
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        results.forEach((result) => {
            if (typeof result !== 'string' && 'transcript' in result) {
                setUserAnswer((prevAns) => prevAns + result.transcript);
            }
        });
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer?.length > 10) {
            UpdateUserAnswer();
        }
    }, [userAnswer]);
    const StartStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText();

        } else {
            startSpeechToText();
        }
    }
    const UpdateUserAnswer = async () => {
        setLoading(true);
        const feedbackPrompt = `Question : ${mockInterviewQuestions[activeQuestionIndex]?.Question}
        Answer: ${userAnswer}. Depending on question and user's answer for given interview question
        please give us rating and feedback as area of improvement, if any, in just 3 to 5 lines to improve it in
        JSON format with rating field and feedback field. `;
        const result = await chatSession.sendMessage(feedbackPrompt);
        const mockJsonResp = (await result.response.text()).replace('```json', '').replace('```', '');
        const JSONRes = JSON.parse(mockJsonResp);

        const resp = await db.insert(UserAnswer)
            .values({
                mockIdRef: interviewData?.mockId,
                question: mockInterviewQuestions[activeQuestionIndex]?.Question,
                correctAns: mockInterviewQuestions[activeQuestionIndex]?.Answer,
                userAns: userAnswer,
                rating: JSONRes?.rating,
                feedback: JSONRes?.feedback,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
            })

        if (resp) {
            toast.success('Answer saved successfully!');
            setUserAnswer('');
            setResults([]);
        }
        setResults([]);
        setLoading(false);
    }
    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
                <Image src='/webcam.png' height={200} width={200} alt='404' className='absolute' />
                <Webcam mirrored style={{ height: 300, width: '100%', zIndex: 10 }} />
            </div>
            <Button disabled={loading} variant='outline' className='my-10' onClick={StartStopRecording}>
                {isRecording ? <h2
                    className='text-red-600 animate-pulse flex gap-2 items-center'>
                    <StopCircle />Stop Recording</h2> :
                    <h2 className='text-blue-600 animate-pulse flex gap-2 items-center'>
                        <Mic />Start Recording</h2>}
            </Button>
        </div>
    );
};

export default RecordAnswerSection;
