"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../../../../utils/db';
import { eq } from 'drizzle-orm';
import { MockInterview } from '../../../../../utils/schema';
import { WebcamIcon, Lightbulb } from 'lucide-react';
import Webcam from 'react-webcam';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// Define the type for the params prop
interface InterviewProps {
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

const Interview: React.FC<InterviewProps> = ({ params }) => {
    const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);

    useEffect(() => {
        console.log(params);
        getInterviewDetails();
    }, [params]);

    const getInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, params.interviewId));
        setInterviewData(result[0]);
    };

    return (
        <div className='my-10'>
            <h1 className='font-bold text-2xl mt-4'>Let's Get Started</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <div className='flex flex-col my-5 gap-5 p-5 rounded-lg border'>
                    <div className='flex flex-col  p-5 rounded-lg border gap-5'>
                        <h2 className='text-xl'><strong>Job Role/Job Position : </strong>{interviewData?.jobPosition}</h2>
                        <h2 className='text-xl'><strong>Job Description/Tech Stack : </strong>{interviewData?.jobDesc}</h2>
                        <h2 className='text-xl'><strong>Years of Experience : </strong>{interviewData?.jobExperience}</h2>
                    </div>
                    <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                        <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb /><span><strong>Information</strong></span></h2>
                        <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                        <h2></h2>
                    </div>
                </div>
                <div>
                    {webCamEnabled ? <Webcam
                        mirrored
                        onUserMedia={() => setWebCamEnabled(true)}
                        onUserMediaError={() => setWebCamEnabled(false)}
                        style={{ height: 300, width: 300 }} />
                        :
                        <>
                            <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
                            <Button variant='ghost' className='w-full' onClick={() => setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
                        </>
                    }
                </div>
            </div>
            <div className='flex justify-end items-end'>
                <Link href={`/dashboard/interview/${params.interviewId}/start`}>
                <Button className=''>Start Interview</Button>
                </Link>
            </div>
        </div>
    );
};

export default Interview;
