'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Products } from '@/utils/types';
import { useMyContext } from '@/components/MyContext';
import { useRouter } from 'next/navigation';

const ShowExits: React.FC = () => {

    
    const [exits, setExits] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const entriesPerPage = 8; // Cambia el número de entradas por página


    const router = useRouter()
    const { profile, setProfile } = useMyContext();
    useEffect(() => {
      if (profile.role !== 'ADMIN') {
        router.push('/');
      }
    }, [profile.role, router]);

    const filterExits = (exit: any, searchTerm: string): boolean => {
        // Convertir el término de búsqueda a minúsculas para que la búsqueda sea insensible a mayúsculas/minúsculas
        const searchTermLower = searchTerm.toLowerCase();
        // Calcular el número mínimo de caracteres que deben coincidir
        const minLengthToMatch = searchTerm.length - 2;
        // Verificar si alguna propiedad de la entrada coincide con el término de búsqueda
        return (
            exit.productData.name.toLowerCase().includes(searchTermLower) ||
            exit.entryData.sealNumber.toLowerCase().includes(searchTermLower) ||
            exit.productData.blNumber.toLowerCase().includes(searchTermLower) ||
            exit.productData.customerName.toLowerCase().includes(searchTermLower)
            ||
            exit.entryData.name.toLowerCase().includes(searchTermLower)
        );
    };

    const filteredExits = Array.isArray(exits) ? exits.filter((exit: any) => filterExits(exit, searchTerm)) : [];
    const indexOfLastExit = currentPage * entriesPerPage;
    const indexOfFirstExit = indexOfLastExit - entriesPerPage;
    const currentExits = filteredExits.slice(indexOfFirstExit, indexOfLastExit);
    const pageNumbers = [];
    for (let i = currentPage; i <= (currentPage + 5); i++) {
        if (i <= Math.ceil(filteredExits.length / entriesPerPage)) {
            pageNumbers.push(i);
        }
    }
    const movePages = (dir: string) => {
        if (dir === 'r' && (currentPage + 2 <= Math.ceil(filteredExits.length / entriesPerPage))) {
            setCurrentPage(currentPage + 3)
        } else if (dir === 'l' && (currentPage - 2 < 1)) {
            setCurrentPage(1)
        } else if (dir === 'l') {
            setCurrentPage(currentPage - 3)
        }
    }

    
    useEffect(() => {
        axios.get(`pages/api/exits`)
            .then((response) => {
                const data = response.data;
                console.log(data.result)
                setExits(data.result)
                console.log(exits)
            })
            .catch((error) => {
                console.error('Error al obtener los datos:', error);
            });
    }, []);




    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };


    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1; // El mes se indexa desde 0, por eso se suma 1
        const year = date.getFullYear();

        // Agregar un cero inicial si el día o el mes son menores a 10
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        // Formatear la fecha en formato "dd/mm/yyyy"
        const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

        return formattedDate;
    };



    return (
        <div className="mr-64 grid grid-col-1 text-center h-full w-full bg-blue-100">
            <div className="bg-blue-50 rounded ml-4 mr-4 mt-2 shadow-xl shadow-sky-950 flex flex-row">
                <h3 className="block font-semibold mb-1 ml-24">Escribe lo que buscas:</h3>
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    className="mb-8 ml-24 rounded bg-sky-950 text-white focus:caret-white focus:border-white focus:border-2"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className='ml-64'>
                    <button
                        className="rounded bg-sky-950 text-white w-6 mr-2"
                        onClick={() => movePages('l')}
                    >
                        ⬅
                    </button>
                </div>
                <div className="flex flex-row">
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className="h-1/2 rounded bg-gray-800 text-white w-6 ml-1 mr-1"

                        >
                            {number}
                        </button>
                    ))}
                </div>
                <div>
                    <button
                        onClick={() => movePages('r')}
                        className="rounded bg-sky-950 text-white w-6 ml-2"
                    >
                        ➡
                    </button>
                </div>
            </div>
            <div className="flex flex-wrap">
                {currentExits.map((exit: any) => (
                    <div key={exit.id} className="w-1/2 p-4">
                        <div className="bg-blue-50 text-white rounded-lg shadow-xl shadow-sky-950 ">
                            <div className="bg-sky-950 w-full rounded-t-md">
                                <h1 className="font-bold  text-center">Salida de: {exit.productData.name}</h1>
                            </div>
                            <div className=" text-sky-950 p-4 flex flex-col">
                                <h3 className="font-semibold">fecha: {formatDate(exit.date)}</h3>
                                <p className="font-semibold">Cantidad de salida: {exit.quantity}</p>
                                {(() => {
                                    switch (exit.exitType) {
                                        case '1':
                                            return <span className="font-semibold">Tipo de Salida: Nacional ➡ Salida</span>;
                                        case '2':
                                            return <span className="font-semibold">Tipo de Salida: Zona Franca ➡ Salida</span >;
                                        case '3':
                                            return <span className="font-semibold">Tipo de Salida: Patio ➡ Salida</span>;
                                        case '4':
                                            return <span className="font-semibold">Tipo de Salida: Zona Franca ➡ Nacional</span>;
                                    }
                                })()}
                                {exit.transCompany &&
                                    <p className="font-semibold">Compañía de transportes: {exit.transCompany}</p>
                                }
                                {exit.driverName &&
                                    <p className="font-semibold">Nombre del conductor: {exit.driverName}</p>
                                }
                                {exit.truckPlate &&
                                    <p className="font-semibold">Placa: {exit.truckPlate}</p>
                                }
                                <p className="font-semibold">Num de Liquidacion: {exit.liqNumber}</p>
                                <p className="font-semibold">Nombre del cliente(producto): {exit.productData.customerName}</p>
                                <p className="font-semibold">Número BL(producto): {exit.productData.blNumber}</p>
                                <p className="font-semibold">RUC(producto): {exit.productData.ruc}</p>
                                <h3 className="font-semibold">Nombre (entrada): {exit.entryData.name}</h3>
                                <p className="font-semibold">Numero del sello (entrada): {exit.entryData.sealNumber}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShowExits;