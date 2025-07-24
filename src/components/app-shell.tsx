
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  MessageSquare,
  BookOpen,
  BarChart2,
  PenSquare,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function AppShellContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            <Sidebar>
                <SidebarHeader>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary p-2 rounded-lg">
                      <Heart className="text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold tracking-tight">
                          GenZ Friend
                        </h2>
                    </div>
                  </div>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === "/"}
                        tooltip={{ children: "Chat" }}
                      >
                        <Link href="/">
                          <MessageSquare />
                          <span>Chat</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === "/mood-tracker"}
                        tooltip={{ children: "Mood Tracker" }}
                      >
                        <Link href="/mood-tracker">
                          <BarChart2 />
                          <span>Mood Tracker</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === "/journal"}
                        tooltip={{ children: "Journal" }}
                      >
                        <Link href="/journal">
                          <PenSquare />
                          <span>Journal</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === "/resources"}
                        tooltip={{ children: "Resources" }}
                      >
                        <Link href="/resources">
                          <BookOpen />
                          <span>Resources</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                   <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="avatar abstract" />
                        <AvatarFallback>GZ</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <p className="font-semibold text-sm">Guest User</p>
                        <p className="text-xs text-muted-foreground">Your space is private</p>
                    </div>
                   </div>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                {isClient ? (
                    <div className="absolute top-4 right-4 flex gap-2 items-center">
                        <SidebarTrigger />
                    </div>
                ) : <div className="absolute top-4 right-4 flex gap-2 items-center h-7 w-7" /> }
                {children}
            </SidebarInset>
        </>
    );
}


export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppShellContent>{children}</AppShellContent>
    </SidebarProvider>
  );
}
