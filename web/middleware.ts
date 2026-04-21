import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(en|ru|id|th|vi|pt)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
