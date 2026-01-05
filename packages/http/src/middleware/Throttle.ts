import { Request } from '../request';

const hits = new Map<string, { count: number, resetAt: number }>();

/**
 * Throttle middleware factory.
 * 
 * @param limit Number of requests allowed per window
 * @param minutes Time window in minutes
 */
export const throttle = (limit: number, minutes: number) => {
  return async (req: Request, next: () => Promise<Response>) => {
    const ip = req.ip() || '127.0.0.1';
    const key = `throttle:${ip}:${req.url()}`; // Throttle per IP and URL
    const now = Date.now();
    
    let hit = hits.get(key);
    
    // If no hit or expired, reset
    if (!hit || now > hit.resetAt) {
      hit = { count: 0, resetAt: now + minutes * 60 * 1000 };
    }
    
    hit.count++;
    hits.set(key, hit);
    
    if (hit.count > limit) {
      const waitTime = Math.ceil((hit.resetAt - now) / 1000);
      
      return new Response(JSON.stringify({
          message: 'Too Many Requests',
          retry_after_seconds: waitTime
      }), { 
        status: 429,
        headers: {
            'Content-Type': 'application/json',
            'Retry-After': waitTime.toString(),
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(hit.resetAt / 1000).toString()
        }
      });
    }
    
    const response = await next();
    
    // Add rate limit headers to successful response
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, limit - hit.count).toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(hit.resetAt / 1000).toString());
    
    return response;
  }
}
