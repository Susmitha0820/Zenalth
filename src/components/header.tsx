
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  MessageSquare,
  Smile,
  BookUser,
  LifeBuoy,
  Settings,
  Menu,
  Sparkles,
  LogOut,
  LogIn,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { href: "/", label: "Chat", icon: MessageSquare },
  { href: "/mood-tracker", label: "Mood Tracker", icon: Smile },
  { href: "/journal", label: "Journal", icon: BookUser },
  { href: "/affirmations", label: "Affirmations", icon: Sparkles },
  { href: "/resources", label: "Resources", icon: LifeBuoy },
];

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      toast({ variant: "destructive", title: "Logout Failed", description: "Could not log you out. Please try again." });
    }
  };

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-[var(--header-height)] max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Heart className="text-primary-foreground h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">GenZ Friend</h2>
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-2">
            {renderNavLinks()}
          </nav>
        )}

        <div className="flex items-center gap-2">
           {user ? (
            <>
              <Link href="/settings" className={cn(
                "hidden md:flex items-center justify-center rounded-md h-9 w-9 transition-colors",
                pathname === "/settings"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}>
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:flex">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
           ) : (
             <div className="hidden md:flex items-center gap-2">
                <Button asChild variant="ghost">
                    <Link href="/login"><LogIn className="mr-2"/>Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                </Button>
             </div>
           )}

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 flex flex-col">
                <div className="p-4">
                  <Link href="/" className="flex items-center gap-2 mb-4 px-2">
                     <div className="bg-primary p-2 rounded-lg">
                        <Heart className="text-primary-foreground h-5 w-5" />
                     </div>
                     <h2 className="text-lg font-semibold tracking-tight">GenZ Friend</h2>
                  </Link>
                  {user && (
                    <nav className="flex flex-col gap-2">
                      {renderNavLinks(true)}
                    </nav>
                  )}
                </div>

                <div className="mt-auto p-4 border-t">
                  {user ? (
                    <div className="flex flex-col gap-2">
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
                      <SheetClose asChild>
                        <Button variant="ghost" onClick={handleLogout} className="justify-start px-3 py-2 text-base">
                          <LogOut className="h-5 w-5 mr-2" />
                          <span>Logout</span>
                        </Button>
                      </SheetClose>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                       <SheetClose asChild>
                          <Button asChild variant="default" className="w-full">
                              <Link href="/login">Login</Link>
                          </Button>
                       </SheetClose>
                       <SheetClose asChild>
                           <Button asChild variant="ghost" className="w-full">
                              <Link href="/signup">Sign Up</Link>
                           </Button>
                       </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
