export const MESSAGE_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30; // 30 day

// Use environment variables or localhost as fallback
const getAppUrl = (): string => {
  const url = (globalThis as any).process?.env?.NEXT_PUBLIC_URL || 
              (globalThis as any).process?.env?.NEXT_PUBLIC_VERCEL_URL ||
              'http://localhost:3000';
  return url.startsWith('http') ? url : `https://${url}`;
};

const APP_URL: string = getAppUrl();

export { APP_URL };
