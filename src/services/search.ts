import { startSearchPrices, getSearchPrices, stopSearchPrices } from '../api/api.js';
import type { StartSearchOk, PricesOk } from '../types/search';
import { pollUntilReady } from './poll';
import { DEFAULT_POLL_INTERVAL_MS } from './constants';

async function resolveResponse(p: Promise<Response>): Promise<Response> {
  try {
    const res = await p;
    return res;
  } catch (rejectedRes) {
    return rejectedRes as Response;
  }
}

export async function startCountrySearch(countryId: string): Promise<StartSearchOk> {
  const res = await resolveResponse(startSearchPrices(countryId));
  if (!res.ok) {
    const data = await res.json().catch(() => ({} as any));
    const message = (data && (data.message as string)) || `Failed to start search: ${res.status}`;
    throw new Error(message);
  }
  return (await res.json()) as StartSearchOk;
}

export async function getSearchPricesOnce(token: string): Promise<{ ok: true; data: PricesOk } | { ok: false; status: number; error?: unknown }> {
  const res = await resolveResponse(getSearchPrices(token));
  if (!res.ok) {
    const status = res.status;
    let error: unknown = undefined;
    try { error = await res.json(); } catch {}
    return { ok: false, status, error };
  }
  const data = (await res.json()) as PricesOk;
  return { ok: true, data };
}

export async function stopActiveSearch(token: string): Promise<void> {
  try {
    await stopSearchPrices(token);
  } catch {
    return;
  }
}

export async function pollPricesUntilReady(token: string, initialDelayMs = 0, intervalMs = DEFAULT_POLL_INTERVAL_MS) {
  if (initialDelayMs > 0) {
    await new Promise<void>((r) => setTimeout(r, initialDelayMs));
  }
  return await pollUntilReady(() => getSearchPricesOnce(token), intervalMs);
}


