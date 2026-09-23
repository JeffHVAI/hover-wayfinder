export const onRequestPost = async ({ request }: { request: Request }) => {
  try {
    const payload = await request.json();
    console.log('[PROBE EVENT LOG RECEIVED]', JSON.stringify(payload, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        receivedAt: new Date().toISOString(),
        entriesCount: Array.isArray(payload.logs) ? payload.logs.length : 0,
      }),
      {
        headers: { 'content-type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || 'Invalid probe payload' }),
      {
        status: 400,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
};
