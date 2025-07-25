
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Resource = {
  title: string;
  description: string;
  type: "Article" | "Helpline" | "Exercise";
  link: string;
};

const nationalResources: Resource[] = [
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
  {
    title: "Managing Anxiety",
    description: "An article from the Government of India on how to manage and reduce anxiety in daily life.",
    type: "Article",
    link: "https://www.nhp.gov.in/disease/non-communicable-disease/anxiety-disorders",
  },
  {
    title: "Dealing with Loneliness",
    description: "Practical advice on how to cope with feelings of loneliness and isolation.",
    type: "Article",
    link: "https://www.vandrevalafoundation.com/expert-speak_inner/Dealing-with-loneliness-and-isolation",
  },
  {
    title: "Guided Meditation for Sleep",
    description: "A 10-minute guided meditation in Hindi to help you relax and fall asleep.",
    type: "Exercise",
    link: "https://www.youtube.com/watch?v=sJ3w-L0s_rA",
  },
];

type StateHelpline = {
  state: string;
  name: string;
  number: string;
  description?: string;
  link?: string;
};

const stateHelplines: StateHelpline[] = [
    { state: "Andhra Pradesh", name: "104 Health Helpline", number: "104" },
    { state: "Delhi", name: "Sumaitri", number: "011-23389090", description: "Crisis intervention for those who are distressed and suicidal." },
    { state: "Delhi", name: "The Mind's Foundation", number: "011-4076-9002", description: "Offers counselling and support for mental health issues."},
    { state: "Gujarat", name: "Jeevan Aastha Helpline", number: "1800-233-3330" },
    { state: "Karnataka", name: "SAHAI Helpline", number: "080-25497777" },
    { state: "Karnataka", name: "NIMHANS", number: "080-4611-0007", description: "National Institute of Mental Health and Neuro-Sciences helpline."},
    { state: "Kerala", name: "Maithri", number: "0484-2540530", description: "A suicide prevention helpline." },
    { state: "Maharashtra", name: "Connecting India", number: "9922004305", description: "A distress helpline based in Pune." },
    { state: "Maharashtra", name: "AASRA", number: "+91-9820466726", description: "Also operates physically from Navi Mumbai." },
    { state: "Punjab", name: "104 Medical Helpline", number: "104" },
    { state: "Rajasthan", name: "Hope Helpline", number: "0141-2711000" },
    { state: "Tamil Nadu", name: "SNEHA", number: "044-24640050", description: "Suicide prevention centre offering unconditional emotional support." },
    { state: "Telangana", name: "Roshni Trust", number: "040-66202000", description: "For depression and suicidal distress." },
    { state: "Telangana", name: "SHE Teams", number: "Dial 100 or WhatsApp 9490616555", description: "For women's safety and to report stalking or harassment."},
    { state: "Telangana", name: "Police Dail 100", number: "100", description: "For immediate police assistance in any emergency."},
    { state: "Telangana", name: "Women Helpline", number: "181", description: "24/7 helpline for women facing violence or distress."},
    { state: "Uttar Pradesh", name: "1800-180-5145 Helpline", number: "1800-180-5145" },
    { state: "West Bengal", name: "Lifeline Foundation", number: "033-24637401", description: "Suicide prevention and emotional support helpline in Kolkata." },
    { state: "West Bengal", name: "Anjali", number: "+91 98313 54343", description: "A mental health rights organization based in Kolkata."},
];


export default function ResourcesPage() {
  const [selectedState, setSelectedState] = useState("");
  const filteredHelplines = stateHelplines.filter(h => h.state === selectedState);

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Resources Hub</h1>
        <p className="text-muted-foreground mt-1">
          Curated Indian articles, exercises, and helplines for your well-being.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {nationalResources.map((resource, index) => (
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

      <Separator className="my-8" />
      
      <div className="space-y-6">
        <header>
            <h2 className="text-2xl font-bold font-headline flex items-center gap-2"><MapPin className="text-primary"/> State-Specific Helplines</h2>
            <p className="text-muted-foreground mt-1">
             Select your state to find mental health helplines and other support services available in your area.
            </p>
        </header>

         <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
                <div className="space-y-4">
                    <Select onValueChange={setSelectedState} value={selectedState}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your state..." />
                        </SelectTrigger>
                        <SelectContent>
                            {stateHelplines.map(s => s.state).filter((v, i, a) => a.indexOf(v) === i).sort().map(stateName => (
                                <SelectItem key={stateName} value={stateName}>
                                    {stateName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {selectedState && (
                        <div className="space-y-3 pt-4">
                           {filteredHelplines.length > 0 ? (
                                filteredHelplines.map((helpline, index) => (
                                   <div key={index} className="p-3 rounded-md bg-muted/50">
                                       <p className="font-semibold">{helpline.name}</p>
                                       <p className="text-sm text-muted-foreground font-medium">Contact: {helpline.number}</p>
                                       {helpline.description && (
                                         <p className="text-xs text-muted-foreground mt-1">{helpline.description}</p>
                                       )}
                                   </div>
                                ))
                           ) : (
                             <p className="text-sm text-center text-muted-foreground">No specific helplines found for {selectedState}. Please use the national helplines listed above.</p>
                           )}
                        </div>
                    )}
                </div>
            </CardContent>
         </Card>
      </div>

    </div>
  );
}
