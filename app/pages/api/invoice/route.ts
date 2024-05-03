import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  const active = req.nextUrl.searchParams.get("active");
  if (active === "true") {
    try {
      const invoices = await prisma.invoice.findMany({
        where: {
          active: {
            equals: true,
          },
        },
        include: {
          items: true, // Incluye los elementos relacionados
        },
      });
      return NextResponse.json(invoices, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
  }else{
    try {
      const invoices = await prisma.invoice.findMany({
        where: {
          active: {
            equals: false,
          },
        },
        include: {
          items: true, // Incluye los elementos relacionados
        },
      });
      if(invoices.length > 0){
        return NextResponse.json(invoices, { status: 200 });
      }else{
        return NextResponse.json({ status: 201 });
      }
    } catch (error) {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
  }
};

async function createSerial(): Promise<string> {
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
    return cerosFaltantes + numeroCadena.toString(); // Agrega los ceros al principio y devuelve la cadena
  } else {
    return "0000000001"; // Si no se encuentra ninguna factura, devuelve un valor predeterminado
  }
}

export const POST = async (req: Request, res: NextResponse) => {
  const {
    date,
    customerName,
    customerId,
    active,
    blNumber,
    containerNumber,
    nature,
    receiverType,
    rucType,
    paymentMethods,
    telephones,
    emails,
    address,
    items,
    total,
  } = await req.json();
  //await prismaConnect();
  // @ts-ignore
  const serial: string = await createSerial();
  //const tax: string = calculateTax(description, value);
  //const total: number = sumNumbersInString(value.toString(), tax);
  try {
    let invoice = await prisma.invoice.create({
      data: {
        serial,
        date,
        customerName,
        customerId,
        active,
        total,
        blNumber,
        containerNumber,
        nature,
        receiverType,
        rucType,
        paymentMethods,
        telephones,
        emails,
        address,
      },
    });
    for (const itemData of items) {
      await prisma.items.create({
        data: {
          description: itemData.description,
          value: itemData.value,
          tax: itemData.tax,
          idInvoice: invoice.id, // Asignar el ID de la factura recién creada
        },
      });
    }
    // @ts-ignore
    invoice.items = items;
    // const isSuccess = await eInvoice(invoice);
    // if(isSuccess){
    //   await prisma.invoice.update({
    //     where: {
    //       id: invoice.id,
    //     },
    //     data: {
    //       eInvoiceCreated: true,
    //     },
    //   });
    //   return NextResponse.json({ message: "Factura Electrónica Creada" }, { status: 200 });
    // }
    // else{
    //   return NextResponse.json({ message: "Factura creada en la DB, pero en espera de la factura electrónica" }, { status: 200 });
    // }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
};

export const PUT = async (req: Request, res: Response) => {
  const {
    id,
    date,
    customerName,
    customerId,
    active,
    blNumber,
    containerNumber,
    nature,
    receiverType,
    rucType,
    paymentMethods,
    telephones,
    emails,
    address,
    items,
    total,
    eInvoiceCreated,
  } = await req.json();

  try {
    if (id) {
      const updateInvoice = await prisma.invoice.update({
        where: {
          id,
        },
        data: {
          date,
          customerName,
          customerId,
          active,
          blNumber,
          containerNumber,
          nature,
          receiverType,
          rucType,
          paymentMethods,
          telephones,
          emails,
          address,
          total,
          eInvoiceCreated,
        },
      });
      await prisma.items.deleteMany({
        where: {
          idInvoice: id,
        },
      });
      for (const itemData of items) {
        await prisma.items.create({
          data: {
            description: itemData.description,
            value: itemData.value,
            tax: itemData.tax,
            idInvoice: updateInvoice.id,
          },
        });
      }
      return NextResponse.json(updateInvoice, { status: 200 });
    } else {
      return NextResponse.json({ status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ status: 400 });
  }
};

export const DELETE = async (req: NextRequest, res: Response) => {
  const id = req.nextUrl.searchParams.get("id");

  try {
    if (id) {
      const invoice = await prisma.invoice.findFirst({ where: { id: id } });
      if (invoice) {
        await prisma.invoice.update({
          where: {
            id: id,
          },
          data: {
            active: !invoice.active,
          },
        });
        return NextResponse.json(
          { message: "Invoice Updated" },
          { status: 200 }
        );
      } else {
        throw new Error("Invoice not found");
      }
    } else {
      throw new Error("Id not found");
    }
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
};
