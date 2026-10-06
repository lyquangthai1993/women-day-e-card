import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/I18nRouting';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(vi|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
