import config from "@payload-config";
import { headers as getHeaders } from "next/headers.js";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

export default async function HomePage() {
	const headers = await getHeaders();
	const payloadConfig = await config;
	const payload = await getPayload({ config: payloadConfig });
	const { user } = await payload.auth({ headers });
	if (user) {
		redirect("/dashboard");
	} else {
		redirect("/admin/");
	}
}
