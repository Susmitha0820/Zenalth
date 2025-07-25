
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Smile, Meh, Frown, Laugh, Annoyed, Flame, Award, Trophy, Sparkles, Loader, Wand2 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay, isSameDay, differenceInCalendarDays, subHours } from "date-fns";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { ChartConfig } from "@/components/ui/chart";
import { moodQuote } from "@/ai/flows/mood-quote";
import { cn } from "@/lib/utils";

type Mood = "joyful" | "happy" | "neutral" | "sad" | "annoyed";

const moodMeta: Record<Mood, { icon: React.ElementType, color: string, label: string, value: number }> = {
  joyful: { icon: Laugh, color: "hsl(var(--chart-5))", label: "Joyful", value: 5 },
  happy: { icon: Smile, color: "hsl(var(--chart-4))", label: "Happy", value: 4 },
  neutral: { icon: Meh, color: "hsl(var(--chart-3))", label: "Neutral", value: 3 },
  sad: { icon: Frown, color: "hsl(var(--chart-2))", label: "Sad", value: 2 },
  annoyed: { icon: Annoyed, color: "hsl(var(--chart-1))", label: "Annoyed", value: 1 },
};

const badgeMeta = {
  3: { icon: Award, label: "3-Day Streak", color: "text-amber-500" },
  7: { icon: Trophy, label: "7-Day Streak", color: "text-slate-400" },
  14: { icon: Sparkles, label: "14-Day Streak", color: "text-violet-500" },
};

type BadgeTier = keyof typeof badgeMeta;

type MoodEntry = {
  date: string; // ISO string with timestamp
  mood: Mood;
};

const chartConfig = {
  moodValue: {
    label: "Mood",
  },
  joyful: { label: "Joyful", color: moodMeta.joyful.color },
  happy: { label: "Happy", color: moodMeta.happy.color },
  neutral: { label: "Neutral", color: moodMeta.neutral.color },
  sad: { label: "Sad", color: moodMeta.sad.color },
  annoyed: { label: "Annoyed", color: moodMeta.annoyed.color },
} satisfies ChartConfig;

