import crypto from "crypto";

// ── LinkedIn ────────────────────────────────────────────────────────────────
// Supports both personal (LINKEDIN_PERSON_URN) and org page (LINKEDIN_ORG_URN)
export async function postToLinkedIn(title: string, excerpt: string, url: string) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const urn = process.env.LINKEDIN_ORG_URN || process.env.LINKEDIN_PERSON_URN;
  if (!token || !urn) return { skipped: true, reason: "LinkedIn credentials not configured" };

  const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: urn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: `🌿 New post: ${title}\n\n${excerpt}\n\nRead it here 👇\n${url}`,
          },
          shareMediaCategory: "ARTICLE",
          media: [
            {
              status: "READY",
              originalUrl: url,
              title: { text: title },
              description: { text: excerpt },
            },
          ],
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  });

  if (res.ok) return { success: true };
  const err = await res.text();
  console.error("[social:linkedin]", err);
  return { error: err };
}

// ── Facebook ────────────────────────────────────────────────────────────────
export async function postToFacebook(title: string, excerpt: string, url: string) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_TOKEN;
  if (!pageId || !token) return { skipped: true, reason: "Facebook credentials not configured" };

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${pageId}/feed`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `🌿 ${title}\n\n${excerpt}\n\nRead more 👇`,
        link: url,
        access_token: token,
      }),
    }
  );

  const data = await res.json();
  if (res.ok) return { success: true, postId: data.id };
  console.error("[social:facebook]", data.error?.message);
  return { error: data.error?.message };
}

// ── Twitter / X ─────────────────────────────────────────────────────────────
// Requires OAuth 1.0a user context credentials for posting tweets
function buildOAuth1Header(
  method: string,
  url: string,
  apiKey: string,
  apiSecret: string,
  accessToken: string,
  accessSecret: string
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString("hex");

  const params: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const paramString = Object.keys(params)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join("&");

  const baseString = [method, encodeURIComponent(url), encodeURIComponent(paramString)].join("&");
  const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(accessSecret)}`;
  const signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");

  params.oauth_signature = signature;

  const headerValue = Object.keys(params)
    .sort()
    .map((k) => `${encodeURIComponent(k)}="${encodeURIComponent(params[k])}"`)
    .join(", ");

  return `OAuth ${headerValue}`;
}

export async function postToTwitter(title: string, excerpt: string, url: string) {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;
  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    return { skipped: true, reason: "Twitter credentials not configured" };
  }

  const tweetText = `🌿 ${title}\n\n${excerpt.slice(0, 180)}\n\n${url}`.slice(0, 280);
  const endpoint = "https://api.twitter.com/2/tweets";
  const authHeader = buildOAuth1Header("POST", endpoint, apiKey, apiSecret, accessToken, accessSecret);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: tweetText }),
  });

  const data = await res.json();
  if (res.ok) return { success: true, tweetId: data.data?.id };
  console.error("[social:twitter]", data);
  return { error: data.detail || data.title || "Unknown error" };
}

// ── Threads ─────────────────────────────────────────────────────────────────
// Two-step: create container → publish
export async function postToThreads(title: string, excerpt: string, url: string) {
  const userId = process.env.THREADS_USER_ID;
  const token = process.env.THREADS_ACCESS_TOKEN;
  if (!userId || !token) return { skipped: true, reason: "Threads credentials not configured" };

  const text = `🌿 ${title}\n\n${excerpt}\n\n${url}`.slice(0, 500);

  // Step 1: Create container
  const createRes = await fetch(
    `https://graph.threads.net/v1.0/${userId}/threads?media_type=TEXT&text=${encodeURIComponent(text)}&access_token=${token}`,
    { method: "POST" }
  );
  const createData = await createRes.json();
  if (!createRes.ok || !createData.id) {
    console.error("[social:threads] create failed", createData);
    return { error: createData.error?.message || "Failed to create Threads container" };
  }

  // Step 2: Wait then publish (Threads requires a brief delay)
  await new Promise((r) => setTimeout(r, 5000));

  const publishRes = await fetch(
    `https://graph.threads.net/v1.0/${userId}/threads_publish?creation_id=${createData.id}&access_token=${token}`,
    { method: "POST" }
  );
  const publishData = await publishRes.json();
  if (publishRes.ok) return { success: true, postId: publishData.id };
  console.error("[social:threads] publish failed", publishData);
  return { error: publishData.error?.message || "Failed to publish to Threads" };
}
