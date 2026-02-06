"use client";
import type React from "react";

export const GoToNexhubAdmin: React.FC = () => {
	return (
		<a
			href="/"
			style={{
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				height: "34px",
				padding: "0 12px",
				marginRight: "8px",
				fontSize: "13px",
				fontWeight: "500",
				textDecoration: "none",
				color: "var(--theme-elevation-900)",
				backgroundColor: "var(--theme-elevation-150)",
				border: "1px solid var(--theme-elevation-300)",
				borderRadius: "4px",
				transition: "all 0.2s ease",
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.backgroundColor = "var(--theme-elevation-250)";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.backgroundColor = "var(--theme-elevation-150)";
			}}
		>
			Go to Nexhub Admin
		</a>
	);
};
