import { NextRequest, NextResponse } from "next/server";
import { createUtmClient, requireUtmUser } from "@/lib/utm/server";
import { keysToCamel, keysToSnake } from "@/lib/utm/transform";
import {
  MASTER_DATA_TABLES,
  type MasterDataCategory,
} from "@/lib/utm/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

const CATEGORIES = Object.keys(MASTER_DATA_TABLES) as MasterDataCategory[];

function tableFor(category: string | null): string | null {
  if (category && category in MASTER_DATA_TABLES) {
    return MASTER_DATA_TABLES[category as MasterDataCategory];
  }
  return null;
}

// GET: all master data, or a single category
export async function GET(request: NextRequest) {
  try {
    const supabase = await createUtmClient();
    const auth = await requireUtmUser(supabase);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const table = tableFor(category);

    if (category && table) {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return NextResponse.json({ [category]: keysToCamel(data ?? []) });
    }

    const results = await Promise.all(
      CATEGORIES.map((cat) =>
        supabase
          .from(MASTER_DATA_TABLES[cat])
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
      )
    );

    const payload: Record<string, any> = {};
    CATEGORIES.forEach((cat, i) => {
      const { data, error } = results[i];
      if (error) throw error;
      payload[cat] = keysToCamel(data ?? []);
    });
    return NextResponse.json(payload);
  } catch (error) {
    console.error("UTM master-data GET error:", error);
    return NextResponse.json({ error: "Error fetching master data" }, { status: 500 });
  }
}

// POST: create an item (admin + editor)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createUtmClient();
    const auth = await requireUtmUser(supabase);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { category, ...data } = body;
    const table = tableFor(category);
    if (!table) return NextResponse.json({ error: "Invalid category" }, { status: 400 });

    const { data: item, error } = await supabase
      .from(table)
      .insert(keysToSnake(data))
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json(keysToCamel(item), { status: 201 });
  } catch (error) {
    console.error("UTM master-data POST error:", error);
    return NextResponse.json({ error: "Error creating item" }, { status: 500 });
  }
}

// PUT: update an item (admin + editor)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createUtmClient();
    const auth = await requireUtmUser(supabase);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { category, id, ...data } = body;
    const table = tableFor(category);
    if (!table || !id) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const { data: item, error } = await supabase
      .from(table)
      .update(keysToSnake(data))
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json(keysToCamel(item));
  } catch (error) {
    console.error("UTM master-data PUT error:", error);
    return NextResponse.json({ error: "Error updating item" }, { status: 500 });
  }
}

// DELETE: remove an item (admin + editor)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createUtmClient();
    const auth = await requireUtmUser(supabase);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const id = searchParams.get("id");
    const table = tableFor(category);
    if (!table || !id) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      // FK violation → item is referenced by a campaign.
      return NextResponse.json(
        { error: "Cannot delete item. It may be in use." },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("UTM master-data DELETE error:", error);
    return NextResponse.json({ error: "Error deleting item" }, { status: 500 });
  }
}
