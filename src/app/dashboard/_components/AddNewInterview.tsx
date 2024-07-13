"use client";
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { Input } from "@/components/ui/input";
import { chatSession } from '../../../../utils/GeminiAI';
import { LoaderCircle } from 'lucide-react';
import { MockInterview } from '../../../../utils/schema';
import { db } from '../../../../utils/db';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const AddNewInterview: React.FC = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [jobPosition, setJobPosition] = useState<string>('');
    const [jobDesc, setJobDesc] = useState<string>('');
    const [jobExperience, setJobExperience] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [jsonResponse, setJsonResponse] = useState<any>([]);
    const router = useRouter();
    const { user } = useUser();

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}
        Depending upon the Job Position, Job Description and Years of Experience, give us ${process.env.NEXT_PUBLIC_INTERVIEW_Q_COUNT}
         interview questions along with Answers in JSON format, Give Question and Answer as fields in JSON`;

        try {
            const result = await chatSession.sendMessage(InputPrompt);
            const responseText = result.response.text();
            const mockResult = responseText.replace('```json', '').replace('```', '');
            setJsonResponse(mockResult);

            if (mockResult) {
                const resp = await db.insert(MockInterview)
                    .values({
                        mockId: uuidv4(),
                        jsonMockResp: mockResult,
                        jobPosition: jobPosition,
                        jobDesc: jobDesc,
                        jobExperience: jobExperience,
                        createdBy: user?.primaryEmailAddress?.emailAddress ?? '',
                        createdAt: moment().format('DD-MM-YYYY HH:mm:ss')
                    })
                    .returning({ mockId: MockInterview.mockId });

                if (resp.length > 0) {
                    setOpenDialog(false);
                    router.push(`/dashboard/interview/${resp[0].mockId}`);
                } else {
                    console.log("Error in inserting");
                }
            }
        } catch (error: any) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='p-10 border rounded-lg bg-secondary
                hover:scale-105 hover:shadow-md cursor-pointer transition-all'>
                <h2 className='text-lg text-center'
                    onClick={() => setOpenDialog(true)}>+ Add New</h2>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>Tell us more about your job interview</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                                <div>
                                    <h2>Add Details about your job position/role, Job description and years of experience</h2>
                                    <div className='mt-7 my-2'>
                                        <label>Job role/Job Position</label>
                                        <Input
                                            placeholder='Ex. Full Stack Developer'
                                            required
                                            onChange={(event) => setJobPosition(event.target.value)}
                                        />
                                    </div>
                                    <div className="my-3">
                                        <label>Job Description/ Tech Stack (In Short)</label>
                                        <Textarea
                                            placeholder='Ex. React, Python, NodeJs'
                                            required
                                            onChange={(event) => setJobDesc(event.target.value)}
                                        />
                                    </div>
                                    <div className='my-3'>
                                        <label>Years of experience</label>
                                        <Input
                                            placeholder='Ex. 5'
                                            type='number'
                                            required
                                            onChange={(event) => setJobExperience(event.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='flex gap-5 justify-end'>
                                    <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <LoaderCircle className='animate-spin' />
                                                Generating from AI
                                            </>
                                        ) : (
                                            'Start Interview'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddNewInterview;
