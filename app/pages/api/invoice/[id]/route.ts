import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const clientName = decodeURIComponent(
    request.nextUrl.pathname.replace("/pages/api/invoice/", "")
  );
  console.log(clientName);
  try {
    const invoices = await prisma.invoice.findMany();
    if (invoices) {
      let filteredInvoices: any = [];
      let count = 0;
      let customerNamesSet = new Set<string>();
      invoices.forEach((invoice) => {
        const lowerCustomerName = invoice.customerName.toLowerCase();
        const lowerClientName = clientName.toLowerCase();

        for (let i = 0; i < lowerClientName.length; i++) {
          if (lowerCustomerName.includes(lowerClientName[i])) {
            count++;
          }
        }
        console.log(customerNamesSet);
        if (count > 2 && !customerNamesSet.has(lowerCustomerName)) {
          // Si el customerName no está en el conjunto
          customerNamesSet.add(lowerCustomerName); // Agregarlo al conjunto
          filteredInvoices.push(invoice); // Agregar la factura a filteredInvoices
          count = 0;
        } else {
          count = 0;
        }
      });
      if (filteredInvoices && filteredInvoices.length > 0) {
        return NextResponse.json(filteredInvoices, { status: 200 });
      } else {
        return NextResponse.json(
          {
            message: `No se encontraron facturas para el cliente ${clientName}`,
          },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "No se encontraron facturas" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: "DB no response" }, { status: 500 });
  }
}

export const PUT = async (request: NextRequest, res: Response) => {
  const serial = decodeURIComponent(
    request.nextUrl.pathname.replace("/api/invoice/", "")
  );
  console.log(serial);
  try {
    if (serial) {
      const updateInvoice = await prisma.invoice.update({
        where: {
          serial,
        },
        data: {
          eInvoiceCreated: true,
        },
      });
      return NextResponse.json(updateInvoice, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Invoice no found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json({ status: 400 });
  }
};
