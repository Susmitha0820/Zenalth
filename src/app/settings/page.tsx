
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Palette, Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [language, setLanguage] = useState("English");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLanguage = localStorage.getItem("chatLanguage") || "English";
    setLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("chatLanguage", newLanguage);
  };

  // The actual theme value, considering system preference for the 'system' option
  const currentTheme = theme === "system" ? systemTheme : theme;
  const currentBaseTheme = currentTheme?.replace("-dark", "");

  const handleThemeChange = (newTheme: string) => {
    // If current mode is dark, append '-dark' to the new theme
    const isDark = currentTheme?.endsWith('-dark');
    if (isDark && newTheme !== 'default') {
      setTheme(`${newTheme}-dark`);
    } else {
      setTheme(newTheme);
    }
  };

  const toggleDarkMode = () => {
    const isDark = currentTheme?.endsWith('-dark');
    const baseTheme = currentBaseTheme === 'default' ? '' : currentBaseTheme;

    if (isDark) {
      // Switch to light mode
      setTheme(baseTheme || "default");
    } else {
      // Switch to dark mode
      setTheme(`${baseTheme || 'default'}-dark`);
    }
  };

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize the look, feel, and language of your app.
        </p>
      </header>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette size={22} className="text-primary"/> App Theme</CardTitle>
            <CardDescription>
              Choose a color palette that feels most comfortable to you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <RadioGroup
              value={currentBaseTheme}
              onValueChange={handleThemeChange}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {['default', 'mint', 'lavender', 'peach', 'sunset'].map((themeName) => (
                <Label
                  key={themeName}
                  htmlFor={themeName}
                  className="block p-4 rounded-lg border cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={themeName} id={themeName} />
                    <span className="font-medium capitalize">{themeName}</span>
                  </div>
                </Label>
              ))}
            </RadioGroup>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <p className="font-medium">Dark Mode</p>
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full hover:bg-muted"
                    aria-label="Toggle dark mode"
                >
                    {currentTheme?.endsWith('-dark') ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Languages size={22} className="text-primary"/> Language</CardTitle>
            <CardDescription>
              Choose the language for your conversations with the AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi (हिन्दी)</SelectItem>
                  <SelectItem value="Telugu">Telugu (తెలుగు)</SelectItem>
                  <SelectItem value="Marathi">Marathi (मराठी)</SelectItem>
                  <SelectItem value="Tamil">Tamil (தமிழ்)</SelectItem>
                  <SelectItem value="Bengali">Bengali (বাংলা)</SelectItem>
                  <SelectItem value="Gujarati">Gujarati (ગુજરાતી)</SelectItem>
                  <SelectItem value="Kannada">Kannada (ಕನ್ನಡ)</SelectItem>
                  <SelectItem value="Malayalam">Malayalam (മലയാളം)</SelectItem>
                  <SelectItem value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</SelectItem>
                </SelectContent>
              </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
