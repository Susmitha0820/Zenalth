
"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Palette } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme, systemTheme } = useTheme();

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


  return (
    <div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize the look and feel of your app.
        </p>
      </header>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette size={22} /> App Theme</CardTitle>
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
              {['default', 'mint', 'lavender'].map((themeName) => (
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
      </div>
    </div>
  );
}
