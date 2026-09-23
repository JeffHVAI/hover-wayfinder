interface Env {
  MAPPEDIN_TOKEN_URL?: string;
  MAPPEDIN_KEY?: string;
  MAPPEDIN_SECRET?: string;
}

export const onRequestGet = async ({ env }: { env: Env }) => {
  try {
    if (!env.MAPPEDIN_KEY || !env.MAPPEDIN_SECRET) {
      return new Response(JSON.stringify({ error: 'MAPPEDIN_KEY or MAPPEDIN_SECRET not configured in Pages' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    const tokenUrl = env.MAPPEDIN_TOKEN_URL || 'https://auth.mappedin.com/token';
    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key: env.MAPPEDIN_KEY, secret: env.MAPPEDIN_SECRET }),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch Mappedin token', status: res.status }), {
        status: 502,
        headers: { 'content-type': 'application/json' },
      });
    }

    const data: any = await res.json();
    return new Response(
      JSON.stringify({
        accessToken: data.access_token || data.accessToken,
        expiresIn: data.expires_in || data.expiresIn || 3600,
      }),
      {
        headers: {
          'content-type': 'application/json',
          'cache-control': 'no-store',
        },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Server error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
