'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Products, Containers } from '@/utils/types';
import { useMyContext } from '@/components/MyContext';
import { formatDate } from '@/utils/formatDate';

const initialContainerState: Containers[] = [
    {
        id: "",
        name: "",
        ruc: "",
        wareHouseName: "",
        description: "",
        email: "",
        address: "",
        phone: "",
        active: true,
        products: [],
        containerNumber: "",
    },
];

const ShowContainers: React.FC = () => {
    const [searchValue, setSearchValue] = useState('');
    //const [filteredContainers, setFilteredContainers] = useState<Containers[]>(initialContainerState);
    const [containers, setContainers] = useState<Containers[]>(initialContainerState);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const productsPerPage = 4;
    const maxPageButtons = 5;
    const { profile } = useMyContext();

    useEffect(() => {
        if (profile.customerId) {
            axios.get(`http://localhost:3000/pages/api/product/?ruc=${profile.customerId}`)
                .then((response) => {
                    const data = response.data;      
                    setContainers(data.containers);

                })
                .catch((error) => {
                    console.error('Error al obtener los datos:', error);
                });
        }
    }, [profile.customerId]);


    const filterProducts = (): Containers[] => {
        const filteredContainers: Containers[] = [];
        // Iterar sobre cada contenedor
        for (const container of containers) {
            const filteredProducts: Products[] = container.products.filter(product =>
                product.customerName.toLowerCase().includes(searchValue.toLowerCase())
                ||
                container.containerNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
                product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                formatDate(product.date).includes(searchValue.toLowerCase())
            );
            // Si hay productos filtrados, añadir el contenedor al resultado
            if (filteredProducts.length > 0) {
                filteredContainers.push({
                    ...container,
                    products: filteredProducts,
                });
            }
        }
        return filteredContainers;
    };
    const filteredContainers = filterProducts();
    const indexOfLastEntry = currentPage * productsPerPage;
    const indexOfFirstEntry = indexOfLastEntry - productsPerPage;
    let totalProducts:any = []
    filteredContainers.forEach(cont => {
        cont.products.map(pro => {
           totalProducts =  [...totalProducts, {...pro, contDescription: cont.description, contNumber: cont.containerNumber} ]
        })
    });
    const currentProducts = totalProducts.slice(indexOfFirstEntry, indexOfLastEntry);
    const pageNumbers: number[] = [];
    for (let i = currentPage; i < (currentPage + maxPageButtons); i++) {
        if (i <= Math.ceil(totalProducts.length / productsPerPage)) {
            pageNumbers.push(i);
        }
    }
    const movePages = (dir: string) => {
        if (dir === 'r' && (currentPage + 2 <= Math.ceil(totalProducts.length / productsPerPage))) {
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
                    <h1 className="text-2xl bg-blue-900 text-bold text-blue-50 rounded-t-lg" >Lista de productos en los contenedores</h1>
                    <div className='flex flex-grap justify-center'>
                        <div>
                            <h1>Busqueda</h1>
                            <input
                                className='bg-blue-900 text-white text-md rounded-lg'
                                placeholder="Buscar" type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-row h-1/2 pr-24 mt-6 ml-4">
                            <div>
                                <button
                                    className="rounded bg-blue-900 text-white w-6 mr-2"
                                    onClick={() => movePages('l')}
                                >
                                    ⬅
                                </button>
                            </div>
                            {pageNumbers.map((number) => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className="rounded bg-blue-900 text-white w-6 mr-2"
                                >
                                    {number}
                                </button>
                            ))}
                            <div>
                                <button
                                    onClick={() => movePages('r')}
                                    className="rounded bg-blue-900 text-white w-6"
                                >
                                    ➡
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-wrap w-5/6 mx-auto'>
                    {currentProducts.length > 0 && currentProducts.map((product:any, index:number) => (
                        <div key={index} className="rounded-lg w-1/2 mx-auto bg-blue-100">                                   
                                    <div className="mx-2 mb-4 bg-blue-50 flex flex-col text-blue-900 rounded-lg shadow-md shadow-sky-950">
                                        <p className="text-2xl bg-blue-900 text-bold text-blue-50 rounded-t-lg">Cliente: {product.customerName}</p>
                                        <p >Contenedor #: {product.contNumber}</p>
                                        <p >Observaciones del contenedor: {product.contDescription}</p>
                                        <p>Producto: {product.name}</p>
                                        <h1 >Dimensiones: {product.dimensions}</h1>
                                        <h1 >Fecha de entrada: {formatDate(product.date)}</h1>
                                        <h1 >Deuda Total: {product.payment}</h1>
                                        <p >Cantidad en Patio: {product.patioQuantity}</p>
                                        <p >Cantidad en Zona Franca: {product.zoneFQuantity}</p>
                                        <p >Cantidad Nacionalizada: {product.nationalQuantity}</p>
                                        <p className="mb-2">Observaciones del Producto: {product.observations}</p>
                                    </div>
                          
                      
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShowContainers;