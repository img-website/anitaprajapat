import slugify from "slugify";

export function makeSlug(text) {
  return slugify(String(text || ""), {
    lower: true,
    strict: true,
    trim: true,
  });
}

/** Extract a YouTube video id from many URL shapes. */
export function youtubeId(url = "") {
  const m = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([\w-]{11})/
  );
  return m ? m[1] : url.length === 11 ? url : null;
}

export function youtubeThumb(url) {
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export function youtubeEmbed(url) {
  const id = youtubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/** Canonical watch URL — preserves /shorts/ links when present. */
export function youtubeWatchUrl(url = "") {
  const id = youtubeId(url);
  if (!id) return null;
  if (/youtube\.com\/shorts\//i.test(url)) {
    return `https://www.youtube.com/shorts/${id}`;
  }
  return `https://www.youtube.com/watch?v=${id}`;
}

/**
 * Turn a YouTube channel URL into a one-click subscribe link.
 * Appending ?sub_confirmation=1 makes YouTube open the subscribe dialog
 * immediately, which converts visitors to subscribers far better than a
 * plain channel link.
 */
export function youtubeSubscribeUrl(channelUrl = "") {
  if (!channelUrl) return channelUrl;
  const sep = channelUrl.includes("?") ? "&" : "?";
  return `${channelUrl.replace(/\/$/, "")}${sep}sub_confirmation=1`;
}

export function formatDate(date, opts = {}) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...opts,
  });
}

export function truncate(str = "", n = 160) {
  return str.length > n ? str.slice(0, n - 1).trimEnd() + "…" : str;
}

/** Parse pagination + search params from a Request URL. */
export function parseListParams(req) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "12", 10))
  );
  return {
    page,
    limit,
    skip: (page - 1) * limit,
    q: (searchParams.get("q") || "").trim(),
    category: searchParams.get("category") || "",
    tag: searchParams.get("tag") || "",
    status: searchParams.get("status") || "",
    sort: searchParams.get("sort") || "-createdAt",
  };
}
