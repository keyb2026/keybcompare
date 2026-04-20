
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const runtime = "nodejs";

function toAbsolute(base: string, value?: string | null) {
  if (!value) return null;
  try {
    const cleaned = value.split(",")[0].trim().split(" ")[0].trim();
    return new URL(cleaned, base).toString();
  } catch {
    return null;
  }
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function scoreCandidate(url: string, context: string, modelWords: string[]) {
  let score = 0;
  const lowerUrl = url.toLowerCase();
  const lowerContext = context.toLowerCase();
  if (/product|keyboard|gallery|hero|feature|front|main|black|wireless|gaming/.test(lowerUrl)) score += 8;
  if (/logo|icon|sprite|banner|thumb|favicon|payment|flag/.test(lowerUrl)) score -= 20;
  if (/\.webp|\.png|\.jpg|\.jpeg/.test(lowerUrl)) score += 4;
  if (/keyboard/.test(lowerContext)) score += 6;
  if (/front|main|hero|wireless|gaming/.test(lowerContext)) score += 3;
  for (const word of modelWords) {
    if (word.length < 2) continue;
    if (lowerUrl.includes(word)) score += 3;
    if (lowerContext.includes(word)) score += 5;
  }
  return score;
}

function extractFromJsonStrings(html: string) {
  const urls = new Set<string>();
  const patterns = [
    /"image"\s*:\s*"(https?:\\/\\/[^"\\]+(?:png|jpg|jpeg|webp)[^"\\]*)"/gi,
    /"src"\s*:\s*"(https?:\\/\\/[^"\\]+(?:png|jpg|jpeg|webp)[^"\\]*)"/gi,
    /(https?:\/\/[^"'\s<>]+(?:png|jpg|jpeg|webp)[^"'\s<>]*)/gi,
  ];
  for (const pattern of patterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(html)) !== null) {
      urls.add(match[1].replace(/\\\//g, "/"));
    }
  }
  return Array.from(urls);
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const model = req.nextUrl.searchParams.get("model") ?? "";
  if (!url) return NextResponse.json({ imageUrl: null }, { status: 400 });

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; KBcompareBot/1.0; +https://kbcompare.vercel.app)",
        "accept-language": "en-GB,en;q=0.9",
      },
      next: { revalidate: 86400 },
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const modelWords = normalizeText(model).split(" ").filter(Boolean);
    const candidates: Array<{ url: string; score: number }> = [];
    const seen = new Set<string>();

    const push = (candidateUrl: string | null, context = "") => {
      if (!candidateUrl || seen.has(candidateUrl)) return;
      seen.add(candidateUrl);
      candidates.push({ url: candidateUrl, score: scoreCandidate(candidateUrl, context, modelWords) });
    };

    push(toAbsolute(url, $('meta[property="og:image"]').attr("content")), "og image");
    push(toAbsolute(url, $('meta[name="twitter:image"]').attr("content")), "twitter image");
    push(toAbsolute(url, $('link[rel="image_src"]').attr("href")), "link image");

    $("img").each((_, el) => {
      const node = $(el);
      const src = toAbsolute(url, node.attr("src") || node.attr("data-src") || node.attr("data-lazy-src") || node.attr("data-original-src") || node.attr("srcset"));
      const context = [node.attr("alt"), node.attr("title"), node.attr("class"), node.parent().text().slice(0, 200)].filter(Boolean).join(" ");
      push(src, context);
    });

    for (const found of extractFromJsonStrings(html)) {
      push(toAbsolute(url, found), found);
    }

    candidates.sort((a, b) => b.score - a.score);
    const best = candidates.find((candidate) => candidate.score > 0)?.url ?? candidates[0]?.url ?? null;

    return NextResponse.json(
      { imageUrl: best, candidatesTried: candidates.slice(0, 5) },
      { headers: { "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800" } }
    );
  } catch (error) {
    return NextResponse.json({ imageUrl: null, error: String(error) }, { status: 200 });
  }
}
