"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

import { type CounterStore, createCounterStore, initCounterStore } from "@/stores/counter-store";

export type CounterStoreApi = ReturnType<typeof createCounterStore>;

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(undefined);

export interface CounterStoreProviderProps {
	children: ReactNode;
}

export const CounterStoreProvider = ({ children }: CounterStoreProviderProps) => {
	const storeRef = useRef<CounterStoreApi | null>(null);
	if (storeRef.current === null) {
		storeRef.current = createCounterStore(initCounterStore());
	}

	return (
		<CounterStoreContext.Provider value={storeRef.current}>{children}</CounterStoreContext.Provider>
	);
};

export const useCounterStore = <T,>(selector: (store: CounterStore) => T): T => {
	const counterStoreContext = useContext(CounterStoreContext);

	if (!counterStoreContext) {
		throw new Error(`useCounterStore must be used within CounterStoreProvider`);
	}

	return useStore(counterStoreContext, selector);
};

// // Pro Tip for "real SSR" in Next.js
// For true SSR (or RSC integration), you might want to:
// Pass server-provided initial state as a prop to your provider (from a page/layout, or via cookies/headers)

// // In server component
// <CounterStoreProvider initialState={stateFromServer}>{children}</CounterStoreProvider>

// And then use it as:
// export const CounterStoreProvider = ({ children, initialState }) => {
//   // ...
//   if (storeRef.current === null) {
//     storeRef.current = createCounterStore(initialState ?? defaultInitState)
//   }
//   // ...
// }
