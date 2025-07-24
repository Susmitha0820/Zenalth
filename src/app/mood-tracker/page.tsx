
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Smile, Meh, Frown, Laugh, Annoyed } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type Mood = "joyful" | "happy" | "neutral" | "sad" | "annoyed";

const moodMeta: Record<Mood, { icon: React.ElementType, color: string, label: string, value: number }> = {
  joyful: { icon: Laugh, color: "hsl(var(--chart-5))", label: "Joyful", value: 5 },
  happy: { icon: Smile, color: "hsl(var(--chart-4))", label: "Happy", value: 4 },
  neutral: { icon: Meh, color: "hsl(var(--chart-3))", label: "Neutral", value: 3 },
  sad: { icon: Frown, color: "hsl(var(--chart-2))", label: "Sad", value: 2 },
  annoyed: { icon: Annoyed, color: "hsl(var(--chart-1))", label: "Annoyed", value: 1 },
};

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


export default function MoodTrackerPage() {
  const [moodLog, setMoodLog] = useState<MoodEntry[]>([]);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
        const savedLog = localStorage.getItem("moodLog");
        if (savedLog) {
          const parsedLog: MoodEntry[] = JSON.parse(savedLog);
          setMoodLog(parsedLog);

          const today = startOfDay(new Date());
          const loggedToday = parsedLog.some(entry => isSameDay(new Date(entry.date), today));
          setHasLoggedToday(loggedToday);
        }
    } catch(error) {
        console.error("Failed to parse mood log from localStorage", error);
        setMoodLog([]);
    }
  }, []);

  const handleMoodSelect = (mood: Mood) => {
    if (hasLoggedToday) return;

    const newEntry: MoodEntry = { date: startOfDay(new Date()).toISOString(), mood };
    const updatedLog = [...moodLog, newEntry];
    
    // Update state
    setMoodLog(updatedLog);
    setHasLoggedToday(true);

    // Update localStorage
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
        <Card className="lg:col-span-1 flex flex-col">
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
                <div className="grid grid-cols-3 gap-4 place-items-center">
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
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Mood: Last 7 Days</CardTitle>
            <CardDescription>
              A visualization of your mood entries.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-64 w-full">
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
