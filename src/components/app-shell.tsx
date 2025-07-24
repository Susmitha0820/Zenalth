"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  MessageSquare,
  BookOpen,
  BarChart2,
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
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
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
        <div className="absolute top-4 right-4 flex gap-2 items-center">
            <SidebarTrigger />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
