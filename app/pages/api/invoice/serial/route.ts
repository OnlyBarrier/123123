import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { calculateTax } from "@/utils/calculateTax";
import { sumNumbersInString } from "@/utils/sumNumbersInString";
import { prismaConnect } from "@/utils/prismaConnect";
import { eInvoice } from "@/utils/eInvoice";

export const GET = async (req: NextRequest, res: NextResponse) => {
  const invoice = await prisma.$queryRaw`
  SELECT * 
  FROM "Invoice" 
  ORDER BY serial::text DESC 
  LIMIT 1
`;
  if (Array.isArray(invoice) && invoice.length > 0) {
    const numeroCadena = parseInt(invoice[0].serial) + 1; // Convierte el número a cadena
    const longitudActual = numeroCadena.toString().length;
    const cerosFaltantes = "0".repeat(10 - longitudActual); // Calcula los ceros faltantes
    const result = cerosFaltantes + numeroCadena.toString();
    return NextResponse.json(result, { status: 200 }); 
  } else {
    return NextResponse.json("0000000001", { status: 200 }); 
  }
};
