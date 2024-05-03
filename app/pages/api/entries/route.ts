import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: Request, res: NextResponse) => {
  try {
    const entries = await prisma.entry.findMany({
      include: {
        containers: {
          include: {
            products: true,
          },
        },
      },
    });
    return NextResponse.json({ entries, status: 200 });
  } catch (error) {
    return NextResponse.json({ error, status: 501 });
  }
};

export const PUT = async (req: Request, res: NextResponse) => {
  try {
    const {
      id,
      containers,
      name,
      blNumber,
      date,
      sealNumber,
      comments,
      entryNumber,
    } = await req.json();
    console.log(containers);
    // Actualizar la entrada
    const updatedEntry = await prisma.entry.update({
      where: { id },
      data: {
        name,
        blNumber,
        date,
        sealNumber,
        totalContainers: containers.length.toString(),
        comments,
        entryNumber,
      },
      include: {
        containers: {
          include: { products: true },
        },
      },
    });

    console.log("step2" + containers);

    // Actualizar los contenedores y productos asociados
    for (const containerData of containers) {
      const { products } = containerData;
      let containerNew: any;

      if (containerData.id) {
        const deletedProducts = await prisma.product.deleteMany({
          where: {
            containerId: containerData.id,
          },
        });

        const deleteContainer = await prisma.container.delete({
          where: {
            id: containerData.id,
          },
        });

        containerNew = await prisma.container.create({
          data: {
            id: containerData.id,
            ruc: containerData.ruc,
            name: containerData.name,
            wareHouseName: containerData.wareHouseName,
            description: containerData.description,
            containerNumber: containerData.containerNumber,
            email: containerData.email,
            address: containerData.address,
            phone: containerData.phone,
            entry: { connect: { id: id } }, // Establecer la relación con la entrada existente
          },
          include: { products: true },
        });
      } else {
        containerNew = await prisma.container.create({
          data: {
            id: containerData.id,
            ruc: containerData.ruc,
            name: containerData.name,
            wareHouseName: containerData.wareHouseName,
            description: containerData.description,
            containerNumber: containerData.containerNumber,
            email: containerData.email,
            address: containerData.address,
            phone: containerData.phone,
            entry: { connect: { id: id } }, // Establecer la relación con la entrada existente
          },
          include: { products: true },
        });
      }
      for (const productData of products) {
        const newProduct = await prisma.product.create({
          data: {
            id: productData.id,
            blNumber: productData.blNumber,
            name: productData.name,
            observations: productData.observations,
            zoneFQuantity: parseInt(productData.zoneFQuantity),
            nationalQuantity: parseInt(productData.nationalQuantity),
            patioQuantity: parseInt(productData.patioQuantity),
            dimensions: productData.dimensions,
            ruc: productData.ruc,
            dayValue: productData.dayValue,
            freeDays: productData.freeDays,
            customerName: productData.customerName,
            container: { connect: { id: containerNew.id } },
          },
        });
      }
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500 });
  }
};

export const POST = async (req: Request, res: NextResponse) => {
  try {
    const { entry, newContainers } = await req.json();

    const { name, containers, blNumber, date, sealNumber, comments } = entry;

    const entryMasAlto: any = await prisma.entry.findFirst({
      orderBy: { entryNumber: "desc" },
      select: { entryNumber: true },
    });

    let entryNumber:number;
    if (entryMasAlto !== null) {
      entryNumber = entryMasAlto.entryNumber + 1;
    } else {
      entryNumber = 1; // Asigna 1 si no hay ninguna entrada existente
    }

    const newEntry = await prisma.entry.create({
      data: {
        name,
        blNumber,
        date,
        sealNumber,
        comments,
        entryNumber,
        active: true,
        totalContainers: containers.length.toString(),
      },
    });
 
    for (const containerData of newContainers) {
      const { products } = containerData;
      console.log(products);
      // Crear contenedor
      const createdContainer = await prisma.container.create({
        data: {
          ruc: containerData.ruc,
          name: containerData.name,
          wareHouseName: containerData.wareHouseName,
          description: containerData.description,
          containerNumber: containerData.containerNumber,
          email: containerData.email,
          address: containerData.address,
          phone: containerData.phone,
          entry: { connect: { id: newEntry.id } },
        },
        include: { products: true },
      });
      for (const productData of products) {
        // Crear producto si no existe
        await prisma.product.create({
          data: {
            blNumber: productData.blNumber,
            name: productData.name,
            observations: productData.observations,
            zoneFQuantity: parseInt(productData.zoneFQuantity),
            nationalQuantity: parseInt(productData.nationalQuantity),
            patioQuantity: parseInt(productData.patioQuantity),
            dimensions: productData.dimensions,
            ruc: productData.ruc,
            dayValue: productData.dayValue,
            freeDays: productData.freeDays,
            customerName: productData.customerName,
            container: { connect: { id: createdContainer.id } },
          },
        });
      }
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 500 });
  }
};
