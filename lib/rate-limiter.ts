import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (request: NextRequest) => string; // Custom key generator
}

export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, maxRequests, keyGenerator } = config;

  const defaultKeyGenerator = (request: NextRequest): string => {
    // Use IP address or user identifier
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
    return ip;
  };

  const getKey = keyGenerator || defaultKeyGenerator;

  return async (request: NextRequest) => {
    const key = getKey(request);
    const now = Date.now();

    // Clean up expired entries
    if (store[key] && store[key].resetTime < now) {
      delete store[key];
    }

    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return null;
    }

    store[key].count++;

    if (store[key].count > maxRequests) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
      logger.warn(`Rate limit exceeded for ${key}`, { retryAfter });

      return NextResponse.json(
        { error: 'Too many requests, please try again later' },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': store[key].resetTime.toString(),
          },
        }
      );
    }

    return null;
  };
}

// Pre-configured limiters
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
});

export const leaderboardRateLimiter = createRateLimiter({
  windowMs: 10 * 1000, // 10 seconds
  maxRequests: 10, // 10 requests per 10 seconds
});

export const mintRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 mints per hour per IP
});

export const battleRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 battles per minute
});
