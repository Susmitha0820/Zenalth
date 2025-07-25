
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
  themes: z
    .array(
      z.object({
        theme: z
          .string()
          .describe('A key theme identified in the journal entry.'),
        solution: z
          .string()
          .describe(
            'A gentle and constructive suggestion or solution related to the theme.'
          ),
      })
    )
    .describe(
      'A list of key themes identified in the entry, each with a corresponding solution.'
    ),
  sentiment: z
    .enum(['Positive', 'Negative', 'Neutral'])
    .describe('The overall sentiment of the entry.'),
  positiveStatement: z
    .string()
    .describe(
      'An overall positive and encouraging statement for the user.'
    ),
});
export type JournalAnalysisOutput = z.infer<typeof JournalAnalysisOutputSchema>;

export async function analyzeJournalEntry(input: JournalAnalysisInput): Promise<JournalAnalysisOutput> {
  return journalAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'journalAnalysisPrompt',
  input: {schema: JournalAnalysisInputSchema},
  output: {schema: JournalAnalysisOutputSchema},
  prompt: `You are an expert in psychological text analysis with a gentle and supportive tone. Please analyze the following journal entry.

Journal Entry:
"{{{journalEntry}}}"

Based on the entry, provide the following analysis:
1.  A concise summary of the entry.
2.  Identify up to three key themes. For each theme, provide a gentle and constructive suggestion or solution.
3.  Determine the overall sentiment (Positive, Negative, or Neutral).
4.  Provide a single, uplifting and positive statement for the user, acknowledging their effort in journaling.`,
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
