
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

);

export async function GetBookings(req: Request) {
    const { data, error } = await supabase

        .from("session-table")
        .select("*");


    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.log(data)
    return data;
}