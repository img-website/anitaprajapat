import "server-only";
import { siteConfig } from "@/lib/siteConfig";
import { youtubeId, youtubeThumb, youtubeWatchUrl } from "@/utils/helpers";

/**
 * YouTube integration.
 *
 * Preferred: official Data API v3 (set YOUTUBE_API_KEY). Gives latest +
 * most-popular + playlists (categories) with real view counts.
 *
 * Fallback (no key): public RSS feed — latest videos + views, no playlists.
 *
 * Everything is cached in-process for 1 hour and fails soft (returns empties),
 * so the site never breaks if YouTube is unreachable or quota is hit.
 */

const API = "https://www.googleapis.com/youtube/v3";
const KEY = process.env.YOUTUBE_API_KEY || "";
const TTL = 1000 * 60 * 60;

let cache = { at: 0, data: null };
let resolvedChannelId = process.env.YOUTUBE_CHANNEL_ID || null;

function handleFromUrl(url = "") {
  const m = String(url).match(/@([A-Za-z0-9._-]+)/);
  return m ? m[1] : null;
}

const EMPTY = { channelId: null, latest: [], popular: [], playlists: [] };

async function jget(url) {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    // Surface the real reason (badly-restricted key, API disabled, quota…)
    let reason = "";
    try {
      const body = await res.json();
      reason = body?.error?.errors?.[0]?.reason || body?.error?.message || "";
    } catch {}
    const err = new Error(`YT ${res.status}${reason ? ` (${reason})` : ""}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

function thumb(thumbs = {}, id) {
  return (
    thumbs.maxres?.url ||
    thumbs.standard?.url ||
    thumbs.high?.url ||
    thumbs.medium?.url ||
    (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "")
  );
}

// ─── Data API path ──────────────────────────────────────────
async function resolveChannelIdApi() {
  if (resolvedChannelId) return resolvedChannelId;
  const handle = handleFromUrl(siteConfig.social.youtube);
  if (!handle) return null;
  const data = await jget(`${API}/channels?part=id&forHandle=${handle}&key=${KEY}`);
  resolvedChannelId = data.items?.[0]?.id || null;
  return resolvedChannelId;
}

async function enrichViews(videos) {
  const ids = [...new Set(videos.map((v) => v.id))].slice(0, 50);
  if (!ids.length) return videos;
  try {
    const data = await jget(`${API}/videos?part=statistics&id=${ids.join(",")}&key=${KEY}`);
    const map = Object.fromEntries(
      (data.items || []).map((i) => [i.id, parseInt(i.statistics?.viewCount || "0", 10)])
    );
    videos.forEach((v) => (v.views = map[v.id] ?? v.views ?? 0));
  } catch {}
  return videos;
}

async function fromDataApi() {
  const channelId = await resolveChannelIdApi();
  if (!channelId) return EMPTY;

  // Latest via uploads playlist
  const chan = await jget(`${API}/channels?part=contentDetails&id=${channelId}&key=${KEY}`);
  const uploads = chan.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  const latestRaw = uploads
    ? await jget(`${API}/playlistItems?part=snippet,contentDetails&maxResults=12&playlistId=${uploads}&key=${KEY}`)
    : { items: [] };
  const latest = (latestRaw.items || [])
    .map((i) => {
      const id = i.contentDetails?.videoId || i.snippet?.resourceId?.videoId;
      return {
        id,
        title: i.snippet?.title,
        thumbnail: thumb(i.snippet?.thumbnails, id),
        published: i.contentDetails?.videoPublishedAt,
        url: `https://www.youtube.com/watch?v=${id}`,
        views: 0,
      };
    })
    .filter((v) => v.id);

  // Popular via search order=viewCount
  const popRaw = await jget(
    `${API}/search?part=snippet&channelId=${channelId}&order=viewCount&type=video&maxResults=12&key=${KEY}`
  );
  const popular = (popRaw.items || [])
    .map((i) => {
      const id = i.id?.videoId;
      return {
        id,
        title: i.snippet?.title,
        thumbnail: thumb(i.snippet?.thumbnails, id),
        published: i.snippet?.publishedAt,
        url: `https://www.youtube.com/watch?v=${id}`,
        views: 0,
      };
    })
    .filter((v) => v.id);

  // Playlists (categories) — up to 6, each with up to 8 videos
  let playlists = [];
  try {
    const plRaw = await jget(
      `${API}/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=10&key=${KEY}`
    );
    const wanted = (plRaw.items || []).filter((p) => (p.contentDetails?.itemCount || 0) > 0).slice(0, 6);
    playlists = await Promise.all(
      wanted.map(async (p) => {
        const itemsRaw = await jget(
          `${API}/playlistItems?part=snippet,contentDetails&maxResults=8&playlistId=${p.id}&key=${KEY}`
        );
        const videos = (itemsRaw.items || [])
          .map((i) => {
            const id = i.contentDetails?.videoId || i.snippet?.resourceId?.videoId;
            return {
              id,
              title: i.snippet?.title,
              thumbnail: thumb(i.snippet?.thumbnails, id),
              url: `https://www.youtube.com/watch?v=${id}`,
              views: 0,
            };
          })
          .filter((v) => v.id);
        return { id: p.id, title: p.snippet?.title, count: p.contentDetails?.itemCount, videos };
      })
    );
  } catch {}

  // Enrich everything with view counts in one batched call
  await enrichViews([...latest, ...popular, ...playlists.flatMap((p) => p.videos)]);

  return { channelId, latest, popular, playlists };
}

