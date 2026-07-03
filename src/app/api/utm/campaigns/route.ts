import { NextRequest, NextResponse } from "next/server";
import { createUtmClient, requireUtmUser } from "@/lib/utm/server";
import { generateNaming } from "@/lib/utm/naming";
import { keysToCamel, keysToSnake } from "@/lib/utm/transform";
import { getUtmUserMap } from "@/lib/utm/users";

/* eslint-disable @typescript-eslint/no-explicit-any */

// Embeds aliased to the camelCase relation names the original Prisma app returned.
const CAMPAIGN_SELECT = `*,
  industry:utm_industries(*),
  country:utm_countries(*),
  company:utm_companies(*),
  brand:utm_brands(*),
  platform:utm_platforms(*),
  format:utm_ad_formats(*),
  buyType:utm_buy_types(*),
  campaignType:utm_campaign_types(*),
  qaReview:utm_qa_reviews(*)`;

/** Attach a resolved createdBy {name,email} and keep createdById (like Prisma). */
function withCreator(campaign: any, users: Record<string, { name: string | null; email: string | null }>) {
  const uid = campaign.createdBy as string;
  return {
    ...campaign,
    createdById: uid,
    createdBy: users[uid] ?? { name: null, email: null },
  };
}

export async function GET() {
  try {
    const supabase = await createUtmClient();
    const auth = await requireUtmUser(supabase);
    if (auth instanceof NextResponse) return auth;

    const { data, error } = await supabase
      .from("utm_campaigns")
      .select(CAMPAIGN_SELECT)
      .order("created_at", { ascending: false });
    if (error) throw error;

    const users = await getUtmUserMap();
    const campaigns = keysToCamel<any[]>(data ?? []).map((c) => withCreator(c, users));
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("UTM campaigns GET error:", error);
    return NextResponse.json({ error: "Error fetching campaigns" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createUtmClient();
    const auth = await requireUtmUser(supabase);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();

    const [industry, country, company, brand, platform, format, buyType] =
      await Promise.all([
        supabase.from("utm_industries").select("*").eq("id", body.industryId).single(),
        supabase.from("utm_countries").select("*").eq("id", body.countryId).single(),
        supabase.from("utm_companies").select("*").eq("id", body.companyId).single(),
        supabase.from("utm_brands").select("*").eq("id", body.brandId).single(),
        supabase.from("utm_platforms").select("*").eq("id", body.platformId).single(),
        supabase.from("utm_ad_formats").select("*").eq("id", body.formatId).single(),
        supabase.from("utm_buy_types").select("*").eq("id", body.buyTypeId).single(),
      ]);

    if (
      !industry.data || !country.data || !company.data || !brand.data ||
      !platform.data || !format.data || !buyType.data
    ) {
      return NextResponse.json({ error: "Invalid reference data" }, { status: 400 });
    }

    const naming = generateNaming({
      industryAbbr: industry.data.abbreviation,
      countryAbbr: country.data.abbreviation,
      companyAbbr: company.data.abbreviation,
      brandAbbr: brand.data.abbreviation,
      campaignName: body.campaignName,
      platformAbbr: platform.data.abbreviation,
      formatAbbr: format.data.abbreviation,
      buyTypeAbbr: buyType.data.abbreviation,
      dateLabel: body.dateLabel,
      segmentation: body.segmentation || "",
      pieceType: body.pieceType || "",
      pieceDifferentiator: body.pieceDifferentiator || "",
      utmSource: body.utmSourceOverride || platform.data.source,
      utmMedium: body.utmMediumOverride || platform.data.medium,
      destinationUrl: body.destinationUrl || "",
    });

    const insertData = keysToSnake({
      industryId: body.industryId,
      countryId: body.countryId,
      companyId: body.companyId,
      brandId: body.brandId,
      platformId: body.platformId,
      formatId: body.formatId,
      buyTypeId: body.buyTypeId,
      campaignTypeId: body.campaignTypeId || null,
      campaignName: body.campaignName,
      dateLabel: body.dateLabel,
      segmentation: body.segmentation || "",
      pieceType: body.pieceType || "",
      pieceDifferentiator: body.pieceDifferentiator || "",
      utmSourceOverride: body.utmSourceOverride || null,
      utmMediumOverride: body.utmMediumOverride || null,
      destinationUrl: body.destinationUrl || "",
      startDate: body.startDate || null,
      endDate: body.endDate || null,
      namingCampaign: naming.namingCampaign,
      namingAdGroup: naming.namingAdGroup,
      namingPiece: naming.namingPiece,
      utmString: naming.utmString,
      fullUrl: naming.fullUrl,
      createdBy: auth.userId,
    });

    const { data: campaign, error: insertErr } = await supabase
      .from("utm_campaigns")
      .insert(insertData)
      .select(CAMPAIGN_SELECT)
      .single();
    if (insertErr) throw insertErr;

    // 1:1 QA review row (starts PENDING via column defaults).
    const { error: qaErr } = await supabase
      .from("utm_qa_reviews")
      .insert({ campaign_id: campaign.id });
    if (qaErr) throw qaErr;

    const users = await getUtmUserMap();
    return NextResponse.json(withCreator(keysToCamel<any>(campaign), users), { status: 201 });
  } catch (error) {
    console.error("UTM campaigns POST error:", error);
    return NextResponse.json({ error: "Error creating campaign" }, { status: 500 });
  }
}
