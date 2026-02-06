"use client";

import { BProgress } from "@bprogress/core";
import { ProgressProvider } from "@bprogress/next/app";

BProgress.configure({ indeterminate: true });

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<ProgressProvider height="4px" color="#1678A1" options={{ showSpinner: false }} shallowRouting>
			{children}
		</ProgressProvider>
	);
};

export default ProgressBarProvider;
