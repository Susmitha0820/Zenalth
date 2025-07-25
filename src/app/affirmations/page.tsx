
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Heart, Wind, Star, Zap, Moon, Sun, Bell, Edit } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { affirmations, Affirmation, AffirmationCategory } from '@/lib/affirmations';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

const categoryMeta: Record<AffirmationCategory, { icon: React.ElementType, label: string }> = {
  'Self-Love': { icon: Star, label: 'Self-Love' },
  'Mental Calm': { icon: Wind, label: 'Mental Calm' },
  'Confidence': { icon: Zap, label: 'Confidence' },
  'Tough Days': { icon: Sun, label: 'Tough Days' },
  'Sleep Time': { icon: Moon, label: 'Sleep Time' },
};

export default function AffirmationsPage() {
  const [dailyAffirmation, setDailyAffirmation] = useState<Affirmation | null>(null);
  const [activeCategory, setActiveCategory] = useState<AffirmationCategory>('Self-Love');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [journalNote, setJournalNote] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);

    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('dailyAffirmationDate');
    let affirmation;

    if (lastDate === today) {
      affirmation = JSON.parse(localStorage.getItem('dailyAffirmation') || 'null');
    } else {
      affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      localStorage.setItem('dailyAffirmation', JSON.stringify(affirmation));
      localStorage.setItem('dailyAffirmationDate', today);
    }
    setDailyAffirmation(affirmation);

    const savedFavorites = JSON.parse(localStorage.getItem('favoriteAffirmations') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const toggleFavorite = (id: number) => {
    const updatedFavorites = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteAffirmations', JSON.stringify(updatedFavorites));
    toast({
        title: favorites.includes(id) ? "Removed from Favorites" : "Added to Favorites!",
        description: "Your favorite affirmations are always here for you.",
    });
  };

  const handleReminderToggle = (checked: boolean) => {
    setReminders(checked);
    toast({
        title: checked ? "Daily Reminders ON" : "Daily Reminders OFF",
        description: checked ? "You'll receive an affirmation at 10 AM every day." : "You will no longer receive daily reminders.",
    });
  }

  const filteredAffirmations = useMemo(() => {
    return affirmations.filter((aff) => aff.category === activeCategory);
  }, [activeCategory]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Affirmations</h1>
        <p className="text-muted-foreground mt-1">
          Your daily dose of positivity to uplift your spirit.
        </p>
      </header>

      {dailyAffirmation && (
        <Card className="mb-8 bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
          <CardContent className="p-6 text-center space-y-3">
            <p className="text-sm font-semibold text-primary/80">YOUR DAILY AFFIRMATION</p>
            <p className="text-2xl font-medium text-foreground">{dailyAffirmation.text}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="Self-Love" onValueChange={(value) => setActiveCategory(value as AffirmationCategory)}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto">
          {Object.entries(categoryMeta).map(([key, { icon: Icon, label }]) => (
            <TabsTrigger key={key} value={key} className="py-2 gap-2">
              <Icon className="w-4 h-4" /> {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-6">
          {Object.keys(categoryMeta).map((key) => (
             <TabsContent key={key} value={key}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredAffirmations.map((affirmation) => (
                    <Card key={affirmation.id} className="flex flex-col">
                      <CardContent className="p-6 flex-grow flex flex-col justify-center items-center text-center">
                        <p className="text-lg font-medium text-foreground">{affirmation.text}</p>
                      </CardContent>
                      <div className="p-2 border-t flex justify-end">
                         <Button variant="ghost" size="icon" onClick={() => toggleFavorite(affirmation.id)}>
                            <Heart className={cn("w-5 h-5", favorites.includes(affirmation.id) ? "text-red-500 fill-current" : "text-muted-foreground")} />
                         </Button>
                      </div>
                    </Card>
                  ))}
                </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
      
      <div className="grid gap-6 md:grid-cols-2 mt-8">
          <Card>
              <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                      <Label htmlFor="reminder-toggle" className="font-semibold flex items-center gap-2"><Bell /> Daily Reminder</Label>
                      <p className="text-sm text-muted-foreground">Receive one affirmation daily at 10 AM.</p>
                  </div>
                  <Switch id="reminder-toggle" checked={reminders} onCheckedChange={handleReminderToggle} />
              </CardContent>
          </Card>
           <Card>
              <CardContent className="p-6 space-y-3">
                 <Label htmlFor="journal-note" className="font-semibold flex items-center gap-2"><Edit /> How do you feel?</Label>
                 <Textarea 
                    id="journal-note" 
                    placeholder="After reading this, I feel..." 
                    value={journalNote} 
                    onChange={(e) => setJournalNote(e.target.value)}
                    rows={1}
                 />
              </CardContent>
          </Card>
      </div>

    </div>
  );
}
