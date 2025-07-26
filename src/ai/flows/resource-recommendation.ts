'use server';

/**
 * @fileOverview This file defines a Genkit tool for recommending relevant resources.
 *
 * - getRelevantResources - A tool that searches for resources based on a query.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {nationalResources, Resource} from '@/lib/resources';

export const getRelevantResources = ai.defineTool(
  {
    name: 'getRelevantResources',
    description:
      "Searches for and returns relevant mental health resources (articles, exercises) based on the user's expressed needs or feelings. Excludes helplines.",
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          'A keyword or phrase from the user conversation, like "anxiety", "stress", "loneliness", "breathing", etc.'
        ),
    }),
    outputSchema: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        type: z.enum(['Article', 'Helpline', 'Exercise']),
        link: z.string(),
      })
    ),
  },
  async ({query}) => {
    const lowerCaseQuery = query.toLowerCase();

    const filteredResources = nationalResources.filter(resource => {
      // Search in title and description, but exclude helplines from the results
      return (
        resource.type !== 'Helpline' &&
        (resource.title.toLowerCase().includes(lowerCaseQuery) ||
          resource.description.toLowerCase().includes(lowerCaseQuery))
      );
    });

    // Return the top 2 results to keep it concise
    return filteredResources.slice(0, 2);
  }
);
