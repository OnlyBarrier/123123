import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  const ruc = req.nextUrl.searchParams.get("ruc");
  if (ruc) {
    try {
      let products = await prisma.product.findMany({
        where: {
          ruc,
          active: false,
        },
      });
      let containers = await prisma.container.findMany({
        where: {
          ruc,
        },
        include: {
          products: true, // Incluir los productos asociados a cada contenedor
        },
      });
      // Crear un objeto que contenga las listas de contenedores y productos
      containers = containers.map((container) => ({
        ...container,
        products: container.products.filter(
          (product) => product.active === false
        ),
      }));
      const allProducts = products.concat(
        ...containers.map((container) => container.products)
      );
      const data = {
        products: allProducts,
      };
      if (data) {
        return NextResponse.json(data, { status: 200 });
      } else {
        return NextResponse.json({ status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
  }
};

export const POST = async (req: Request, res: NextResponse) => {};

export const PUT = async (req: Request, res: Response) => {};

export const DELETE = async (req: NextRequest, res: Response) => {
  const id = req.nextUrl.searchParams.get("id");
};
