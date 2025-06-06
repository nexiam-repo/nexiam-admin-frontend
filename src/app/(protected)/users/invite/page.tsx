'use client';
import { useCounterStore } from '@/providers/CounterStoreProvider';

export default function InvitePage() {
  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state,
  );
  return (
    <div>
      InvitePage
      <div>
        Count: {count}
        <hr />
        <button type="button" onClick={incrementCount}>
          Increment Count
        </button>
        <button type="button" onClick={decrementCount}>
          Decrement Count
        </button>
      </div>
    </div>
  );
}
