import { NextRequest, NextResponse } from "next/server";
import { createUtmClient, requireUtmUser } from "@/lib/utm/server";
import { keysToCamel, keysToSnake } from "@/lib/utm/transform";
import { getUtmUserMap } from "@/lib/utm/users";

/* eslint-disable @typescript-eslint/no-explicit-any */

// POST: create or update a QA review (upsert on campaign_id)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createUtmClient();
    const auth = await requireUtmUser(supabase);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { campaignId, ...qaData } = body;
    if (!campaignId) {
      return NextResponse.json({ error: "campaignId is required" }, { status: 400 });
    }

    // Drop non-column / relation fields the UI may echo back.
    delete qaData.id;
    delete qaData.campaign;
    delete qaData.implementedBy;
    delete qaData.reviewedBy;
    delete qaData.createdAt;
    delete qaData.updatedAt;

    const row = keysToSnake<any>({ ...qaData, campaignId });

    const { data, error } = await supabase
      .from("utm_qa_reviews")
      .upsert(row, { onConflict: "campaign_id" })
      .select("*")
      .single();
    if (error) throw error;

    return NextResponse.json(keysToCamel(data));
  } catch (error) {
    console.error("UTM QA POST error:", error);
    return NextResponse.json({ error: "Error saving QA review" }, { status: 500 });
  }
}

// GET: fetch the QA review for a campaign
export async function GET(request: NextRequest) {
  try {
    const supabase = await createUtmClient();
    const auth = await requireUtmUser(supabase);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");
    if (!campaignId) {
      return NextResponse.json({ error: "campaignId is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("utm_qa_reviews")
      .select(`*, campaign:utm_campaigns(*, brand:utm_brands(*), platform:utm_platforms(*))`)
      .eq("campaign_id", campaignId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const users = await getUtmUserMap();
    const review = keysToCamel<any>(data);
    review.implementedBy = review.implementedBy ? users[review.implementedBy] ?? null : null;
    review.reviewedBy = review.reviewedBy ? users[review.reviewedBy] ?? null : null;
    return NextResponse.json(review);
  } catch (error) {
    console.error("UTM QA GET error:", error);
    return NextResponse.json({ error: "Error fetching QA review" }, { status: 500 });
  }
}
