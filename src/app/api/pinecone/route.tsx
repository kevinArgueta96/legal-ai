import { NextRequest, NextResponse } from "next/server";
import initialConfig from "@/utils/utils";
import retrivelQaDoc from "@/utils/utils";

export async function GET(request: NextRequest) {
  try {
    //const vectorStore = await initialConfig();
    const vectorStore = await retrivelQaDoc("Cuantas horas debo de trabajar al día?");
    return NextResponse.json({ vectorStore });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
