
"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { empatheticResponse } from "@/ai/flows/empathetic-response";
import { assessRisk } from "@/ai/flows/risk-assessment";
import { detectEmotion } from "@/ai/flows/emotion-detection";
import { Send, AlertTriangle, ShieldCheck, User, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type ChatMessage = {
  role: "user" | "assistant" | "risk-assessment";
  content: string;
  riskSummary?: string;
  suggestedAction?: string;
};

type Mood = "joyful" | "happy" | "neutral" | "sad" | "annoyed" | "default";

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
  const [currentMood, setCurrentMood] = useState<Mood>("default");
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    setIsClient(true);
    // Load initial mood from mood tracker, but it will be updated by chat
    const mood = (localStorage.getItem("currentMood") as Mood) || "default";
    setCurrentMood(mood);
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
        setCurrentMood(detectedMood);

        const assistantMessage: ChatMessage = {
            role: "assistant",
            content: response.response,
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
    return <div className="absolute top-4 right-4 flex gap-2 items-center h-7 w-7" />;
  }
  
  return (
    <div className="flex flex-col h-screen p-4 md:p-6 bg-muted/20" data-mood={currentMood}>
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
                    <Bot size={48} className="mx-auto mb-4" />
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
                    <Avatar className="w-8 h-8">
                      <AvatarFallback><User size={16} /></AvatarFallback>
                    </Avatar>
                  </div>
                )}
                {message.role === 'assistant' && (
                  <div className="flex items-start gap-3">
                     <Avatar className="w-8 h-8">
                       <AvatarFallback><Bot size={16} /></AvatarFallback>
                     </Avatar>
                    <div className="bg-muted p-3 rounded-lg max-w-sm">
                      <p>{message.content}</p>
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
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                    <AvatarFallback><Bot size={16} /></AvatarFallback>
                </Avatar>
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
          <Button type="submit" disabled={isLoading} size="icon" aria-label="Send message">
            <Send />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <ShieldCheck size={12}/> Your conversation is private and not stored.
        </p>
      </footer>
    </div>
  );
}
