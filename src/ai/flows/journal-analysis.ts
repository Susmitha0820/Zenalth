'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing journal entries.
 *
 * - analyzeJournalEntry - A function that takes a journal entry and returns an analysis.
 * - JournalAnalysisInput - The input type for the analyzeJournalEntry function.
 * - JournalAnalysisOutput - The return type for the analyzeJournalEntry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JournalAnalysisInputSchema = z.object({
  journalEntry: z.string().describe('The user\'s journal entry text.'),
});
export type JournalAnalysisInput = z.infer<typeof JournalAnalysisInputSchema>;

const JournalAnalysisOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the journal entry.'),
  themes: z.array(z.string()).describe('A list of key themes identified in the entry.'),
  sentiment: z.enum(["Positive", "Negative", "Neutral"]).describe('The overall sentiment of the entry.'),
});
export type JournalAnalysisOutput = z.infer<typeof JournalAnalysisOutputSchema>;

export async function analyzeJournalEntry(input: JournalAnalysisInput): Promise<JournalAnalysisOutput> {
  return journalAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'journalAnalysisPrompt',
  input: {schema: JournalAnalysisInputSchema},
  output: {schema: JournalAnalysisOutputSchema},
  prompt: `You are an expert in psychological text analysis. Please analyze the following journal entry.

Journal Entry:
"{{{journalEntry}}}"

Based on the entry, provide a concise summary, identify up to three key themes (e.g., "Stress at Work," "Relationship Challenges," "Personal Growth"), and determine the overall sentiment (Positive, Negative, or Neutral).`,
});

const journalAnalysisFlow = ai.defineFlow(
  {
    name: 'journalAnalysisFlow',
    inputSchema: JournalAnalysisInputSchema,
    outputSchema: JournalAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
