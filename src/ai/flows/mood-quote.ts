'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a quote based on mood.
 *
 * - moodQuote - A function that takes a mood and returns a relevant quote.
 * - MoodQuoteInput - The input type for the moodQuote function.
 * - MoodQuoteOutput - The return type for the moodQuote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MoodQuoteInputSchema = z.object({
  mood: z.enum(['joyful', 'happy', 'neutral', 'sad', 'annoyed']).describe("The user's current mood."),
});
export type MoodQuoteInput = z.infer<typeof MoodQuoteInputSchema>;

const MoodQuoteOutputSchema = z.object({
  quote: z.string().describe('A positive and supportive quote relevant to the user\'s mood.'),
});
export type MoodQuoteOutput = z.infer<typeof MoodQuoteOutputSchema>;

export async function moodQuote(
  input: MoodQuoteInput
): Promise<MoodQuoteOutput> {
  return moodQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moodQuotePrompt',
  input: {schema: MoodQuoteInputSchema},
  output: {schema: MoodQuoteOutputSchema},
  prompt: `You are an AI that provides short, encouraging, and positive quotes. A user has logged their mood as "{{mood}}". 

Provide a single, uplifting quote that is relevant to this mood. 
- If the mood is positive (joyful, happy), provide a quote that celebrates the moment.
- If the mood is neutral, provide a gentle, thought-provoking quote.
- If the mood is negative (sad, annoyed), provide a comforting and hopeful quote.

The quote should be concise and easy to understand. Do not add any extra commentary.`,
});

const moodQuoteFlow = ai.defineFlow(
  {
    name: 'moodQuoteFlow',
    inputSchema: MoodQuoteInputSchema,
    outputSchema: MoodQuoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
