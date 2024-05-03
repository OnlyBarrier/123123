"use client";

// Importa las dependencias necesarias
import { MyContext, useMyContext } from '../components/MyContext';
import Link from "next/link";
import Image from "next/image";
import trans from "./img.png";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BottomBar() {
    const { profile, setProfile } = useMyContext();
    const [menu, setMenu] = useState<number>(0)
    const router = useRouter()
    const logout = () => {
        setProfile({
            id: "",
            name: "",
            customerId: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
        })
        router.push('/');
    };
    const changeMenu = (i: number) => {
        setMenu(i);
    }

    // Renderizado condicional basado en el valor de myValue
    return profile.role !== "" ? (
        <div className="grid bg-blue-900 text-white lg:w-full grid-cols-1 lg:text-left h-screen ">
            <div className="overflow-hidden">
                {/* Contenido de la barra superior */}
                <div className="bg-blue-50 h-1/6 flex">
                    <div className="ml-6 mt-6">
                        <Image src={trans} alt="image" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                    <div className="mb-6 ml-6 mt-12 text-xl text-blue-900 font-bold">
                        <p>Transalma</p>
                        <div className="mb-6 ml-6 mt-2 text-sm text-blue-900 font-semibold">
                            <p>Web</p>
                        </div>
                    </div>
                </div>
                {/* Sección Ver Facturas */}
                {profile.role === "ADMIN" && (
                    <div onMouseEnter={() => changeMenu(1)} onMouseLeave={() => changeMenu(0)} className="hover:bg-blue-50 hover:text-sky-950 hover:border-blue-200 text-center">
                        <button className="mt-8 ml-4">
                            <h2 className="text-xl font-semibold hover:text-center">
                                Facturas{" "}
                                <span className="text-center">💻</span>
                                {menu !== 1 && (
                                    <span className="inline-block text-sm italic">Crear facturas, ver las facturas, ver las facturas anuladas.</span>
                                )}
                            </h2>
                        </button>
                        {menu === 1 && (
                            <div className="text-center">
                                <Link href="/createInvoice" className="text-md text-blue-900 hover:animate-pulse hover:text-sky-950 hover:underline  border border-transparent transition-colors ">
                                    <h2 className="ml-8 text-xl font-semibold">Crear facturas</h2>
                                </Link>
                                <Link href="/getInvoice" className="text-md text-blue-900 hover:animate-pulse hover:text-sky-950 hover:underline  border border-transparent transition-colors ">
                                    <h2 className="ml-8 text-xl font-semibold">Ver facturas</h2>
                                </Link>
                                <Link href="/getInactiveInvoice" className="text-md text-blue-900 hover:animate-pulse hover:underline hover:text-sky-950 border border-transparent transition-colors ">
                                    <h2 className="ml-8 text-xl font-semibold">Facturas anuladas</h2>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
                {profile.role === "ADMIN" && (
                    <div onMouseEnter={() => changeMenu(2)} onMouseLeave={() => changeMenu(0)} className="hover:bg-blue-50 hover:text-sky-950 hover:border-blue-200 text-center">
                        <button className="mt-12 ml-4">
                            <h2 className="text-xl font-semibold hover:text-center">
                                Entradas{" "}
                                <span className="text-xl font-semibold hover:text-center">
                                    🧾
                                </span>
                                {menu != 2 &&
                                    <span className="inline-block text-sm italic">
                                        Crear entradas, ver las entradas, ver las salidas.
                                    </span>
                                }

                            </h2>
                        </button>

                        {menu === 2 && (
                            <div>
                                <Link href="/createEntries" className="text-md text-blue-900 hover:animate-pulse hover:text-sky-950 hover:underline  border border-transparent transition-colors">
                                    <h2 className="ml-8 text-xl font-semibold">
                                        Crear Entradas{" "}
                                    </h2>
                                </Link>

                                <Link href="/getEntries" className="text-md text-blue-900 hover:animate-pulse hover:text-sky-950 hover:underline  border border-transparent transition-colors">
                                    <h2 className="ml-8 text-xl font-semibold">
                                        Ver Entradas{" "}
                                    </h2>
                                </Link>
                                <Link href="/getExits" className="text-md text-blue-900 hover:animate-pulse hover:text-sky-950 hover:underline  border border-transparent transition-colors">
                                    <h2 className="ml-8 text-xl font-semibold">
                                        Ver Salidas{" "}
                                    </h2>
                                </Link>
                            </div>
                        )

                        }
                    </div>
                )}
                {profile.role === "ADMIN" && (
                    <div onMouseEnter={() => changeMenu(3)} onMouseLeave={() => changeMenu(0)} className="hover:bg-blue-50 hover:text-sky-950 hover:border-blue-200 text-center">
                        <button className="mt-12 ml-4">
                            <h2 className="text-xl font-semibold hover:text-center">
                                Consultadas DB{" "}
                                <span className="text-xl font-semibold hover:text-center">
                                    ⌨
                                </span>
                                {menu != 3 &&
                                    <span className="inline-block text-sm italic">
                                        Crea consultas directamente en la base de datos.
                                    </span>
                                }

                            </h2>
                        </button>

                        {menu === 3 && (
                            <div>
                                <Link href="/bdConsult" className="text-md text-blue-900 hover:animate-pulse hover:text-sky-950 hover:underline  border border-transparent transition-colors">
                                    <h2 className="ml-8 text-xl font-semibold">
                                        Crear Consulta{" "}
                                    </h2>
                                </Link>
                                <Link href="/bdExcel" className="text-md text-blue-900 hover:animate-pulse hover:text-sky-950 hover:underline  border border-transparent transition-colors">
                                    <h2 className="ml-8 text-xl font-semibold">
                                        Generar Excel DB{" "}
                                    </h2>
                                </Link>
                            </div>
                        )

                        }
                    </div>
                )}

                {/* Sección visible solo para "client" */}
                {profile.role === "BASIC" && (
                    <div>
                        <div className="hover:bg-blue-50 hover:text-sky-950 hover:border-t-2 hover:border-b-2 hover:border-blue-200 h-1/6">
                            <Link href="/getMyContainers" className="group border border-transparent transition-colors">
                                <h2 className="mb-6 ml-6 text-xl font-semibold">
                                    Ver Contenedores{" "}
                                    <span className="inline-block transition-transform group-hover:translate-x-6 motion-reduce:transform-none">
                                        🚚
                                    </span>
                                </h2>
                                <p className="ml-4 m-0 max-w-[30ch] group-hover:opacity-100 text-sm opacity-50">
                                    Una lista detallada de los productos que tienes con la empresa.
                                </p>
                            </Link>
                        </div>
                        <div className="hover:bg-blue-50 hover:text-sky-950 hover:border-t-2 hover:border-b-2 hover:border-blue-200 h-1/6">
                            <Link href="/getMyProducts" className="group border border-transparent transition-colors">
                                <h2 className="mb-6 ml-6 text-xl font-semibold">
                                    Ver Productos{" "}
                                    <span className="inline-block transition-transform group-hover:translate-x-6 motion-reduce:transform-none">
                                        📦
                                    </span>
                                </h2>
                                <p className="ml-4 m-0 max-w-[30ch] group-hover:opacity-100 text-sm opacity-50">
                                    Una lista detallada de los productos que tienes con la empresa.
                                </p>
                            </Link>
                        </div>
                        <div className="hover:bg-blue-50 hover:text-sky-950 hover:border-t-2 hover:border-b-2 hover:border-blue-200 h-1/6">
                            <Link href="/getHistory" className="group border border-transparent transition-colors">
                                <h2 className="mb-6 ml-6 text-xl font-semibold">
                                    Ver Historial{" "}
                                    <span className="inline-block transition-transform group-hover:translate-x-6 motion-reduce:transform-none">
                                        📄
                                    </span>
                                </h2>
                                <p className="ml-4 m-0 max-w-[30ch] group-hover:opacity-100 text-sm opacity-50">
                                    Una lista detallada de los productos que tienes con la empresa.
                                </p>
                            </Link>
                        </div>
                        <div className="hover:bg-blue-50 hover:text-sky-950 hover:border-t-2 hover:border-b-2 hover:border-blue-200 h-1/6">
                            <button onClick={logout} className="group border border-transparent transition-colors">
                                <h2 className="mb-6 ml-6 text-xl font-semibold">
                                    Cerrar sesion{" "}
                                    <span className="inline-block transition-transform group-hover:translate-x-6 motion-reduce:transform-none">
                                        👋🏻
                                    </span>
                                </h2>
                                <p className="ml-4 m-0 max-w-[30ch] group-hover:opacity-100 text-sm opacity-50">
                                    Terminar la sesion.
                                </p>
                            </button>
                        </div>
                    </div>

                )}
            </div>
        </div>
    ) : (<div className="bg-white flex items-center justify-center h-screen"></div>);
}

