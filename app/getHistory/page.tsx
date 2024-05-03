'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Products, Containers } from '@/utils/types';
import { useMyContext } from '@/components/MyContext';
import { formatDate } from '@/utils/formatDate';

const initialContainerState: Products[] = [
    {
        id: "",
        date: "",
        payment: "",
        customerName: "",
        ruc: "",
        dimensions: "",
        blNumber: "",
        name: "",
        observations: "",
        active: true,
        freeDays: "",
        dayValue: "",
        zoneFQuantity: "",
        nationalQuantity: "",
        patioQuantity: "",
        exitQuantity: 0,
        exitDate: "",
    },
];

const ShowHistory: React.FC = () => {
    const [searchValue, setSearchValue] = useState('');
    const [products, setProducts] = useState<Products[]>(initialContainerState);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 4;
    const maxPageButtons = 5;
    const { profile } = useMyContext();

    useEffect(() => {
        if (profile.customerId) {
            axios.get(`http://localhost:3000/pages/api/productHistory/?ruc=${profile.customerId}`)
                .then((response) => {
                    const data = response.data;
                    setProducts(data.products)                  
                })
                .catch((error) => {
                    console.error('Error al obtener los datos:', error);
                });
        }
    }, [profile.customerId]);


    const filterProducts = () => {
        const filteredProducts: Products[] = products.filter(product =>
            product.customerName.toLowerCase().includes(searchValue.toLowerCase())
            ||
            product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            formatDate(product.date).includes(searchValue.toLowerCase())
        );
        return filteredProducts;
    };
    const filteredProducts = filterProducts();
    const indexOfLastEntry = currentPage * productsPerPage;
    const indexOfFirstEntry = indexOfLastEntry - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstEntry, indexOfLastEntry);
    const pageNumbers: number[] = [];
    for (let i = currentPage; i < (currentPage + maxPageButtons); i++) {
        console.log(currentProducts.length)
        if (i <= Math.ceil(filteredProducts.length / productsPerPage)) {
            pageNumbers.push(i);
        }
    }
    const movePages = (dir: string) => {
        if (dir === 'r' && (currentPage + 2 <= Math.ceil(filteredProducts.length / productsPerPage))) {
            setCurrentPage(currentPage + maxPageButtons)
        } else if (dir === 'l' && (currentPage - maxPageButtons < 1)) {
            setCurrentPage(1)
        } else if (dir === 'l') {
            setCurrentPage(currentPage - maxPageButtons)
        }
    }
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    return (
        <div className="w-full h-full flex flex-col text-center  bg-blue-100">
            <div className="mt-8 w-5/6">
                <div className="rounded-lg w-5/6 mx-auto shadow-md shadow-sky-950 bg-blue-50 mb-2 text-xl text-bold flex flex-col">
                    <h1 className="text-2xl bg-sky-950 text-bold text-blue-50 rounded-t-lg" >Lista de productos</h1>
                    <div className='flex flex-grap justify-center'>
                        <div>
                            <h1>Busqueda</h1>
                            <input
                                className='bg-sky-950 text-white text-md rounded-lg mb-2'
                                placeholder="Buscar" type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-row h-1/2 pr-24 mt-6 ml-4">
                            <div>
                                <button
                                    className="rounded bg-sky-950 text-white w-6 mr-2"
                                    onClick={() => movePages('l')}
                                >
                                    ⬅
                                </button>
                            </div>
                            {pageNumbers.map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className="rounded bg-sky-950 text-white w-6 mr-2"
                                >
                                    {number}
                                </button>
                            ))}
                            <div>
                                <button
                                    onClick={() => movePages('r')}
                                    className="rounded bg-sky-950 text-white w-6"
                                >
                                    ➡
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-wrap w-5/6 mx-auto'>
                    {currentProducts.length > 0 && currentProducts.map((product: any, index: number) => (
                        <div key={index} className="rounded-lg w-1/2 mx-auto bg-blue-100">
                            <div className="mx-2 mb-4 bg-blue-50 flex flex-col text-blue-900 rounded-lg shadow-md shadow-sky-950">
                                <p className="text-2xl bg-sky-950 text-bold text-blue-50 rounded-t-lg">Cliente: {product.customerName}</p>
                                <p>Producto: {product.name}</p>
                                <h1 >Dimensiones: {product.dimensions}</h1>
                                <h1 >Fecha de entrada: {formatDate(product.date)}</h1>
                                <h1 >Deuda Total: {product.payment}</h1>
                                <p >Cantidad: 0</p>
                                <p className='text-red-900' >Estado: COMPLETADO</p>
                                <p className="mb-2">Observaciones del Producto: {product.observations}</p>
                            </div>


                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShowHistory;