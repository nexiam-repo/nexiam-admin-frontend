'use client';

import {
  AudioWaveform,
  Building2,
  Command,
  GalleryVerticalEnd,
  Handshake,
  LifeBuoy,
  Settings2,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Users',
      url: '/users',
      icon: Users,
      items: [
        { title: 'User Directory', url: '/users' },
        { title: 'Admins & Roles', url: '/users/roles' },
        { title: 'Invitations', url: '/users/invite' },
        { title: 'Activity Logs', url: '/users/logs' },
      ],
    },
    {
      title: 'Businesses',
      url: '/businesses',
      icon: Building2,
      items: [
        { title: 'All Businesses', url: '/businesses' },
        { title: 'Onboarding', url: '/businesses/onboarding' },
        { title: 'Usage', url: '/businesses/usage' },
      ],
    },
    {
      title: 'Partners',
      url: '/partners',
      icon: Handshake,
      items: [
        { title: 'All Partners', url: '/partners' },
        { title: 'Partner Programs', url: '/partners/programs' },
        { title: 'Invitations', url: '/partners/invitations' },
      ],
    },
    {
      title: 'Support',
      url: '/support',
      icon: LifeBuoy,
      items: [
        { title: 'Tickets', url: '/support/tickets' },
        { title: 'Knowledge Base', url: '/support/kb' },
        { title: 'Contact', url: '/support/contact' },
      ],
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2,
      items: [
        { title: 'App Config', url: '/settings/app' },
        { title: 'API Keys', url: '/settings/api' },
        { title: 'Branding', url: '/settings/branding' },
      ],
    },
  ],
  // projects: [
  //   {
  //     name: 'Design Engineering',
  //     url: '#',
  //     icon: Frame,
  //   },
  //   {
  //     name: 'Sales & Marketing',
  //     url: '#',
  //     icon: PieChart,
  //   },
  //   {
  //     name: 'Travel',
  //     url: '#',
  //     icon: Map,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Nexiam</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
