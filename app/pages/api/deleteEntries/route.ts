import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: Request, res: NextResponse) => {
  try {
    // Eliminar todos los datos de la tabla 'product'
    await prisma.product.deleteMany();

    // Eliminar todos los datos de la tabla 'container'
    await prisma.container.deleteMany();

    // Eliminar todos los datos de la tabla 'entry'
    await prisma.entry.deleteMany();
    console.log("datos eliminados")
    return NextResponse.json({ message: 'Datos eliminados con éxito', status: 200 });
  } catch (error) {
    console.error('Error al eliminar los datos:', error);
    return NextResponse.json({ message: 'Error al eliminar los datos', error, status: 500 });
  }
};
