// RiskAssessment flow to analyze user input for potential emotional or mental health risks.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {detectEmotion} from './emotion-detection';

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
      'Suggested coping mechanisms or direction to professional help based on the risk analysis and detected emotion.'
    ),
  emotion: z
    .string()
    .optional()
    .describe('The primary emotion detected in the user input.'),
});

export type RiskAssessmentOutput = z.infer<typeof RiskAssessmentOutputSchema>;

export async function assessRisk(input: RiskAssessmentInput): Promise<RiskAssessmentOutput> {
  return riskAssessmentFlow(input);
}

const riskAssessmentPrompt = ai.definePrompt({
  name: 'riskAssessmentPrompt',
  input: {
    schema: z.object({
      userInput: RiskAssessmentInputSchema.shape.userInput,
      emotion: z
        .string()
        .optional()
        .describe('The primary emotion detected in the user input.'),
    }),
  },
  output: {schema: RiskAssessmentOutputSchema},
  prompt: `You are a mental health expert analyzing user input from India for potential risks.

  Analyze the following user input:
  {{userInput}}

  The user's primary detected emotion is: {{emotion}}.

  Determine if there are any emotional or mental health risks present. Provide a summary of the risks detected and suggest appropriate coping mechanisms or direct the user to professional help if needed. The suggestions should be tailored to the detected emotion. For example, if the emotion is anger, suggest calming exercises. If sadness, suggest activities that can provide comfort. Return the output in JSON format.

  If the user is expressing suicidal thoughts, you MUST suggest they seek professional help immediately by calling a national Indian helpline. Include the following in your suggested action: "You can connect with the Tele MANAS helpline by calling 14416 or 1-800-891-4416, or reach out to AASRA at +91-9820466726. Please reach out now."
  `,
});

const riskAssessmentFlow = ai.defineFlow(
  {
    name: 'riskAssessmentFlow',
    inputSchema: RiskAssessmentInputSchema,
    outputSchema: RiskAssessmentOutputSchema,
  },
  async input => {
    // First, detect the emotion from the user's input.
    const emotionResult = await detectEmotion(input);
    const emotion = emotionResult.emotion;

    // Then, run the risk assessment prompt with the input and the detected emotion.
    const {output} = await riskAssessmentPrompt({
      userInput: input.userInput,
      emotion,
    });

    // Return the final assessment, including the detected emotion.
    return {...output!, emotion};
  }
);
