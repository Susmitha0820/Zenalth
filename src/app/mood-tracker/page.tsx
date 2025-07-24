
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Smile, Meh, Frown, Laugh, Annoyed, Flame, Award, Trophy, Sparkles } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay, isSameDay, differenceInCalendarDays } from "date-fns";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { ChartConfig } from "@/components/ui/chart";

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
  date: string; // ISO string
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

const positiveQuotes = [
  "The secret of getting ahead is getting started.",
  "Your attitude determines your direction.",
  "Believe you can and you're halfway there.",
  "The best way to predict the future is to create it.",
  "A little progress each day adds up to big results."
];

export default function MoodTrackerPage() {
  const [moodLog, setMoodLog] = useState<MoodEntry[]>([]);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  const [streak, setStreak] = useState(0);
  const [quote, setQuote] = useState("");
  const [isClient, setIsClient] = useState(false);

  const calculateStreak = useCallback((log: MoodEntry[]) => {
    if (log.length === 0) return 0;
    
    const sortedLog = [...log].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let currentStreak = 0;
    const today = startOfDay(new Date());
    const firstLogDate = startOfDay(new Date(sortedLog[0].date));

    // Check if the most recent log is today or yesterday to start the streak count
    if (isSameDay(firstLogDate, today) || differenceInCalendarDays(today, firstLogDate) === 1) {
      currentStreak = 1;
      for (let i = 0; i < sortedLog.length - 1; i++) {
        const currentDate = startOfDay(new Date(sortedLog[i].date));
        const previousDate = startOfDay(new Date(sortedLog[i + 1].date));
        if (differenceInCalendarDays(currentDate, previousDate) === 1) {
          currentStreak++;
        } else if (!isSameDay(currentDate, previousDate)) {
          // Break if dates are not consecutive and not the same day
          break;
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

        const today = startOfDay(new Date());
        const loggedToday = parsedLog.some(entry => isSameDay(new Date(entry.date), today));
        setHasLoggedToday(loggedToday);
        
        setStreak(calculateStreak(parsedLog));
    } catch(error) {
        console.error("Failed to parse mood log from localStorage", error);
        setMoodLog([]);
    }
    setQuote(positiveQuotes[Math.floor(Math.random() * positiveQuotes.length)]);
  }, [calculateStreak]);

  const handleMoodSelect = (mood: Mood) => {
    if (hasLoggedToday) return;

    const newEntry: MoodEntry = { date: startOfDay(new Date()).toISOString(), mood };
    // Remove any other entry for today before adding the new one
    const logForOtherDays = moodLog.filter(entry => !isSameDay(new Date(entry.date), startOfDay(new Date())));
    const updatedLog = [...logForOtherDays, newEntry];
    
    setMoodLog(updatedLog);
    setHasLoggedToday(true);
    setStreak(calculateStreak(updatedLog));
    localStorage.setItem("moodLog", JSON.stringify(updatedLog));
    localStorage.setItem("currentMood", mood);
  };

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(startOfDay(new Date()), i)).reverse();
    return last7Days.map(date => {
        const entry = moodLog.find(log => isSameDay(new Date(log.date), date));
        const mood = entry?.mood;
        const moodValue = mood ? moodMeta[mood].value : 0;
        return {
            date: format(date, "MMM d"),
            moodValue,
            fill: mood ? moodMeta[mood].color : "hsl(var(--muted))",
        };
    });
  }, [moodLog]);

  const earnedBadges = useMemo(() => {
      return (Object.keys(badgeMeta) as unknown as BadgeTier[]).filter(tier => streak >= tier);
  }, [streak]);

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Mood Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Log your mood daily to see your emotional patterns over time.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>How are you feeling today?</CardTitle>
                <CardDescription>Select one to log your current mood.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-center">
                {hasLoggedToday ? (
                   <Alert>
                     <Calendar className="h-4 w-4" />
                     <AlertTitle>Thanks for logging!</AlertTitle>
                     <AlertDescription>
                       You've already logged your mood for today. Come back tomorrow!
                     </AlertDescription>
                   </Alert>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 place-items-center">
                            {Object.entries(moodMeta).map(([moodKey, { icon: Icon, label }]) => (
                                <div key={moodKey} className="flex flex-col items-center gap-2">
                                     <Button
                                        variant="outline"
                                        size="icon"
                                        className="w-16 h-16 rounded-full"
                                        onClick={() => handleMoodSelect(moodKey as Mood)}
                                        aria-label={`Log mood as ${label}`}
                                     >
                                        <Icon className="w-8 h-8"/>
                                     </Button>
                                     <span className="text-sm text-muted-foreground">{label}</span>
                                </div>
                            ))}
                        </div>
                        <Alert variant="default" className="text-center bg-accent/30 border-accent/50">
                            <AlertDescription>
                                "{quote}"
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
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
            <CardTitle>Your Mood: Last 7 Days</CardTitle>
            <CardDescription>
              A visualization of your mood entries.
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
                        <Bar dataKey="moodValue" radius={8}>
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

    