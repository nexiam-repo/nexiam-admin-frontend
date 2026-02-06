import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Providers from "@/providers/Providers";

interface AppLayoutProps {
	children: React.ReactNode;
	// biome-ignore lint/suspicious/noExplicitAny: User type from payload
	user: any;
}

export function AppLayout({ children, user }: AppLayoutProps) {
	return (
		<Providers>
			<SidebarProvider>
				<AppSidebar user={user} />
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />
							<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem className="hidden md:block">
										<BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator className="hidden md:block" />
									<BreadcrumbItem>
										<BreadcrumbPage>Data Fetching</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>
						<div className="ml-auto px-6">
							<Link href={{ pathname: "/admin" }}>
								<Button variant="default" size="sm">
									Go to CMS Admin
								</Button>
							</Link>
						</div>
					</header>
					<div className="mx-6">{children}</div>
				</SidebarInset>
			</SidebarProvider>
		</Providers>
	);
}
