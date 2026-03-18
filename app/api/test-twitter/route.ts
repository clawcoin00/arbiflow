import { testTwitterConnection } from '@/src/lib/twitter';

export async function POST() {
  const result = await testTwitterConnection();
  return Response.json({ ok: result.sent, ...result });
}

export async function GET() {
  // Simple health check
  return Response.json({
    ok: true,
    configured: !!(
      process.env.TWITTER_BEARER_TOKEN &&
      process.env.TWITTER_API_KEY &&
      process.env.TWITTER_API_SECRET &&
      process.env.TWITTER_ACCESS_TOKEN &&
      process.env.TWITTER_ACCESS_TOKEN_SECRET
    ),
  });
}