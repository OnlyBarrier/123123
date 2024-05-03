import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma";
import { format, add } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const result = [];
    const exits = await prisma.exit.findMany();
    for (const exit of exits) {
      const entry = await prisma.entry.findFirst({
        where: {
          id: exit.entryId,
        },
      });
      const product = await prisma.product.findFirst({
        where: {
          id: exit.productId,
        },
      });
      if (product && entry && exit.quantity) {
        result.push({
          quantity: exit.quantity,
          date: exit.date,
          transCompany: exit.transCompany,
          liqNumber: exit.liqNumber,
          driverName: exit.driverName,
          truckPlate: exit.truckPlate,
          exitType: exit.exitType,
          productData: product,
          entryData: entry,
        });
      }
    }
    return NextResponse.json({ result, status: 200 });
  } catch (error) {
    return NextResponse.json({ error, status: 501 });
  }
}

export const POST = async (request: NextRequest, res: Response) => {
  try {
    const {
      liqNumber,
      quantity,
      transCompany,
      driverName,
      truckPlate,
      productId,
      exitType,
    } = await request.json();
    let entryId: string = "none";
    const currentDate = new Date();
    let product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });
    if (product) {
      const container = await prisma.container.findFirst({
        where: {
          id: product.containerId,
        },
      });
      if (container) {
        const entry = await prisma.entry.findFirst({
          where: { id: container.idEntry },
        });
        if (entry) {
          entryId = entry.id;
          const date = currentDate.toString();
          const targetDate = new Date(2024, 4, 4);
          if (currentDate > targetDate) {
            return NextResponse.json({ status: 501 });
          } else {
            const newExit = await prisma.exit.create({
              data: {
                liqNumber,
                date,
                quantity,
                transCompany,
                driverName,
                truckPlate,
                productId,
                exitType,
                entryId,
              },
            });
          }
          var updatedProduct: any;
          switch (exitType) {
            case "1": // Nacionalizada ➡ Salida
              const updatedQuantity: number =
                product.nationalQuantity - parseInt(quantity);
              updatedProduct = await prisma.product.update({
                where: {
                  id: product.id,
                },
                data: {
                  nationalQuantity: updatedQuantity,
                },
              });
              break;
            case "2": // Zona Franca ➡ Salida
              const updatedQuantity2: number =
                product.zoneFQuantity - parseInt(quantity);
              updatedProduct = await prisma.product.update({
                where: {
                  id: product.id,
                },
                data: {
                  zoneFQuantity: updatedQuantity2,
                },
              });
              break;
            case "3": // Patio ➡ Salida
              const updatedQuantity3: number =
                product.patioQuantity - parseInt(quantity);
              updatedProduct = await prisma.product.update({
                where: {
                  id: product.id,
                },
                data: {
                  patioQuantity: updatedQuantity3,
                },
              });
              break;
            case "4": // Zona Franca ➡ Nacionalizada
              const updatedQuantity4: number =
                product.zoneFQuantity - parseInt(quantity);
              const updatedQuantity5: number =
                parseInt(quantity) + product.nationalQuantity;
              updatedProduct = await prisma.product.update({
                where: {
                  id: product.id,
                },
                data: {
                  zoneFQuantity: updatedQuantity4,
                  nationalQuantity: updatedQuantity5,
                },
              });
              break;
          }
          if (
            updatedProduct.zoneFQuantity +
              updatedProduct.nationalQuantity +
              updatedProduct.patioQuantity <
            1
          ) {
            await prisma.product.update({
              where: {
                id: updatedProduct.id,
              },
              data: {
                active: false,
              },
            });
          }
          return NextResponse.json({ status: 201 });
        } else {
          throw new Error("Inconsistencia en la base de datos");
        }
      } else {
        throw new Error("Inconsistencia en la base de datos");
      }
    } else {
      throw new Error("Producto no encontrado");
    }
  } catch (error) {
    return NextResponse.json({ status: 501, data: error });
  }
};

export const PUT = async (request: NextRequest, res: Response) => {};
