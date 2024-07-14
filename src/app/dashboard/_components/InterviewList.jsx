'use client'
import React, { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { db } from '../../../utils/db';
import { MockInterview } from '../../../utils/schema';
import { desc, eq } from 'drizzle-orm';
import InterviewCard from './InterviewCard';
function InterviewList() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = React.useState([])
    useEffect(() => {
        user && GetInterviewList()
    }, [user])
    const GetInterviewList = async () => {
        const result = await db.select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user?.primaryEmailAddress.emailAddress))
            .orderBy(desc(MockInterview.createdAt))
        setInterviewList(result)
    }

    return (
        <div>
            <h1 className='font-medium text-xl'>Previous Mock Interview</h1>
            <div className='grid grid-cols-1
             md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
                {interviewList && interviewList.map((interview, index) => (
                    <InterviewCard key={index} interview={interview} />
                ))}
            </div>
        </div>
    )
}

export default InterviewList
