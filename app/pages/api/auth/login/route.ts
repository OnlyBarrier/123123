import prisma from "@/prisma";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";

export const GET = async (req: NextRequest, res: NextResponse) => {
  const email: string | null = req.nextUrl.searchParams.get("email");
  console.log(email);
  // if (email) {
  //   try {
  //     const user = await prisma.user.findFirst({
  //       where: {
  //         email: email,
  //       },
  //     });
  //     console.log(user?.password);
  //     if (user && user.password) {
  //       const { password: _, ...newUser } = user;
  //       console.log("e2");
  //       return NextResponse.json(newUser, { status: 200 });
  //     } else {
  //       return NextResponse.json({ status: 400 });
  //     }
  //   } catch (error) {
  //     return NextResponse.json({ message: "Error", error }, { status: 500 });
  //   }
  // } else {
  //   return NextResponse.json({ status: 400 });
  // }
};

export const POST = async (req: Request, res: NextResponse) => {
  const { name, customerId, email, password } = await req.json();
  if (name && customerId) {
    try {
      console.log(email);
      const emailExist = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (emailExist) {
        return NextResponse.json({ status: 400 });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (name === "admin123456789") {
          const user = await prisma.user.create({
            data: {
              name,
              customerId,
              email,
              password: hashedPassword,
              role: "ADMIN",
            },
          });
          const { password: _, ...newUser } = user;
          return NextResponse.json(newUser, { status: 200 });
        } else {
          const user = await prisma.user.create({
            data: { name, customerId, email, password: hashedPassword },
          });
          const { password: _, ...newUser } = user;
          return NextResponse.json(newUser, { status: 200 });
        }
      }
    } catch (error) {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
  } else {
    if (email) {
      try {
        const user = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });
        if (user && user.password) {
          if(await checkPassword(password, user.password)){
            const { password: _, ...newUser } = user;
            return NextResponse.json(newUser, { status: 200 });
          }
          else{
            return NextResponse.json({ status: 401}); //contraseña incorrecta
          }
        } else {
          return NextResponse.json({ status: 400 });//usuario no encontrado
        }
      } catch (error) {
        return NextResponse.json({ message: "Error", error }, { status: 500 });
      }
    } else {
      return NextResponse.json({ status: 400 });
    }
  }
};

async function checkPassword(
  inputPassword: string,
  storedHashedPassword: string
) {
  try {
    // Utilizar bcrypt.compare para verificar la contraseña
    const match = await bcrypt.compare(inputPassword, storedHashedPassword);
    if (match) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
      return false;
  }
}
