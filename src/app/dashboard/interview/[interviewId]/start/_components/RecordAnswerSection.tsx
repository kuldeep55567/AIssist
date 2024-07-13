import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';

const RecordAnswerSection: React.FC = () => {
    const [userAnswer, setUserAnswer] = useState<string>('');

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
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

    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col mt-20 justify-center items-center
            bg-black rounded-lg p-5'>
                <Image src='/webcam.png' height={200} width={200} alt='404'
                    className='absolute' />
                <Webcam
                    mirrored
                    style={{ height: 300, width: '100%', zIndex: 10 }}
                />
            </div>
            <Button variant='outline' className='my-10'
                onClick={isRecording ? stopSpeechToText : startSpeechToText}>
                {isRecording ? <h2>Recording...</h2> : 'Record Answer'}
            </Button>
        </div>
    );
};

export default RecordAnswerSection;
