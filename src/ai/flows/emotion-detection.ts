'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting emotions in text.
 *
 * - detectEmotion - A function that takes user input and returns the detected emotion.
 * - EmotionDetectionInput - The input type for the detectEmotion function.
 * - EmotionDetectionOutput - The return type for the detectEmotion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmotionDetectionInputSchema = z.object({
  userInput: z.string().describe('The user input to analyze for emotion.'),
});
export type EmotionDetectionInput = z.infer<typeof EmotionDetectionInputSchema>;

const EmotionDetectionOutputSchema = z.object({
  emotion: z
    .enum(['joy', 'sadness', 'anger', 'fear', 'disgust', 'surprise', 'neutral'])
    .describe('The detected emotion from the user input.'),
});
export type EmotionDetectionOutput = z.infer<typeof EmotionDetectionOutputSchema>;

export async function detectEmotion(
  input: EmotionDetectionInput
): Promise<EmotionDetectionOutput> {
  return emotionDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emotionDetectionPrompt',
  input: {schema: EmotionDetectionInputSchema},
  output: {schema: EmotionDetectionOutputSchema},
  prompt: `You are an expert in text-based emotion analysis. Analyze the following user input and determine the primary emotion being expressed.

User Input:
"{{{userInput}}}"

Classify the emotion into one of the following categories: joy, sadness, anger, fear, disgust, surprise, or neutral.`,
});

const emotionDetectionFlow = ai.defineFlow(
  {
    name: 'emotionDetectionFlow',
    inputSchema: EmotionDetectionInputSchema,
    outputSchema: EmotionDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
