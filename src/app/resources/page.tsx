
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { nationalResources, stateHelplines, Resource } from "@/lib/resources";


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
