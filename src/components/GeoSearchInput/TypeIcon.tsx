import type { GeoEntity } from '../../types/types';
export function TypeIcon({ type }: { type: GeoEntity['type'] }) {
  if (type === 'country') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20Zm-1 2.07A8 8 0 0 0 4.07 11H7c.55 0 1-.45 1-1V8c0-.55.45-1 1-1h2V4.07ZM4.07 13A8 8 0 0 0 11 19.93V16H9c-.55 0-1-.45-1-1v-2H4.07ZM13 19.93A8 8 0 0 0 19.93 13H17c-.55 0-1 .45-1 1v2h-3v3.93ZM19.93 11A8 8 0 0 0 13 4.07V7h2c.55 0 1 .45 1 1v2h3.93Z"/>
      </svg>
    );
  }
  if (type === 'city') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M3 21V8l6-3l6 3v13H3Zm8-2h2v-2h-2v2Zm-4 0h2v-2H7v2Zm4-4h2v-2h-2v2Zm-4 0h2v-2H7v2Zm12 6V10h2v11h-2Z"/>
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M3 21V5a2 2 0 0 1 2-2h9a5 5 0 0 1 5 5v13h-2v-3H5v3H3Zm2-5h12V8a3 3 0 0 0-3-3H5Zm2-6h3V7H7Zm0 4h3v-2H7Zm5-4h3V7h-3Zm0 4h3v-2h-3Z"/>
    </svg>
  );
}


