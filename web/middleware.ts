import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Exclude /preview (static Claude Design export), api, _next, _vercel, and files with extensions
  matcher: ['/((?!preview|api|_next|_vercel|.*\\..*).*)'],
};
