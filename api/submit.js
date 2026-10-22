// Reçoit l'inscription depuis la page et la transmet au webhook Make.
const WEBHOOK_URL =
  process.env.MAKE_WEBHOOK_URL || 'https://hook.eu1.make.com/j4dhj1u33gf4zp1s1szd9orjstgr2bmi';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const email = String(body.email || '').trim();
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Email invalide' });

  const payload = {
    ...body,
    prenom: String(body.prenom || '').trim(),
    email,
    tel: String(body.tel || '').trim(),
    variant: body.variant === 'B' ? 'B' : 'A',
    submitted_at: new Date().toISOString(),
    user_agent: req.headers['user-agent'] || '',
    ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim(),
  };

  try {
    const r = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(`Make HTTP ${r.status}`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook error', err);
    return res.status(502).json({ error: 'Webhook indisponible' });
  }
}
