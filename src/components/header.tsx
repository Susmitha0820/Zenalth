"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  MessageSquare,
  Smile,
  BookUser,
  LifeBuoy,
  Settings,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Chat", icon: MessageSquare },
  { href: "/mood-tracker", label: "Mood Tracker", icon: Smile },
  { href: "/journal", label: "Journal", icon: BookUser },
  { href: "/resources", label: "Resources", icon: LifeBuoy },
];

export function Header() {
  const pathname = usePathname();

  const renderNavLinks = (isMobile = false) =>
    navItems.map((item) => {
      const LinkComponent = (
        <Link
          href={item.href}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
            isMobile && "text-base"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      );
      return isMobile ? <SheetClose asChild key={item.href}>{LinkComponent}</SheetClose> : <div key={item.href}>{LinkComponent}</div>;
    });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-[var(--header-height)] max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Heart className="text-primary-foreground h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">Zenalth</h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {renderNavLinks()}
        </nav>

        <div className="flex items-center gap-2">
           <Link href="/settings" className={cn(
             "hidden md:flex items-center justify-center rounded-md h-9 w-9",
             pathname === "/settings"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
           )}>
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
            </Link>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-4 p-4">
                  <Link href="/" className="flex items-center gap-2 mb-4">
                     <div className="bg-primary p-2 rounded-lg">
                        <Heart className="text-primary-foreground h-5 w-5" />
                     </div>
                     <h2 className="text-lg font-semibold tracking-tight">Zenalth</h2>
                  </Link>
                  <nav className="flex flex-col gap-2">
                    {renderNavLinks(true)}
                  </nav>
                   <SheetClose asChild>
                     <Link href="/settings" className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium",
                        pathname === "/settings"
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                      )}>
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                     </Link>
                   </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
