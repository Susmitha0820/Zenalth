'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating empathetic responses.
 *
 * - empatheticResponse - A function that takes user input and returns an empathetic response.
 * - EmpatheticResponseInput - The input type for the empatheticResponse function.
 * - EmpatheticResponseOutput - The return type for the empatheticResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmpatheticResponseInputSchema = z.object({
  userInput: z.string().describe('The user input to respond to.'),
  language: z.string().optional().default('English').describe('The language for the response.'),
});
export type EmpatheticResponseInput = z.infer<typeof EmpatheticResponseInputSchema>;

const EmpatheticResponseOutputSchema = z.object({
  response: z.string().describe('The empathetic response to the user input.'),
});
export type EmpatheticResponseOutput = z.infer<typeof EmpatheticResponseOutputSchema>;

export async function empatheticResponse(input: EmpatheticResponseInput): Promise<EmpatheticResponseOutput> {
  return empatheticResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'empatheticResponsePrompt',
  input: {schema: EmpatheticResponseInputSchema},
  output: {schema: EmpatheticResponseOutputSchema},
  prompt: `You are an AI designed to provide empathetic and supportive responses to users. A user has provided the following input: "{{{userInput}}}".  Respond in a way that acknowledges their feelings and offers support or understanding. Be concise and avoid being overly verbose. Focus on making the user feel heard and understood. The response should be no more than 5 sentences.

Respond in the following language: {{language}}.`,
});

const empatheticResponseFlow = ai.defineFlow(
  {
    name: 'empatheticResponseFlow',
    inputSchema: EmpatheticResponseInputSchema,
    outputSchema: EmpatheticResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
