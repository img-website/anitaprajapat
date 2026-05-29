function parseCountValue(value) {
  if (value === null || value === undefined) return "";
  const numeric = Number(String(value).replace(/[^\d.]/g, ""));
  if (!Number.isFinite(numeric) || numeric < 0) return "";
  return String(Math.round(numeric));
}

function parseYouTubeChannelId(input) {
  if (!input) return "";
  const raw = String(input).trim();
  if (!raw) return "";
  if (/^UC[\w-]{20,}$/.test(raw)) return raw;
  try {
    const url = new URL(raw);
    const directId = url.searchParams.get("channel_id");
    if (directId && /^UC[\w-]{20,}$/.test(directId)) return directId;
    if (url.pathname.startsWith("/channel/")) {
      const id = url.pathname.split("/")[2];
      if (/^UC[\w-]{20,}$/.test(id)) return id;
    }
  } catch {
    return "";
  }
  return "";
}

async function getYouTubeSubscribers({ apiKey, channelId }) {
  if (!apiKey || !channelId) return null;
  const endpoint = new URL("https://www.googleapis.com/youtube/v3/channels");
  endpoint.searchParams.set("part", "statistics");
  endpoint.searchParams.set("id", channelId);
  endpoint.searchParams.set("key", apiKey);
  const res = await fetch(endpoint.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`YouTube API failed (${res.status})`);
  const data = await res.json();
  const subscribers = data?.items?.[0]?.statistics?.subscriberCount;
  const parsed = parseCountValue(subscribers);
  return parsed || null;
}

async function getInstagramFollowers({ userId, accessToken }) {
  if (!userId || !accessToken) return null;
  const endpoint = new URL(`https://graph.facebook.com/v20.0/${userId}`);
  endpoint.searchParams.set("fields", "followers_count");
  endpoint.searchParams.set("access_token", accessToken);
  const res = await fetch(endpoint.toString(), { cache: "no-store" });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || `Instagram API failed (${res.status})`);
  }
  const data = await res.json();
  if (data?.error) throw new Error(data.error.message || "Instagram API error");
  const parsed = parseCountValue(data?.followers_count);
  return parsed || null;
}

async function getFacebookFollowers({ pageId, accessToken }) {
  if (!pageId || !accessToken) return null;
  const endpoint = new URL(`https://graph.facebook.com/v20.0/${pageId}`);
  endpoint.searchParams.set("fields", "followers_count,fan_count");
  endpoint.searchParams.set("access_token", accessToken);
  const res = await fetch(endpoint.toString(), { cache: "no-store" });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || `Facebook API failed (${res.status})`);
  }
  const data = await res.json();
  if (data?.error) throw new Error(data.error.message || "Facebook API error");
  const parsed = parseCountValue(data?.followers_count ?? data?.fan_count);
  return parsed || null;
}

export async function fetchSocialCounters(settings = {}) {
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  const youtubeChannelId =
    process.env.YOUTUBE_CHANNEL_ID || parseYouTubeChannelId(settings?.social?.youtube);
  const instagramUserId = process.env.INSTAGRAM_USER_ID;
  const instagramToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const facebookPageId = process.env.FACEBOOK_PAGE_ID;
  const facebookToken = process.env.FACEBOOK_ACCESS_TOKEN;

  const nextCounters = { ...(settings?.counters || {}) };
  const report = {
    youtubeSubscribers: "skipped",
    instagramFollowers: "skipped",
    facebookFollowers: "skipped",
  };

  try {
    const value = await getYouTubeSubscribers({ apiKey: youtubeApiKey, channelId: youtubeChannelId });
    if (value) {
      nextCounters.youtubeSubscribers = value;
      report.youtubeSubscribers = "updated";
    } else {
      report.youtubeSubscribers = "missing_config";
    }
  } catch (err) {
    report.youtubeSubscribers = err.message;
  }

  try {
    const value = await getInstagramFollowers({ userId: instagramUserId, accessToken: instagramToken });
    if (value) {
      nextCounters.instagramFollowers = value;
      report.instagramFollowers = "updated";
    } else {
      report.instagramFollowers = "missing_config";
    }
  } catch (err) {
    report.instagramFollowers = err.message;
  }

  try {
    const value = await getFacebookFollowers({ pageId: facebookPageId, accessToken: facebookToken });
    if (value) {
      nextCounters.facebookFollowers = value;
      report.facebookFollowers = "updated";
    } else {
      report.facebookFollowers = "missing_config";
    }
  } catch (err) {
    report.facebookFollowers = err.message;
  }

  return { counters: nextCounters, report };
}
