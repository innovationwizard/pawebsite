const CHANNEL_ID = "UCAyj4tdAI2IXEJqy3l9xD6w"; // @PuertaAbiertaInmobiliaria
const API_KEY = process.env.YOUTUBE_API_KEY;

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  duration: string | null;
}

/**
 * Fetch latest videos from the Puerta Abierta YouTube channel.
 * Falls back to an empty array when no API key is configured.
 */
export async function getYouTubeVideos(maxResults = 12): Promise<YouTubeVideo[]> {
  if (!API_KEY) {
    console.warn("YOUTUBE_API_KEY not set — skipping YouTube fetch");
    return [];
  }

  try {
    // Step 1: Search for latest videos
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.set("key", API_KEY);
    searchUrl.searchParams.set("channelId", CHANNEL_ID);
    searchUrl.searchParams.set("part", "snippet");
    searchUrl.searchParams.set("order", "date");
    searchUrl.searchParams.set("type", "video");
    searchUrl.searchParams.set("maxResults", String(maxResults));

    const searchRes = await fetch(searchUrl.toString(), {
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!searchRes.ok) {
      console.error("YouTube search API error:", searchRes.status);
      return [];
    }

    const searchData = await searchRes.json();
    const videoIds = searchData.items?.map(
      (item: { id: { videoId: string } }) => item.id.videoId
    ) ?? [];

    if (videoIds.length === 0) return [];

    // Step 2: Get video details (duration)
    const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    detailsUrl.searchParams.set("key", API_KEY);
    detailsUrl.searchParams.set("id", videoIds.join(","));
    detailsUrl.searchParams.set("part", "contentDetails,snippet");

    const detailsRes = await fetch(detailsUrl.toString(), {
      next: { revalidate: 3600 },
    });

    if (!detailsRes.ok) {
      console.error("YouTube videos API error:", detailsRes.status);
      return [];
    }

    const detailsData = await detailsRes.json();

    return (detailsData.items ?? []).map(
      (item: {
        id: string;
        snippet: { title: string; thumbnails: { high: { url: string } }; publishedAt: string };
        contentDetails: { duration: string };
      }) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        duration: parseDuration(item.contentDetails.duration),
      })
    );
  } catch (err) {
    console.error("YouTube fetch error:", err);
    return [];
  }
}

/** Convert ISO 8601 duration (PT5M30S) to human-readable (5:30) */
function parseDuration(iso: string): string | null {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  const h = parseInt(match[1] ?? "0", 10);
  const m = parseInt(match[2] ?? "0", 10);
  const s = parseInt(match[3] ?? "0", 10);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
