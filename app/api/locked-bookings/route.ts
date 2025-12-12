import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("session-locked")
    .select("locked_session_id, room_id, starts_at, ends_at")
    .limit(3); //makes sure to only grab 3 rows from the session-locked table
    

  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

//PATCH request to update the selected locked session
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, starts_at, ends_at } = body;

  const { data } = await supabase
    .from("session-locked")
    .update({
      starts_at: starts_at,
      ends_at: ends_at,
    })
    .eq("locked_session_id", id)
    .select();

  return NextResponse.json({ data });
}