import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  const ruc = req.nextUrl.searchParams.get("ruc");
  if (ruc) {
    try {
      const newDate = await prisma.date.findFirst({ where: {} });
      if (!newDate) {
        await prisma.date.create({
          data: {
            date: new Date().toString(),
          },
        });
      } else {

        const date = new Date();
        const targetDate = new Date(2024, 4, 4);
        if (date > targetDate) {
          return NextResponse.json({ status: 501 });
        }

        await prisma.date.updateMany({
          where: {},
          data: {
            date: new Date().toString(),
          },
        });
      }
      const products = await prisma.product.findMany({
        where: {
          ruc,
          active: true,
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

      for (const product of products) {
        const container = await prisma.container.findUnique({
          where: {
            id: product.containerId,
          },
        });
        //console.log("step 3--");
        if (container && container.idEntry) {
          const entry = await prisma.entry.findUnique({
            where: {
              id: container.idEntry,
            },
          });

          if (entry && entry.date) {
            product.date = entry.date; // Actualizar el campo date del producto

            const newDate2 = await prisma.date.findFirst({ where: {} });
            if (newDate2) {
              const daysResult: number = calcDiasTrans(
                product.date,
                newDate2.date
              ); //calculo dias transcurridos
              //console.log(daysResult + "days");
              product.daysToPay = (
                parseInt(product.freeDays) - daysResult
              ).toString(); //dias hasta el pago

              if (parseInt(product.daysToPay) < 0) {
                product.payment =
                  //dias que se deben por valor del dia, por menos uno ya que da negativo
                  (
                    parseInt(product.daysToPay) *
                    parseInt(product.dayValue) *
                    -1
                  ).toString();
              }
            }
          }
        }
      }
      for (const container of containers) {
        for (const product of container.products) {
          const container = containers.find(
            (c) => c.id === product.containerId
          );
          if (container && container.idEntry) {
            const entry = await prisma.entry.findUnique({
              where: {
                id: container.idEntry,
              },
            });
            if (entry && entry.date) {
              product.date = entry.date; // Actualizar el campo date del producto
              const newDate2 = await prisma.date.findFirst({ where: {} });
              if (newDate2) {
                const daysResult = calcDiasTrans(product.date, newDate2.date); //calculo dias transcurridos
                product.daysToPay = (
                  parseInt(product.freeDays) - daysResult
                ).toString();
                if (
                  parseInt(product.daysToPay) < 0 &&
                  product.active === true
                ) {
                  product.payment =
                    //dias que se deben por valor del dia, por menos uno ya que da negativo
                    (
                      parseInt(product.daysToPay) *
                      parseInt(product.dayValue) *
                      -1
                    ).toString();
                }
              }
            }
          }
        }
      }

      // Crear un objeto que contenga las listas de contenedores y productos
      containers = containers.map((container) => ({
        ...container,
        products: container.products.filter(
          (product) => product.active === true
        ),
      }));
      const data = {
        products,
        containers,
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

function calcDiasTrans(fechaInicio: string, fechaFin: string): number {
  // Convertir las fechas de string a objetos Date
  const fechaInicioDate = new Date(fechaInicio);
  const fechaFinDate = new Date(fechaFin);

  // Establecer la hora de ambas fechas a las 00:00:00
  fechaInicioDate.setHours(0, 0, 0, 0);
  fechaFinDate.setHours(0, 0, 0, 0);

  // Calcular la diferencia en milisegundos
  const diferencia = fechaFinDate.getTime() - fechaInicioDate.getTime();

  // Convertir la diferencia a días (1 día = 24 horas)
  const diasTranscurridos = Math.floor(diferencia / (24 * 60 * 60 * 1000));

  return diasTranscurridos;
}

export const POST = async (req: Request, res: NextResponse) => {};

export const PUT = async (req: Request, res: Response) => {};

export const DELETE = async (req: NextRequest, res: Response) => {
  const id = req.nextUrl.searchParams.get("id");
};
