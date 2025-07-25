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
import {getRelevantResources} from './resource-recommendation';
import {Resource} from '@/lib/resources';

const EmpatheticResponseInputSchema = z.object({
  userInput: z.string().describe('The user input to respond to.'),
  language: z
    .string()
    .optional()
    .default('English')
    .describe('The language for the response.'),
});
export type EmpatheticResponseInput = z.infer<
  typeof EmpatheticResponseInputSchema
>;

const EmpatheticResponseOutputSchema = z.object({
  response: z.string().describe('The empathetic response to the user input.'),
  recommendedResource: z
    .object({
      title: z.string(),
      description: z.string(),
      type: z.string(),
      link: z.string(),
    })
    .optional()
    .nullable()
    .transform(v => v ?? undefined)
    .describe('A relevant resource suggested to the user.'),
});
export type EmpatheticResponseOutput = z.infer<
  typeof EmpatheticResponseOutputSchema
>;

export async function empatheticResponse(
  input: EmpatheticResponseInput
): Promise<EmpatheticResponseOutput> {
  return empatheticResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'empatheticResponsePrompt',
  input: {schema: EmpatheticResponseInputSchema},
  output: {schema: EmpatheticResponseOutputSchema},
  tools: [getRelevantResources],
  prompt: `You are an AI designed to provide empathetic and supportive responses to users. A user has provided the following input: "{{{userInput}}}".  Respond in a way that acknowledges their feelings and offers support or understanding. Be concise and avoid being overly verbose. Focus on making the user feel heard and understood. The response should be no more than 5 sentences.

If the user mentions a specific struggle like "anxiety", "stress", "loneliness", or asks for help, use the getRelevantResources tool to find a helpful article or exercise. If you find a relevant resource, incorporate it into your response and populate the 'recommendedResource' output field. Only recommend one resource at a time. Do not suggest helplines, only articles or exercises unless the user is in immediate distress.

Respond in the following language: {{language}}.`,
});

const empatheticResponseFlow = ai.defineFlow(
  {
    name: 'empatheticResponseFlow',
    inputSchema: EmpatheticResponseInputSchema,
    outputSchema: EmpatheticResponseOutputSchema,
  },
  async input => {
    const llmResponse = await prompt(input);
    const output = llmResponse.output;

    if (!output) {
      return {response: 'I am not sure how to respond to that.'};
    }
    const toolCalls = llmResponse.toolCalls(getRelevantResources.name);

    if (toolCalls.length > 0) {
      const toolCall = toolCalls[0];
      const toolOutput: Resource[] = await getRelevantResources(toolCall.input);
      if (toolOutput.length > 0) {
        const recommendedResource = toolOutput[0];
        const finalLlmResponse = await prompt(input, {
          tools: [getRelevantResources],
          toolResult: {
            tool: getRelevantResources,
            call: toolCall,
            result: toolOutput,
          },
        });
        return {
          ...finalLlmResponse.output!,
          recommendedResource,
        };
      }
    }

    return output;
  }
);
