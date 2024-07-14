import { serial, varchar, text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

// Define MockInterview table
export const MockInterview = pgTable('mockInterview', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt'),
    mockId: varchar('mockId').notNull(),
});

// Define UserAnswer table
export const UserAnswer = pgTable('userAnswer', {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockId').notNull(),
    question: varchar('question').notNull(),
    correctAns: text('answer').notNull(),
    userAns: text('userAns').notNull(),
    rating: varchar('rating').notNull(),
    feedback: text('feedback').notNull(),
    userEmail: varchar('userEmail'),
    createdAt: varchar('createdAt'),
});
