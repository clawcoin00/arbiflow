// Twitter/X API integration for ArbsFlow
// Supports posting alerts to Twitter/X

import OAuth from 'oauth-1.0a';
import * as crypto from 'crypto';

const API_KEY = process.env.TWITTER_API_KEY;
const API_SECRET = process.env.TWITTER_API_SECRET;
const ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;

interface TweetResult {
  sent: boolean;
  tweetId?: string;
  url?: string;
  error?: string;
}

export async function postTweet(text: string): Promise<TweetResult> {
  if (!ACCESS_TOKEN || !ACCESS_TOKEN_SECRET || !API_KEY || !API_SECRET) {
    return { sent: false, error: 'Missing Twitter credentials' };
  }

  try {
    // OAuth 1.0a signing for Twitter API v2
    const oauthClient = new OAuth({
      consumer: { key: API_KEY, secret: API_SECRET },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
      },
    });

    const url = 'https://api.twitter.com/2/tweets';
    const method = 'POST';
    const request_data = { url, method, data: { text } };

    const authorization = oauthClient.authorize(request_data, {
      key: ACCESS_TOKEN,
      secret: ACCESS_TOKEN_SECRET,
    });

    const authHeader = oauthClient.toHeader(authorization);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader.Authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { sent: false, error: `Twitter API error: ${res.status} ${err}` };
    }

    const data = await res.json();
    const tweetId = data?.data?.id;
    return {
      sent: true,
      tweetId,
      url: `https://twitter.com/i/web/status/${tweetId}`,
    };
  } catch (error: unknown) {
    return {
      sent: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function postOpportunityAlert(
  eventKey: string,
  outcome: string,
  edge: number,
  percentEdge: number,
): Promise<TweetResult> {
  const text = `Alert ArbsFlow

${eventKey}
${outcome}
Edge: +${percentEdge.toFixed(2)}%

Cross-market opportunity detected

#ArbsFlow #Arbitrage #PredictionMarkets`;

  return postTweet(text);
}

// Simple test function
export async function testTwitterConnection(): Promise<TweetResult> {
  return postTweet('ArbsFlow is now connected to Twitter/X! Testing alert system.');
}
