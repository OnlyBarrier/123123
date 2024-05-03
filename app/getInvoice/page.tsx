'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { invoicePrint } from '@/utils/invoicePrint';
import { formatDate } from '@/utils/formatDate';
import { eInvoice } from '@/utils/eInvoice';
import { Invoice, Items, } from '@/utils/types';
import InvoiceModal from '../../components/invoiceModal'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation';
import { useMyContext } from '@/components/MyContext';

const ShowInvoices: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [menuOpen, setMenuOpen] = useState<boolean[]>([]);
    const [buttonPage, setButtonPage] = useState(1);

    const itemsPerPage = 3;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const router = useRouter()
    const { profile, setProfile } = useMyContext();

    useEffect(() => {
        if (profile.role !== 'ADMIN') {
            router.push('/');
        }
    }, [profile.role, router]);

    const toggleMenu = (index: number) => {
        setMenuOpen((prevMenuOpen) => {
            // Crear una copia del array menuOpen
            const newMenu = [...prevMenuOpen];
            // Cambiar el valor en la posición específica a true
            newMenu[index] = !newMenu[index];
            // Devolver el nuevo array actualizado
            return newMenu;
        });
    };

    const openModal = (entry: Invoice) => {
        setSelectedInvoice(entry);
    };

    const closeModal = () => {
        setSelectedInvoice(null);
    };


    useEffect(() => {
        // Realizar la solicitud GET a la API al cargar el componente
        const active = true;

        axios.get(`/pages/api/invoice?active=${active}`)
            .then((response) => {
                const sortedData = response.data.sort((a: Invoice, b: Invoice) => parseInt(a.serial) - parseInt(b.serial));
                const initialMenuOpenState = sortedData.map(() => false);
                setMenuOpen(initialMenuOpenState);
                setData(sortedData);
                setFilteredData(sortedData);

                setCurrentPage(1)
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


    useEffect(() => {
        console.log(filteredData);
    }, [filteredData]);

    const handleDeleteInvoice = (id: string) => {

        Swal.fire({
            title: '¿Seguro que desea eliminar la factura?',
            icon: 'warning',
            iconColor: '#001f3f',
            showCancelButton: true,
            color: '#001f3f',
            background: '#f0f9ff',
            confirmButtonColor: '#001f3f',
            cancelButtonColor: '#005b6b',
            cancelButtonText: 'Cancelar',
            confirmButtonText: '¡Sí, eliminar!'
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
                        console.error('Error al eliminar la factura:', error);
                    });
            }
        });

    };

    const calculateTotalTax = (invoice: Invoice) => {
        if (invoice.items) {
            return invoice.items.reduce((totalTax, currentItem) => totalTax + parseFloat(currentItem.tax), 0);
        }
    };
    const createEInvoice = async (item: Invoice) => {
        const { value: password } = await Swal.fire({
            title: "Ingresa la contraseña",
            input: "password",
            inputLabel: "Contraseña",
            inputPlaceholder: "contraseña",
            inputAttributes: {
                maxlength: "4",
                autocapitalize: "off",
                autocorrect: "off"
            },
            confirmButtonColor: '#001f3f'
        });
        if (password === "3011") {
            const response = await eInvoice(item)
            if (response.status === 200) {
                setFilteredData((prevData) => {
                    // Crea un nuevo array con la factura actualizada
                    const updatedData = prevData.map((invoice) =>
                        invoice.id === response.updatedInvoice.id ? response.updatedInvoice : invoice
                    );
                    return updatedData;
                });

                Swal.fire({
                    title: response.text,
                    icon: 'success',
                    iconColor: '#001f3f',
                    color: '#001f3f',
                    background: '#f0f9ff',
                    confirmButtonColor: '#001f3f',
                    confirmButtonText: 'ok'
                })

            } else {
                Swal.fire({
                    title: response.text,
                    icon: 'warning',
                    iconColor: '#001f3f',
                    color: '#001f3f',
                    background: '#f0f9ff',
                    confirmButtonColor: '#001f3f',
                    confirmButtonText: 'ok'
                })
            }
        } else {
            Swal.fire(`Contraseña incorrecta`);
        }

    }
    const filterInvoices = (searchValue: string) => {
        // Filtrar las facturas en base al valor de búsqueda en los tres campos
        const filteredInvoices = data.filter((invoice) => {
            const searchTerm = searchValue.toLowerCase();
            const customerNameMatch = invoice.customerName.toLowerCase().startsWith(searchTerm.substring(0, 3));
            const serialMatch = invoice.serial.toLowerCase().includes(searchTerm);
            return customerNameMatch || serialMatch;
        });
        setFilteredData(filteredInvoices);
        setCurrentPage(1);
    }; 
    const updInvoice = async (updatedInvoice: Invoice) => {

        if (updatedInvoice) {
            const validOptions = ["Alquiler", "Alquileres y Almacenaje", "Almacenaje", "Alquileres", "Almacenajes"];
            updatedInvoice.items.forEach((item: Items) => {
                const normalizedDescription = item.description.toLowerCase().trim();

                const isMatching = validOptions.some((option) =>
                    normalizedDescription.includes(option.toLowerCase().trim())
                );
                if (isMatching) {
                    const value = parseFloat(item.value);
                    const newTax = value * 0.07;
                    item.tax = newTax.toFixed(2);
                } else {
                    item.tax = "0";
                }
            });

            const totalSum = updatedInvoice.items.reduce(
                (sum: any, currentItem: any) => {
                    const value = parseFloat(currentItem.value);
                    const tax = parseFloat(currentItem.tax);
                    return {
                        value: sum.value + value,
                        tax: sum.tax + tax,
                    };
                },
                { value: 0, tax: 0 } // Inicializar el acumulador con valores iniciales
            );
            updatedInvoice.total = parseFloat((totalSum.value + totalSum.tax).toFixed(2));
            if (updatedInvoice) {
                // Actualizar la factura en el estado
                console.log(updInvoice)
                setData((prevData) => {
                    const updatedData = prevData.map((item) =>
                        item.id === updatedInvoice.id ? updatedInvoice : item
                    );
                    setFilteredData(updatedData);
                    return updatedData;
                });
            }
            try {
                console.log(updatedInvoice)
                const response = await axios.put('/pages/api/invoice', updatedInvoice);
                if (response.status === 200) {
                    Swal.fire({
                        title: 'Factura  actualizada con éxito',
                        icon: 'success',
                        iconColor: '#001f3f',
                        color: '#001f3f',
                        background: '#f0f9ff',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#001f3f'
                    })
                } else {
                    Swal.fire({
                        title: 'No hay conexión con la base de datos',
                        icon: 'warning',
                        iconColor: '#001f3f',
                        color: '#001f3f',
                        background: '#f0f9ff',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: '#001f3f'
                    })
                }
            } catch (error) {
                console.log(error)
            }
            setSelectedInvoice(null);
        }

    };


    const handlePageChangeExtended = (direction: 'previous' | 'next') => {
        let newPage;
        if (direction === 'previous') {
            newPage = Math.max(currentPage - 5, 1);
            console.log(totalPages + "aca" + currentPage)
            if (currentPage >= 1) {
                setButtonPage(buttonPage - 1)
                setCurrentPage(newPage);
            }
        } else {
            newPage = Math.min(currentPage + 5, totalPages);
            console.log(currentPage + 5)
            if (currentPage + 5 <= totalPages) {
                setButtonPage(buttonPage + 1)
                setCurrentPage(newPage);
            }
        }
    };

    const handlePageChange = (newPage: number) => {
        console.log(newPage)
        setCurrentPage(newPage);
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


                    <div className="flex items-center mt-2">
                        {/* Botón para retroceder 5 páginas */}
                        <button
                            className="px-2 py-1 bg-blue-900 text-white rounded-md mr-2"
                            onClick={() => handlePageChangeExtended('previous')}
                        >
                            ⬅
                        </button>
                        {/* Botones de paginación */}
                        {Array.from({ length: 5 }).map((_, index) => {
                            const pageNumber = index + currentPage;
                            if (pageNumber <= totalPages) {
                                return (
                                    <button
                                        key={pageNumber}
                                        className={`px-4 mr-1 w-[5%] text-center rounded-sm ${currentPage === pageNumber
                                            ? 'bg-blue-900 text-white'
                                            : 'bg-blue-100 text-sky-950'
                                            }`}
                                        onClick={() => handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            } else {
                                return null; // No renderizar el botón si pageNumber es mayor que totalPages
                            }
                        })}
                        <button
                            className="px-2 py-1 bg-blue-900 text-white rounded-md ml-2"
                            onClick={() => handlePageChangeExtended('next')}
                        >
                            ➡
                        </button>
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
                    {currentItems.map((item, index) => (
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
                            <p className="text-gray-600">Fecha: {item.date}</p>
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
                                    {/* Menú desplegable de opciones */}
                                    <div className="relative inline-block text-left">
                                        <button
                                            onClick={() => toggleMenu(index)}
                                            type="button"
                                            className="inline-flex justify-center w-full px-4 py-2 bg-blue-900 border border-blue-900 rounded-md shadow-sm text-sm font-medium text-white hover:text-sky-950 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-900 focus:ring-blue-500"
                                            id="options-menu"
                                            aria-haspopup="true"
                                            aria-expanded="true"
                                        >
                                            Opciones
                                        </button>

                                        {/* Contenido del menú desplegable */}
                                        {menuOpen[index] && (
                                            <div
                                                className="bg-blue-900 border-md"
                                            >
                                                <div className="" role="none">
                                                    <button
                                                        onClick={() => handleDeleteInvoice(item.id)}
                                                        className="block px-4 py-2 text-sm text-white hover:bg-blue-50 hover:text-sky-950"
                                                        role="menuitem"
                                                    >
                                                        Eliminar
                                                    </button>
                                                    {!item.eInvoiceCreated && (
                                                        <button
                                                            onClick={() => createEInvoice(item)}
                                                            className="block px-4 py-2 text-sm text-white hover:bg-blue-50 hover:text-sky-950"
                                                            role="menuitem"
                                                        >
                                                            Crear FE
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => invoicePrint(item)}
                                                        className="block px-4 py-2 text-sm text-white hover:bg-blue-50 hover:text-sky-950"
                                                        role="menuitem"
                                                    >
                                                        Imprimir
                                                    </button>
                                                    <button
                                                        className="block px-4 py-2 text-sm text-white hover:bg-blue-50 hover:text-sky-950"
                                                        onClick={() => openModal(item)}
                                                        role="menuitem"
                                                    >
                                                        Editar
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    ))}
                </div>)

            }
            {selectedInvoice && (
                <InvoiceModal
                    invoice={selectedInvoice}
                    isOpen={!!selectedInvoice}
                    onClose={(updatedInvoice) => {
                        updInvoice(updatedInvoice);
                        closeModal();
                    }}
                />
            )}

        </div>
    );
};

export default ShowInvoices;