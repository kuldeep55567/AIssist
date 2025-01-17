import React from 'react';
import { Lightbulb,Volume2 } from 'lucide-react';
// Define the type for a mock interview question
interface MockInterviewQuestion {
    Question: string;
    Answer: string;
}

// Define the props type for the QuestionSection component
interface QuestionSectionProps {
    mockInterviewQuestions: MockInterviewQuestion[];
    activeQuestionIndex: number;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({ mockInterviewQuestions, activeQuestionIndex }) => {
    
    const textToSpeech = (text  : string) => {
        if('speechSynthesis' in window){
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = 'en-US';
            speech.volume = 1;
            speech.rate = 1;
            speech.pitch = 1;
            window.speechSynthesis.speak(speech);
        }else{
            alert('Your browser does not support text to speech');
        
        }
    }
    return mockInterviewQuestions && (
        <div className='p-5 border rounded-lg my-10'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {mockInterviewQuestions.map((questionData, index) => (
                    <h2 key={index}
                        className={`p-2 bg-secondary rounded-full text-xs 
                        md:text-sm text-center cursor-pointer ${activeQuestionIndex === index &&
                            'bg-orange-500 text-white'}`}> Question #{index + 1}
                    </h2>
                ))}
            </div>
            <h2 className='my-5 text-sm md:text-lg'>{mockInterviewQuestions[activeQuestionIndex]?.Question}</h2>
            <Volume2  className= 'cursor-pointer' onClick={()=>textToSpeech(mockInterviewQuestions[activeQuestionIndex]?.Question)}/>
            <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
                <h2 className='flex gap-2 items-center text-blue-500'>
                    <Lightbulb />
                    <strong>Note:</strong>
                </h2>
                <h2 className='text-sm text-blue-500 my-2'>{process.env.NEXT_PUBLIC_NOTE}</h2>
            </div>
        </div>
    );
}

export default QuestionSection;
