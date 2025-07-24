import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type Resource = {
  title: string;
  description: string;
  type: "Article" | "Helpline" | "Exercise";
  link: string;
};

const resources: Resource[] = [
  {
    title: "Understanding Anxiety",
    description: "Learn about the symptoms, causes, and treatments for anxiety in this comprehensive guide.",
    type: "Article",
    link: "#",
  },
  {
    title: "Crisis Text Line",
    description: "In crisis? Text HOME to 741741 from anywhere in the US, anytime, about any type of crisis.",
    type: "Helpline",
    link: "#",
  },
  {
    title: "5-Minute Mindfulness Meditation",
    description: "A short, guided meditation to help you calm your mind and reduce stress.",
    type: "Exercise",
    link: "#",
  },
  {
    title: "The National Suicide Prevention Lifeline",
    description: "Call 988 for 24/7, free and confidential support for people in distress.",
    type: "Helpline",
    link: "#",
  },
  {
    title: "Dealing with Burnout",
    description: "Tips and strategies for recognizing and overcoming academic and social burnout.",
    type: "Article",
    link: "#",
  },
  {
    title: "Box Breathing Exercise",
    description: "A simple but powerful technique to calm your nervous system in just a few minutes.",
    type: "Exercise",
    link: "#",
  },
];

export default function ResourcesPage() {
  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Resources Hub</h1>
        <p className="text-muted-foreground mt-1">
          Curated articles, exercises, and helplines for your well-being.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, index) => (
          <Card key={index} className="flex flex-col transition-transform transform hover:-translate-y-1">
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription className="mt-1">{resource.description}</CardDescription>
                  </div>
                  <span className="text-xs font-semibold text-accent-foreground bg-accent px-2 py-1 rounded-full shrink-0 ml-2">{resource.type}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow"></CardContent>
            <CardFooter>
              <Button asChild variant="secondary" className="w-full">
                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                  Open Resource <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