// ─── RSS fallback (no key) ──────────────────────────────────
async function resolveChannelIdRss() {
  if (resolvedChannelId) return resolvedChannelId;
  const handle = handleFromUrl(siteConfig.social.youtube);
  if (!handle) return null;
  try {
    const res = await fetch(`https://www.youtube.com/@${handle}`, {
      headers: { "Accept-Language": "en-US,en;q=0.9", "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 86400 },
    });
    const html = await res.text();
    const m = html.match(/"channelId":"(UC[\w-]{22})"/) || html.match(/channel\/(UC[\w-]{22})/);
    resolvedChannelId = m ? m[1] : null;
    return resolvedChannelId;
  } catch {
    return null;
  }
}

function parseFeed(xml) {
  return xml
    .split("<entry>")
    .slice(1)
    .map((e) => {
      const pick = (re) => (e.match(re) || [])[1] || "";
      const id = pick(/<yt:videoId>(.*?)<\/yt:videoId>/);
      const title = pick(/<title>([\s\S]*?)<\/title>/)
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');
      return {
        id,
        title,
        published: pick(/<published>(.*?)<\/published>/),
        thumbnail: pick(/<media:thumbnail url="(.*?)"/) || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ""),
        views: parseInt(pick(/<media:statistics views="(\d+)"/) || "0", 10),
        url: `https://www.youtube.com/watch?v=${id}`,
      };
    })
    .filter((v) => v.id);
}

async function fromRss() {
  const channelId = await resolveChannelIdRss();
  if (!channelId) return EMPTY;
  const xml = await (
    await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, { next: { revalidate: 3600 } })
  ).text();
  const videos = parseFeed(xml);
  return {
    channelId,
    latest: videos.slice(0, 12),
    popular: [...videos].sort((a, b) => b.views - a.views).slice(0, 12),
    playlists: [],
  };
}

export async function getYouTubeData() {
  if (cache.data && Date.now() - cache.at < TTL) return cache.data;

  // Primary: Data API (if a key is configured). On ANY failure (403 from a
  // restricted key / disabled API / quota), transparently fall back to the
  // key-free RSS feed so the site still shows videos.
  if (KEY) {
    try {
      const data = await fromDataApi();
      cache = { at: Date.now(), data };
      return data;
    } catch (e) {
      console.warn(
        `[youtube] Data API failed (${e.message}). Falling back to RSS.` +
          " Fix: enable 'YouTube Data API v3' and remove HTTP-referrer" +
          " restrictions on the key (use 'None' or IP restriction for server use)."
      );
    }
  }

  try {
    const data = await fromRss();
    cache = { at: Date.now(), data };
    return data;
  } catch (e) {
    console.error("[youtube] RSS fallback failed:", e.message);
    return cache.data || EMPTY;
  }
}

// Back-compat alias
export const getYouTubeVideos = getYouTubeData;

/** Parse ISO 8601 duration (PT4M13S) → { seconds, label: "4:13" }. */
function parseIsoDuration(iso = "") {
  const m = String(iso).match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return { seconds: 0, label: "" };
  const h = parseInt(m[1] || "0", 10);
  const min = parseInt(m[2] || "0", 10);
  const sec = parseInt(m[3] || "0", 10);
  const seconds = h * 3600 + min * 60 + sec;
  if (!seconds) return { seconds: 0, label: "" };
  if (h > 0) {
    return {
      seconds,
      label: `${h}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`,
    };
  }
  return { seconds, label: `${min}:${String(sec).padStart(2, "0")}` };
}

let videoMetaCache = new Map();

/**
 * Fetch title, thumbnail & duration for a single YouTube URL (Data API when keyed).
 * Falls back to static thumbnail + watch URL without duration.
 */
export async function getYouTubeVideoMeta(url = "") {
  const id = youtubeId(url);
  if (!id) return null;

  const watchUrl = youtubeWatchUrl(url) || `https://www.youtube.com/watch?v=${id}`;
  const fallback = {
    id,
    title: "",
    thumbnail: youtubeThumb(url) || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    duration: "",
    url: watchUrl,
  };

  const cached = videoMetaCache.get(id);
  if (cached && Date.now() - cached.at < TTL) return cached.data;

  if (!KEY) {
    return fallback;
  }

  try {
    const data = await jget(`${API}/videos?part=snippet,contentDetails&id=${id}&key=${KEY}`);
    const item = data.items?.[0];
    if (!item) return fallback;
    const { label } = parseIsoDuration(item.contentDetails?.duration);
    const result = {
      id,
      title: item.snippet?.title || "",
      thumbnail: thumb(item.snippet?.thumbnails, id),
      duration: label,
      url: watchUrl,
    };
    videoMetaCache.set(id, { at: Date.now(), data: result });
    return result;
  } catch {
    return fallback;
  }
}
