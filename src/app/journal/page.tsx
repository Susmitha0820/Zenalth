
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeJournalEntry, JournalAnalysisOutput } from "@/ai/flows/journal-analysis";
import { Loader, Wand2, Tag, BookText, Smile, Frown, Meh } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function JournalPage() {
  const [entry, setEntry] = useState("");
  const [analysis, setAnalysis] = useState<JournalAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!entry.trim()) {
      setError("Please write something in your journal before analyzing.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeJournalEntry({ journalEntry: entry });
      setAnalysis(result);
    } catch (e) {
      console.error("Error analyzing journal entry:", e);
      setError("Sorry, I had trouble analyzing your entry. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: "Positive" | "Negative" | "Neutral") => {
    switch (sentiment) {
      case "Positive":
        return <Smile className="w-5 h-5 text-green-500" />;
      case "Negative":
        return <Frown className="w-5 h-5 text-red-500" />;
      case "Neutral":
        return <Meh className="w-5 h-5 text-gray-500" />;
    }
  };


  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">AI Journal</h1>
        <p className="text-muted-foreground mt-1">
          Write down your thoughts and let an AI help you find clarity.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Your Space to Reflect</CardTitle>
            <CardDescription>
              Write whatever is on your mind. Your entry is private.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Dear Journal..."
              rows={15}
              className="resize-none"
            />
            <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" /> Analyze Entry
                </>
              )}
            </Button>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
            <CardDescription>
              Here are some insights from your entry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-2"><BookText size={18}/> Summary</h3>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">{analysis.summary}</p>
                </div>
                <Separator />
                <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-3"><Tag size={18}/> Key Themes</h3>
                    <div className="flex flex-wrap gap-2">
                        {analysis.themes.map((theme, i) => (
                            <Badge key={i} variant="secondary">{theme}</Badge>
                        ))}
                    </div>
                </div>
                 <Separator />
                 <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2">Overall Sentiment</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {getSentimentIcon(analysis.sentiment)}
                        <span className="font-medium">{analysis.sentiment}</span>
                    </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                <Wand2 size={40} className="mb-4" />
                <p>Your analysis will appear here once you submit an entry.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
