"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

export const MJMLPreview: React.FC<{
	fieldName: string;
	placeholders: Record<string, string>;
}> = ({ fieldName, placeholders }) => {
	const [html, setHtml] = useState<string>("");
	const [error, setError] = useState<string | null>(null);

	const mjmlBrowserRef = useRef<((mjml: string) => { html: string }) | null>(null);
	const lastCompiledRef = useRef<string>("");
	const fallbackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const isConnectedRef = useRef<boolean>(false);

	useEffect(() => {
		// Reset connection state on mount
		isConnectedRef.current = false;

		// 1. Load MJML Browser only on the client
		import("mjml-browser").then((m) => {
			mjmlBrowserRef.current = m.default;
			// Force compile in case listeners attached before compiler was ready
			// biome-ignore lint/suspicious/noExplicitAny: Accessing global monaco instance
			const monaco = (window as any).monaco;
			if (monaco?.editor?.getEditors) {
				// biome-ignore lint/suspicious/noExplicitAny: Monaco editor instance
				monaco.editor.getEditors().forEach((editor: any) => {
					compile(editor.getValue());
				});
			}
			const el = document.querySelector(`textarea[name="${fieldName}"]`) as HTMLTextAreaElement;
			if (el) compile(el.value);
		});

		const compile = (mjml: string) => {
			if (!mjmlBrowserRef.current || !mjml || mjml === lastCompiledRef.current) return;
			if (!mjml.includes("<mjml>") || !mjml.includes("</mjml>")) return; // Basic validation

			try {
				const result = mjmlBrowserRef.current(mjml);
				let processedHtml = result.html;

				Object.entries(placeholders).forEach(([key, val]) => {
					processedHtml = processedHtml.replace(new RegExp(`{{${key}}}`, "g"), val);
				});

				setHtml(processedHtml);
				lastCompiledRef.current = mjml;
				setError(null);
			} catch (e: unknown) {
				setError(e instanceof Error ? e.message : "Unknown error");
			}
		};

		// Self-cleaning: Clear the fallback interval once connected
		const clearFallbackInterval = () => {
			if (fallbackIntervalRef.current) {
				clearInterval(fallbackIntervalRef.current);
				fallbackIntervalRef.current = null;
			}
		};

		const attachListeners = (): boolean => {
			// If already connected, don't re-attach
			if (isConnectedRef.current) return true;

			// Find the Monaco Editor instance if it exists
			const monaco = (
				window as unknown as {
					monaco?: {
						editor?: {
							getEditors?: () => Array<{
								getValue: () => string;
								onDidChangeModelContent: (cb: () => void) => void;
							}>;
						};
					};
				}
			).monaco;

			// Look for the textarea Payload uses
			const el = document.querySelector(`textarea[name="${fieldName}"]`) as HTMLTextAreaElement;

			let connected = false;

			if (el) {
				compile(el.value);
				el.addEventListener("input", (e) => compile((e.target as HTMLTextAreaElement).value));
				connected = true;
			}

			// If Monaco is present, use its event listener (Superior to polling!)
			if (monaco?.editor?.getEditors) {
				const editors = monaco.editor.getEditors();
				editors.forEach((editor) => {
					// Compile initial value
					const value = editor.getValue();
					if (value) compile(value);
					// Listen for changes
					editor.onDidChangeModelContent(() => compile(editor.getValue()));
				});
				if (editors.length > 0) connected = true;
			}

			// If successfully connected, clear the fallback interval
			if (connected) {
				isConnectedRef.current = true;
				clearFallbackInterval();
			}

			return connected;
		};

		// 2. Setup MutationObserver to wait for the Tab to mount the fields
		const observer = new MutationObserver(() => {
			attachListeners();
		});
		observer.observe(document.body, { childList: true, subtree: true });

		// 3. Fallback: Slow Poll (Every 2 seconds) - Self-cleans once connected
		fallbackIntervalRef.current = setInterval(() => {
			// Try to attach listeners
			const connected = attachListeners();

			// If not connected yet, try manual compile from DOM
			if (!connected) {
				const el = document.querySelector(`textarea[name="${fieldName}"]`) as HTMLTextAreaElement;
				if (el) compile(el.value);

				// Also try Monaco API as fallback
				const monaco = (
					window as unknown as {
						monaco?: {
							editor?: {
								getEditors?: () => Array<{ getValue: () => string }>;
							};
						};
					}
				).monaco;

				if (monaco?.editor?.getEditors) {
					const editors = monaco.editor.getEditors();
					for (const editor of editors) {
						const value = editor.getValue();
						if (value?.includes("<mjml>")) {
							compile(value);
							break;
						}
					}
				}
			}
		}, 2000);

		// Initial attempt to attach listeners
		attachListeners();

		// Cleanup on unmount
		return () => {
			observer.disconnect();
			clearFallbackInterval();
			isConnectedRef.current = false;
		};
	}, [fieldName, placeholders]);

	return (
		<div style={{ marginTop: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
			<div
				style={{
					background: "#f3f4f6",
					padding: "8px 12px",
					fontSize: "11px",
					fontWeight: "bold",
				}}
			>
				📧 LIVE MJML PREVIEW
			</div>
			{error && <div style={{ padding: "10px", color: "red", fontSize: "12px" }}>{error}</div>}
			<iframe
				srcDoc={
					html ||
					'<html><body><p style="padding:20px; color:#999;">Type MJML to see preview...</p></body></html>'
				}
				style={{ width: "100%", minHeight: "500px", border: "none", background: "white" }}
				title="Email Preview"
			/>
		</div>
	);
};

// Exports for your Config
export const WaitingListPreview = () => (
	<MJMLPreview fieldName="waitingListMjml" placeholders={{ email: "user@example.com" }} />
);

export const ContactFormPreview = () => (
	<MJMLPreview
		fieldName="contactFormMjml"
		placeholders={{
			name: "John",
			email: "john@example.com",
			message: "Hello from the contact form!",
		}}
	/>
);
