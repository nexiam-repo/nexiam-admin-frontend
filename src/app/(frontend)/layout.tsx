import type React from "react";
import "./styles.css";
import config from "@payload-config";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import { AuthInit } from "@/components/auth-init";
import { AppLayout } from "@/components/layout/AppLayout";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	description: "A blank template using Payload in a Next.js app.",
	title: "Payload Blank Template",
};

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const payload = await getPayload({ config });
	const { user } = await payload.auth({ headers: await headers() });
	if (!user) {
		const currentPath = (await headers()).get("x-pathname") || "/";
		redirect(`/admin/login?redirect=${encodeURIComponent(currentPath)}`);
	}

	const cookieStore = await cookies();
	const token = cookieStore.get("payload-token")?.value || "";

	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<main>
					<AuthInit token={token} />
					<AppLayout user={user}>{children}</AppLayout>
				</main>
			</body>
		</html>
	);
}
