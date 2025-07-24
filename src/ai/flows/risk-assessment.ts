// RiskAssessment flow to analyze user input for potential emotional or mental health risks.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RiskAssessmentInputSchema = z.object({
  userInput: z.string().describe('The user input to analyze.'),
});

export type RiskAssessmentInput = z.infer<typeof RiskAssessmentInputSchema>;

const RiskAssessmentOutputSchema = z.object({
  riskDetected: z.boolean().describe('Whether a risk is detected in the user input.'),
  riskSummary: z.string().describe('A summary of the detected risks.'),
  suggestedAction: z
    .string()
    .describe(
      'Suggested coping mechanisms or direction to professional help based on the risk analysis.'
    ),
});

export type RiskAssessmentOutput = z.infer<typeof RiskAssessmentOutputSchema>;

export async function assessRisk(input: RiskAssessmentInput): Promise<RiskAssessmentOutput> {
  return riskAssessmentFlow(input);
}

const riskAssessmentPrompt = ai.definePrompt({
  name: 'riskAssessmentPrompt',
  input: {schema: RiskAssessmentInputSchema},
  output: {schema: RiskAssessmentOutputSchema},
  prompt: `You are a mental health expert analyzing user input for potential risks.

  Analyze the following user input:
  {{userInput}}

  Determine if there are any emotional or mental health risks present. Provide a summary of the risks detected and suggest appropriate coping mechanisms or direct the user to professional help if needed. Return the output in JSON format.

  Make sure that if the user is suicidal, that you suggest they seek professional help.
  `,
});

const riskAssessmentFlow = ai.defineFlow(
  {
    name: 'riskAssessmentFlow',
    inputSchema: RiskAssessmentInputSchema,
    outputSchema: RiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await riskAssessmentPrompt(input);
    return output!;
  }
);
