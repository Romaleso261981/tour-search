export function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

type PollResult<T> = { ok: true; data: T } | { ok: false; status: number; error?: unknown };

export async function pollUntilReady<T>(
  getOnce: () => Promise<PollResult<T>>,
  intervalMs: number,
  isRetryStatus: (status: number) => boolean = (s) => s === 425
): Promise<T> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const res = await getOnce();
    if (res.ok) return res.data;
    if (!isRetryStatus(res.status)) {
      throw new Error('Polling failed');
    }
    await delay(intervalMs);
  }
}


