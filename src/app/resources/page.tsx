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
    title: "Tele MANAS National Helpline",
    description: "A 24/7 national tele-mental health program. Call 14416 or 1-800-891-4416 for support.",
    type: "Helpline",
    link: "https://telemanas.mohfw.gov.in/",
  },
  {
    title: "AASRA",
    description: "Provides confidential support for individuals in distress and facing suicidal thoughts. Call +91-9820466726.",
    type: "Helpline",
    link: "http://www.aasra.info/",
  },
  {
    title: "Vandrevala Foundation",
    description: "A 24x7 helpline providing free psychological counseling and crisis intervention.",
    type: "Helpline",
    link: "https://www.vandrevalafoundation.com/",
  },
  {
    title: "iCALL (TISS)",
    description: "A psychosocial helpline offering free telephone and email-based counseling services by trained professionals.",
    type: "Helpline",
    link: "http://icallhelpline.org/",
  },
  {
    title: "Understanding Stress",
    description: "An article from the Government of India on how to manage and reduce stress in daily life.",
    type: "Article",
    link: "https://www.nhp.gov.in/healthlyliving/stress-management",
  },
  {
    title: "Simple Breathing Exercise",
    description: "A simple but powerful technique from a certified Indian yoga instructor to calm your nervous system.",
    type: "Exercise",
    link: "https://www.youtube.com/watch?v=F28MGLlpP90",
  },
];

export default function ResourcesPage() {
  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Resources Hub</h1>
        <p className="text-muted-foreground mt-1">
          Curated Indian articles, exercises, and helplines for your well-being.
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
