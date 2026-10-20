// A/B test 50/50 sur la page d'accueil.
// - Un visiteur garde toujours la même variante (cookie 30 jours).
// - Forcer une variante pour tester : /?v=a ou /?v=b
export const config = { matcher: ['/'] };

const COOKIE = 'lfp_ab';

export default function middleware(request) {
  const url = new URL(request.url);
  const forced = (url.searchParams.get('v') || '').toLowerCase();
  const match = (request.headers.get('cookie') || '').match(/(?:^|;\s*)lfp_ab=(a|b)/);

  let variant = forced === 'a' || forced === 'b' ? forced : match ? match[1] : null;
  const isNew = !match || match[1] !== variant;
  if (!variant) variant = Math.random() < 0.5 ? 'a' : 'b';

  const target = new URL(`/variant-${variant}.html`, request.url);
  target.search = url.search; // conserve les UTM

  const headers = new Headers({ 'x-middleware-rewrite': target.toString() });
  if (isNew) {
    headers.set('set-cookie', `${COOKIE}=${variant}; Path=/; Max-Age=2592000; SameSite=Lax; Secure`);
  }
  return new Response(null, { headers });
}
