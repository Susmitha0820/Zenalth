
export type AffirmationCategory = 'Self-Love' | 'Mental Calm' | 'Confidence' | 'Tough Days' | 'Sleep Time';

export type Affirmation = {
  id: number;
  text: string;
  category: AffirmationCategory;
};

export const affirmations: Affirmation[] = [
  // Self-Love
  { id: 1, text: "I am worthy of love and respect.", category: 'Self-Love' },
  { id: 2, text: "I accept myself unconditionally.", category: 'Self-Love' },
  { id: 3, text: "My body is a vessel for my awesome mind and spirit.", category: 'Self-Love' },
  { id: 4, text: "I am enough, just as I am.", category: 'Self-Love' },
  { id: 5, text: "I choose to be kind to myself.", category: 'Self-Love' },

  // Mental Calm
  { id: 6, text: "I breathe in peace and exhale worry.", category: 'Mental Calm' },
  { id: 7, text: "My mind is calm and my thoughts are clear.", category: 'Mental Calm' },
  { id: 8, text: "I release what I cannot control.", category: 'Mental Calm' },
  { id: 9, text: "I am grounded and centered.", category: 'Mental Calm' },
  { id: 10, text: "This moment is peaceful and I am safe.", category: 'Mental Calm' },

  // Confidence
  { id: 11, text: "I am capable of achieving my goals.", category: 'Confidence' },
  { id: 12, text: "I believe in my abilities and talents.", category: 'Confidence' },
  { id: 13, text: "I radiate confidence and positivity.", category: 'Confidence' },
  { id: 14, text: "I am prepared to succeed in all that I do.", category: 'Confidence' },
  { id: 15, text: "I handle challenges with grace and strength.", category: 'Confidence' },

  // Tough Days
  { id: 16, text: "This is just a chapter, not my whole story.", category: 'Tough Days' },
  { id: 17, text: "I have the strength to get through this.", category: 'Tough Days' },
  { id: 18, text: "Every day is a new beginning.", category: 'Tough Days' },
  { id: 19, text: "I am resilient and can overcome any obstacle.", category: 'Tough Days' },
  { id: 20, text: "It's okay to not be okay.", category: 'Tough Days' },

  // Sleep Time
  { id: 21, text: "I release the day and welcome restful sleep.", category: 'Sleep Time' },
  { id: 22, text: "My body and mind are ready for deep relaxation.", category: 'Sleep Time' },
  { id: 23, text: "I am grateful for this day and I am ready to rest.", category: 'Sleep Time' },
  { id: 24, text: "I let go of all thoughts and drift into peaceful sleep.", category: 'Sleep Time' },
  { id: 25, text: "Tomorrow is a new day, and I will be refreshed.", category: 'Sleep Time' },
];
