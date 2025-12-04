import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {

  // Extract logged email from the key "email"
  const { searchParams } = new URL(request.url);
  const userMail = searchParams.get('email');
  
  // checks if mail is empty if not seessions are picked from the sessions table
  if (!userMail) {
    return NextResponse.json(
      { error: "Email parameter is required" }, 
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("session-table")
    .select("*")
    .eq("participants", userMail)  // checks if the users mail is mentioned as a participant in any session
    .order("created_at", { ascending: true })
    .limit(3);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  
  return NextResponse.json(data);
}