export default function MoodTrackerPage() {
  const [moodLog, setMoodLog] = useState<MoodEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [generatedQuote, setGeneratedQuote] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const calculateStreak = useCallback((log: MoodEntry[]) => {
    if (log.length === 0) return 0;
    
    // Get unique days from the log, sorted reverse chronologically
    const uniqueDays = [...new Set(log.map(entry => startOfDay(new Date(entry.date)).toISOString()))]
      .sort((a,b) => new Date(b).getTime() - new Date(a).getTime())
      .map(isoString => new Date(isoString));

    if (uniqueDays.length === 0) return 0;

    let currentStreak = 0;
    const today = startOfDay(new Date());
    const firstLogDate = uniqueDays[0];

    // Check if the most recent log is today or yesterday to start the streak count
    if (isSameDay(firstLogDate, today) || differenceInCalendarDays(today, firstLogDate) === 1) {
      currentStreak = 1;
      for (let i = 0; i < uniqueDays.length - 1; i++) {
        const currentDate = uniqueDays[i];
        const previousDate = uniqueDays[i+1];
        if (differenceInCalendarDays(currentDate, previousDate) === 1) {
          currentStreak++;
        } else {
          break; // Break if dates are not consecutive
        }
      }
    }
    return currentStreak;
  }, []);


  useEffect(() => {
    setIsClient(true);
    try {
        const savedLog = localStorage.getItem("moodLog");
        const parsedLog: MoodEntry[] = savedLog ? JSON.parse(savedLog) : [];
        setMoodLog(parsedLog);
        setStreak(calculateStreak(parsedLog));
    } catch(error) {
        console.error("Failed to parse mood log from localStorage", error);
        setMoodLog([]);
    }
  }, [calculateStreak]);

  const handleMoodSelect = async (mood: Mood) => {
    setIsLoading(true);
    setGeneratedQuote("");

    const newEntry: MoodEntry = { date: new Date().toISOString(), mood };
    const updatedLog = [...moodLog, newEntry];
    
    setMoodLog(updatedLog);
    setStreak(calculateStreak(updatedLog));
    localStorage.setItem("moodLog", JSON.stringify(updatedLog));
    localStorage.setItem("currentMood", mood);
    
    try {
      const result = await moodQuote({ mood });
      setGeneratedQuote(result.quote);
    } catch (e) {
      console.error("Failed to get quote:", e);
      setGeneratedQuote("Every step you take on your wellness journey is a victory.");
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = useMemo(() => {
    const last24Hours = Array.from({ length: 24 }).map((_, i) => subHours(new Date(), i)).reverse();
    const hourlyMoods = last24Hours.map(hour => {
      const entriesInHour = moodLog.filter(entry => 
        new Date(entry.date) >= hour && new Date(entry.date) < subHours(hour, -1)
      );
      
      let moodValue = 0;
      let mood: Mood | undefined = undefined;

      if (entriesInHour.length > 0) {
        // Find the most frequent mood in the hour
        const moodCounts = entriesInHour.reduce((acc, entry) => {
          acc[entry.mood] = (acc[entry.mood] || 0) + 1;
          return acc;
        }, {} as Record<Mood, number>);
        
        mood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a as Mood] > moodCounts[b as Mood] ? a : b) as Mood;
        moodValue = mood ? moodMeta[mood].value : 0;
      }
      
      return {
        date: format(hour, "ha"),
        moodValue,
        fill: mood ? moodMeta[mood].color : "hsl(var(--muted))",
      };
    });

    return hourlyMoods;
  }, [moodLog]);


  const earnedBadges = useMemo(() => {
      return (Object.keys(badgeMeta) as unknown as BadgeTier[]).filter(tier => streak >= tier);
  }, [streak]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Mood Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Log your mood throughout the day to see your emotional patterns over time.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>How are you feeling right now?</CardTitle>
                <CardDescription>Select a mood to log it.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-center gap-4">
                  <div className="space-y-4">
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 place-items-center">
                          {Object.entries(moodMeta).map(([moodKey, { icon: Icon, label, color }]) => (
                              <div key={moodKey} className="flex flex-col items-center gap-2">
                                   <button
                                      className={cn(
                                        "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200",
                                        "bg-background shadow-[4px_4px_8px_#bcbcbc,-4px_-4px_8px_#ffffff]",
                                        "dark:bg-card dark:shadow-[4px_4px_8px_#1a1a1a,-4px_-4px_8px_#2a2a2a]",
                                        "active:shadow-[inset_4px_4px_8px_#bcbcbc,inset_-4px_-4px_8px_#ffffff]",
                                        "dark:active:shadow-[inset_4px_4px_8px_#1a1a1a,inset_-4px_-4px_8px_#2a2a2a]",
                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                      )}
                                      style={{ color }}
                                      onClick={() => handleMoodSelect(moodKey as Mood)}
                                      disabled={isLoading}
                                      aria-label={`Log mood as ${label}`}
                                   >
                                      <Icon className="w-8 h-8"/>
                                   </button>
                                   <span className="text-sm text-muted-foreground">{label}</span>
                              </div>
                          ))}
                      </div>
                      {isLoading && (
                        <div className="flex items-center justify-center text-sm text-muted-foreground gap-2">
                           <Loader className="h-4 w-4 animate-spin"/>
                           <span>Finding the right words...</span>
                        </div>
                      )}
                      {generatedQuote && (
                         <Alert variant="default" className="text-center bg-accent/30 border-accent/50">
                            <Wand2 className="h-4 w-4 text-accent-foreground"/>
                            <AlertTitle>A Thought For You</AlertTitle>
                            <AlertDescription>
                                "{generatedQuote}"
                            </AlertDescription>
                        </Alert>
                      )}
                  </div>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                   <CardTitle>Your Progress</CardTitle>
                   <CardDescription>Keep up the great work on your wellness journey.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-around text-center">
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2 text-3xl font-bold text-orange-500">
                            <Flame />
                            <span>{streak}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Day Streak</span>
                    </div>
                     <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-3">
                            {earnedBadges.length > 0 ? (
                                earnedBadges.map(tier => {
                                    const { icon: Icon, color } = badgeMeta[tier];
                                    return <Icon key={tier} className={`w-8 h-8 ${color}`} />;
                                })
                            ) : (
                                <span className="text-sm text-muted-foreground">No badges yet</span>
                            )}
                        </div>
                         <span className="text-sm text-muted-foreground">Badges</span>
                    </div>
                </CardContent>
            </Card>
        </div>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Mood: Last 24 Hours</CardTitle>
            <CardDescription>
              A visualization of your mood entries. This is your daily assessment.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[20rem] w-full">
                <ResponsiveContainer>
                    <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            fontSize={12}
                        />
                         <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            fontSize={12}
                            domain={[0, 5]}
                            ticks={[1, 2, 3, 4, 5]}
                            tickFormatter={(value) => Object.values(moodMeta).find(m => m.value === value)?.label || ''}
                         />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" hideLabel />}
                        />
                        <Bar dataKey="moodValue" radius={4}>
                           {chartData.map((entry, index) => (
                              <Bar key={`cell-${index}`} fill={entry.fill} />
                           ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
             </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
