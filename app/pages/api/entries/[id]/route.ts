import prisma from "@/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const id = decodeURIComponent(
      request.nextUrl.pathname.replace("/pages/api/entries/", "")
    );
    const updatedEntry = await prisma.entry.findFirst({
      include: {
        containers: {
          include: {
            products: true,
          },
        },
      },where:{
        id,
      }
    });
    return NextResponse.json({ updatedEntry, status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error, status: 200 });
  }
}

export const PUT = async (request: NextRequest, res: Response) => {};
