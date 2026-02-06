import { exec } from "node:child_process";
import { randomUUID } from "node:crypto";
import { unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { NextResponse } from "next/server";

const execAsync = promisify(exec);

export async function POST(request: Request) {
	const tempFile = join(tmpdir(), `mjml-${randomUUID()}.mjml`);

	try {
		const { mjml } = await request.json();

		if (!mjml || typeof mjml !== "string") {
			return NextResponse.json({ error: "MJML source is required" }, { status: 400 });
		}

		// Write MJML to temp file
		await writeFile(tempFile, mjml, "utf-8");

		// Run MJML CLI
		const { stdout, stderr } = await execAsync(`npx mjml "${tempFile}" -s`);

		// Clean up temp file
		await unlink(tempFile).catch(() => {});

		if (stderr && !stdout) {
			return NextResponse.json({ error: stderr, html: null }, { status: 400 });
		}

		return NextResponse.json({
			html: stdout,
			errors: stderr ? [{ message: stderr }] : [],
		});
	} catch (error) {
		// Clean up temp file on error
		await unlink(tempFile).catch(() => {});

		console.error("MJML compilation error:", error);
		return NextResponse.json({ error: `Compilation failed: ${error}` }, { status: 500 });
	}
}
