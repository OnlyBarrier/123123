'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { invoicePrint } from '@/utils/invoicePrint';
import { formatDate } from '@/utils/formatDate';
import { eInvoice } from '@/utils/eInvoice';
import { Entries, Invoice, Items, } from '@/utils/types';
import InvoiceModal from '../../components/invoiceModal'

import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation';
import { useMyContext } from '@/components/MyContext';

const ShowInactiveInvoices: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    const itemsPerPage = 3;

    const router = useRouter()
    const { profile, setProfile } = useMyContext();
    useEffect(() => {
        if (profile.role !== 'ADMIN') {
            router.push('/');
        }
    }, [profile.role, router]);

    useEffect(() => {
        // Realizar la solicitud GET a la API al cargar el componente
        const active = false;
        axios.get(`/pages/api/invoice?active=${active}`)
            .then((response) => {
                setData(response.data);
                setFilteredData(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener los datos:', error);
            });
    }, []);
    useEffect(() => {
        if (data.length > 0) {
            setLoading(false);
        }
    }, [data]);

    const handleRestoreInvoice = (id: string) => {

        Swal.fire({
            title: '¿Seguro que desea restaurar la factura?',
            icon: 'warning',
            iconColor: '#001f3f',
            showCancelButton: true,
            color: '#001f3f',
            background: '#f0f9ff',
            confirmButtonColor: '#001f3f',
            cancelButtonColor: '#005b6b',
            cancelButtonText: 'Cancelar',
            confirmButtonText: '¡Sí, Restaurar!'
        }).then((result) => {
            if (result.isConfirmed) {
                //Realizar la solicitud DELETE al backend para eliminar la factura con el ID proporcionado

                axios.delete(`/pages/api/invoice?id=${id}`)
                    .then((response) => {
                        // Actualizar el estado de los datos después de la eliminación
                        const updatedData: Invoice[] = data.filter((item) => item.id !== id);
                        setFilteredData(updatedData);
                    })
                    .catch((error) => {
                        console.error('Error al restaurar la factura:', error);
                    });
            }
        });

    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };
    const calculateTotalTax = (invoice: Invoice) => {
        if (invoice.items) {
            return invoice.items.reduce((totalTax, currentItem) => totalTax + parseFloat(currentItem.tax), 0);
        } else {
            console.log("no")
        }

    };

    const filterInvoices = (searchValue: string) => {
        // Filtrar las facturas en base al valor de búsqueda en los tres campos
        const filteredInvoices = data.filter((invoice) => {
            const searchTerm = searchValue.toLowerCase();
            return (
                invoice.customerName.toLowerCase().includes(searchTerm) ||
                invoice.containerNumber.toLowerCase().includes(searchTerm) ||
                invoice.blNumber.toLowerCase().includes(searchTerm)
            );
        });
        setFilteredData(filteredInvoices)
    };

    return (
        <div className="min-h-screen grid grid-col-1">
            <div className="h-2/6 text-sky-950 flex flex-col items-center">
                <h1 className="mt-16 text-3xl font-bold">Lista de Facturas</h1>
                <div className="mt-8 flex flex-col-2 items-center">
                    <div className="flex flex-col">
                        <input className="border border-blue-900 placeholder-sky-950 focus:outline-none rounded-sm bg-blue-50 w-[90%] text-bold text-sky-950"
                            placeholder=" Buscar..."
                            onChange={(e) => filterInvoices(e.target.value)} />
                    </div>
                    <div className="flex">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                className={`px-4 mr-1 w-[5%] text-center rounded-sm ${currentPage === index + 1 ? 'bg-blue-900 text-white' : 'bg-blue-100 text-sky-950'
                                    }`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>


            {loading ?
                (<div role="status" className="flex justify-center mb-96 h-4/6">
                    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-blue-900 animate-spin fill-blue-50" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>)
                :
                (<div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-4/6 ml-12 mb-28 mr-12 text-sky-900">
                    {currentItems.map((item) => (
                        <div
                            key={item.serial}
                            className="bg-blue-50 mt-8 p-4 rounded-lg  transform scale-150% transition-transform duration-300 ease-in-out shadow-blue-900 shadow-xl"
                        >
                            <div className="mb-4 text-center">
                                <h1 className="text-xl font-bold uppercase">
                                    TRANSALMA INTERNACIONAL S.A
                                </h1>
                                <p className="text-lg">155707616-2-2021 DV64</p>
                            </div>
                            <h2 className="text-xl font-semibold mt-16">Factura N°: {item.serial}</h2>
                            <p className="text-gray-600">Número BL: {item.blNumber}</p>
                            <p className="text-gray-600">Número del contenedor: {item.containerNumber}</p>
                            <p className="text-gray-600">Fecha: {formatDate(item.date)}</p>
                            <p className="text-gray-600">Nombre: {item.customerName}</p>

                            {/* Renderiza los datos de "description" a la izquierda */}
                            <div className="float-left">
                                <h3 className="text-lg font-semibold">Servicios</h3>
                                <ul className="list-none text-gray-600">
                                    {item.items && // @ts-ignore 
                                        item.items.map(item => <li key={item.id}>{item.description}</li>)}
                                </ul>
                            </div>


                            <div className="float-right mr-4">
                                <h3 className="text-lg font-semibold">Valor</h3>
                                <ul className="list-none text-gray-600">
                                    {item.items && // @ts-ignore 
                                        item.items.map(item => <li key={item.id}>{item.value}</li>)}
                                </ul>
                            </div>

                            <div className="clear-both"></div>
                            <div className="float-left mt-8">
                                <h3 className="text-lg font-semibold">
                                    Impuestos: {calculateTotalTax(item)}
                                </h3>
                            </div>
                            <div className="clear-both"></div>
                            <div className="float-left mt-4">
                                <h3 className="text-lg font-semibold">Total:      {typeof item.total === "number" ? item.total : "0"}
                                </h3>
                            </div>
                            <div className="clear-both mt-16 flex items-center">
                                <div className="absolute bottom-[-2.5%] left-0 right-0 flex justify-end">
                                    <button
                                        onClick={() => handleRestoreInvoice(item.id)}
                                        className="bg-blue-900 border-2 border-blue-900 text-white px-3 py-1 rounded-md hover:bg-blue-50 hover:text-sky-950"
                                    >
                                        Restaurar
                                    </button>
                                </div>
                                <div className="float-left">
                                    <h3 className="text-lg text-red-900 font-semibold">
                                        ANULADA
                                    </h3>
                                </div>
                            </div>
                        </div>

                    ))}
                </div>)
            }
        </div>
    );
};

export default ShowInactiveInvoices;