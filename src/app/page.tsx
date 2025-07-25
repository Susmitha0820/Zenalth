
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { empatheticResponse } from "@/ai/flows/empathetic-response";
import { assessRisk } from "@/ai/flows/risk-assessment";
import { detectEmotion } from "@/ai/flows/emotion-detection";
import { Send, AlertTriangle, ShieldCheck, LifeBuoy, ArrowRight, MessageSquare, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { Resource } from "@/lib/resources";
import { Badge } from "@/components/ui/badge";

type Mood = "joyful" | "happy" | "neutral" | "sad" | "annoyed" | "default";

type ChatMessage = {
  role: "user" | "assistant" | "risk-assessment";
  content: string;
  riskSummary?: string;
  suggestedAction?: string;
  recommendedResource?: Resource;
  highlightedTheme?: string;
};

// Mapping from detected emotion to mood for theming
const emotionToMoodMap: { [key: string]: Mood } = {
    joy: 'joyful',
    surprise: 'happy',
    neutral: 'neutral',
    sadness: 'sad',
    fear: 'sad',
    anger: 'annoyed',
    disgust: 'annoyed',
};


export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [mood, setMood] = useState<Mood>("default");
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    setIsClient(true);
    // Load initial mood from mood tracker, but it will be updated by chat
    const initialMood = (localStorage.getItem("currentMood") as Mood) || "default";
    setMood(initialMood);

    const savedLanguage = localStorage.getItem("chatLanguage") || "English";
    setLanguage(savedLanguage);

    const handleStorageChange = (event: StorageEvent) => {
        // We only listen for language changes now
        if (event.key === "chatLanguage") {
            const savedLanguage = localStorage.getItem("chatLanguage") || "English";
            setLanguage(savedLanguage);
        }
    }
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
        const [response, risk, emotionResult] = await Promise.all([
            empatheticResponse({ userInput: currentInput, language }),
            assessRisk({ userInput: currentInput }),
            detectEmotion({ userInput: currentInput }),
        ]);
        
        const detectedMood = emotionToMoodMap[emotionResult.emotion] || 'default';
        setMood(detectedMood);

        const assistantMessage: ChatMessage = {
            role: "assistant",
            content: response.response,
            recommendedResource: response.recommendedResource,
            highlightedTheme: response.highlightedTheme,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        if (risk.riskDetected) {
            const riskMessage: ChatMessage = {
                role: "risk-assessment",
                content: risk.riskSummary,
                riskSummary: risk.riskSummary,
                suggestedAction: risk.suggestedAction,
            };
            setMessages((prev) => [...prev, riskMessage]);
        }
    } catch (error) {
        console.error("Error fetching AI response:", error);
        let errorMessageContent = "I'm having a little trouble connecting right now. Please try again in a moment.";
        if (error instanceof Error && error.message.includes('503')) {
            errorMessageContent = "I'm a bit overwhelmed at the moment. Please try sending your message again in a few seconds.";
        }
        
        const errorMessage: ChatMessage = {
            role: "assistant",
            content: errorMessageContent,
        };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };
  
  if (!isClient) {
    return null;
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height))] p-4 md:p-6 bg-muted/20" data-mood={mood}>
      <header className="mb-4">
        <h1 className="text-2xl font-bold font-headline">Empathetic Chat</h1>
        <p className="text-muted-foreground">
          A safe space to share what's on your mind.
        </p>
      </header>
      <div className="flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-4 rounded-lg border bg-background" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                    <MessageSquare size={48} className="mx-auto mb-4 text-primary" />
                    <p className="font-semibold">How are you feeling today?</p>
                    <p className="text-sm">I'm here to listen without judgment.</p>
                </div>
            )}
            {messages.map((message, index) => (
              <div key={index}>
                {message.role === 'user' && (
                  <div className="flex items-start gap-3 justify-end">
                    <div 
                      className="bg-[--chat-primary] text-primary-foreground p-3 rounded-lg max-w-sm"
                    >
                      <p>{message.content}</p>
                    </div>
                  </div>
                )}
                {message.role === 'assistant' && (
                  <div className="flex items-start gap-3 justify-start">
                    <div className="bg-muted p-3 rounded-lg max-w-sm space-y-3">
                       {message.highlightedTheme && (
                            <Badge variant="secondary" className="capitalize">
                                <Tag className="mr-1.5 h-3 w-3"/>
                                {message.highlightedTheme}
                            </Badge>
                        )}
                      <p>{message.content}</p>
                      {message.recommendedResource && (
                        <Card className="bg-background/50">
                            <CardHeader className="flex-row items-start gap-3 space-y-0 p-3">
                                <div className="p-2 bg-accent/50 rounded-full">
                                    <LifeBuoy className="w-5 h-5 text-accent-foreground" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm font-semibold">{message.recommendedResource.title}</CardTitle>
                                    <CardDescription className="text-xs">{message.recommendedResource.description}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                                <Button asChild variant="secondary" size="sm" className="w-full">
                                    <a href={message.recommendedResource.link} target="_blank" rel="noopener noreferrer">
                                    Open Resource <ArrowRight className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                )}
                {message.role === 'risk-assessment' && (
                    <Card className="border-destructive/50 bg-destructive/10 my-4">
                        <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
                            <AlertTriangle className="text-destructive w-6 h-6"/>
                            <div>
                                <CardTitle>A Note of Care</CardTitle>
                                <CardDescription className="text-destructive/80 text-xs">
                                    It sounds like you're going through a lot.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-sm font-medium mb-2">{message.riskSummary}</p>
                            <Separator className="my-2 bg-destructive/20"/>
                            <p className="text-sm">{message.suggestedAction}</p>
                        </CardContent>
                    </Card>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <footer className="pt-4">
         <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me anything..."
            className="flex-1"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <Button type="submit" disabled={isLoading} size="icon" aria-label="Send message" className="bg-[--chat-primary] text-primary-foreground hover:bg-[--chat-primary]/90">
            <Send />
          </Button>
        </form>
         <Alert variant="default" className="text-xs mt-2 py-2 px-3">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <AlertDescription>
                Your conversation is private. Messages are processed by the AI but never stored.
            </AlertDescription>
        </Alert>
      </footer>
    </div>
  );
}

    