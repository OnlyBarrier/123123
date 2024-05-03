'use client'
import React, { useEffect, useState } from 'react';
import { Entries, Containers } from '@/utils/types';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useMyContext } from '@/components/MyContext';
import { format, parseISO } from 'date-fns';

const EntriesForm: React.FC = () => {
    const currentDate = new Date().toString();
    const [entry, setEntry] = useState<Entries>({
        id: '',
        name: '',
        date: currentDate,
        sealNumber: '',
        blNumber: '',
        comments: '',
        active: true,
        entryNumber: 0,
        containers: [],
    });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [newContainers, setNewContainers] = useState<Containers[]>([]);

    const router = useRouter()
    const { profile, setProfile } = useMyContext();



    useEffect(() => {
        if (profile.role !== 'ADMIN') {
            router.push('/');
        }
    }, [profile.role, router]);

    const addNewContainerForm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const newContainer = {
            id: '',
            ruc: '',
            name: '',
            containerNumber: '',
            wareHouseName: '',
            active: true,
            description: '',
            email: '',
            address: '',
            phone: '',
            products: [],
        };
        setNewContainers([...newContainers, newContainer]);

        // Actualiza el estado entry.containers
        setEntry((prevEntry) => ({
            ...prevEntry,
            containers: [...prevEntry.containers, newContainer],
        }));
    };
    const handleDateChange = (date: Date | null) => {
        if (date) {
            setEntry((prevState) => ({
                ...prevState,
                date: date.toString(),
            }));
            setSelectedDate(date)
        }
    };
    const handleContainerChange = (index: number, field: string, value: string) => {
        const updatedContainers = [...newContainers];
        updatedContainers[index] = {
            ...updatedContainers[index],
            [field]: value,
        };
        setNewContainers(updatedContainers);

        // Actualiza el estado entry.containers
        setEntry((prevEntry) => {
            const updatedEntry = { ...prevEntry };
            updatedEntry.containers[index] = {
                ...updatedEntry.containers[index],
                [field]: value,
            };
            return updatedEntry;
        });
    };
    const addNewProduct = (containerIndex: any) => {
        setNewContainers((prevContainers) => {
            const updatedContainers = [...prevContainers];
            if (!updatedContainers[containerIndex]) {
                updatedContainers[containerIndex] = {
                    id: '',
                    ruc: '',
                    name: '',
                    containerNumber: '',
                    active: true,
                    wareHouseName: '',
                    description: '',
                    email: '',
                    address: '',
                    phone: '',
                    products: [],
                };
            }

            updatedContainers[containerIndex].products.push({
                id: '',
                customerName: '',
                ruc: '',
                blNumber: '',
                name: '',
                observations: '',
                dayValue: '',
                freeDays: '',
                zoneFQuantity: '',
                nationalQuantity: '',
                patioQuantity: '',
                dimensions: '',
                active: true,
                exitQuantity: 0,
                exitDate: '',
                date: '',
                payment: ''
            });

            return updatedContainers;
        });
    };
    const handleProductChange = (containerIndex: number, productIndex: number, field: string, value: string) => {

        if (field === "freeDays" || field === "dayValue") {
            value = value.replace(/[^0-9.]/g, ''); //eliminamos letras y caracteres en los campos freeDays y dayValue
        }

        const updatedContainers = [...newContainers];
        const updatedProducts = [...updatedContainers[containerIndex].products];
        updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            [field]: value,
        };
        updatedContainers[containerIndex].products = updatedProducts;
        setNewContainers(updatedContainers);
    };
    const removeLastContainer = () => {
        if (newContainers.length > 0) {
            const updatedContainers = [...newContainers];
            updatedContainers.pop(); // Elimina el último elemento del arreglo
            setNewContainers(updatedContainers);
        }
    };
    const removeProduct = (containerIndex: number, productIndex: number) => {
        const updatedContainers = [...newContainers];
        const updatedProducts = [...updatedContainers[containerIndex].products];

        // Elimina el producto del arreglo de productos
        updatedProducts.splice(productIndex, 1);

        // Actualiza el estado
        updatedContainers[containerIndex].products = updatedProducts;
        setNewContainers(updatedContainers);
    };
    const handleSubmit = async () => {
        // Verificar si todos los campos de entry están vacíos
        const entryFields = Object.values(entry);
        const entryIsEmpty = entryFields.every((field) => !field);

        // Verificar si todos los campos de newContainers están vacíos
        const containersAreEmpty = newContainers.every((container) => {
            const containerFields = Object.values(container);
            return containerFields.every((field) => !field);
        });

        // Mostrar los valores por consola si ambos entry y newContainers están vacíos
        if (entryIsEmpty && containersAreEmpty) {
            console.log("faltan campos por llenar")
        } else {
            try {
                // Crear un objeto que contenga los datos de entry, incluyendo containers y productos
                setEntry({ ...entry, date: currentDate })

                const dataToSend = {
                    entry: entry,
                    newContainers: newContainers,
                };

                // Realizar una solicitud HTTP POST al servidor
                const response = await axios.post('/pages/api/entries', dataToSend);

                // Verificar la respuesta del servidor
                if (response.status === 200) {
                    console.log('Datos enviados exitosamente:', response.data);
                    setEntry({
                        id: '',
                        name: '',
                        date: currentDate,
                        sealNumber: '',
                        blNumber: '',
                        comments: '',
                        active: true,
                        entryNumber: 0,
                        containers: [],
                    })
                    setNewContainers([])
                } else {
                    console.error('Error al enviar datos:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error al enviar datos:', error);
            }
        }
    };
    return (
        <div className="ml-8 mr-8">
            <div className="bg-blue-900 text-white text-center py-2 rounded-md font-bold">
                <h2>Crear Nueva Entrada</h2>
            </div>
            <form className="bg-blue-50 text-sky-950 shadow-lg rounded-lg overflow-hidden grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="w-3/4 ml-2 mr-2">
                    <h2 className="block font-semibold mb-1 rounded focus:border-blue-900">Selecciona una fecha:</h2>
                    <DatePicker className="border rounded"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy" // Formato de fecha (puedes personalizarlo)
                    />
                </div>

                <div className="w-3/4 ml-2 mr-2">
                    <label htmlFor="name" className="block font-semibold mb-1">Nombre de naviera</label>
                    <input
                        type="text"
                        id="name"
                        value={entry.name}
                        onChange={(e) => setEntry({ ...entry, name: e.target.value })}
                        className="rounded-md p-2 w-full"
                    />
                </div>
                <div className="w-3/4 ml-2 mr-2">
                    <label htmlFor="sealNumber" className="block font-semibold mb-1">Número del Sello</label>
                    <input
                        type="text"
                        id="sealNumber"
                        value={entry.sealNumber}
                        onChange={(e) => setEntry({ ...entry, sealNumber: e.target.value })}
                        className="rounded-md p-2 w-full"
                    />
                </div>
                <div className="w-3/4 ml-2 mr-2">
                    <label htmlFor="blNumber" className="block font-semibold mb-1">Número BL master</label>
                    <input
                        type="text"
                        id="blNumber"
                        value={entry.blNumber}
                        onChange={(e) => setEntry({ ...entry, blNumber: e.target.value })}
                        className="rounded-md p-2 w-full"
                    />
                </div>
                <div className="w-full ml-2 mr-2">
                    <label htmlFor="comments" className="block font-semibold mb-1">Detalles</label>
                    <textarea
                        id="comments"
                        value={entry.comments}
                        onChange={(e) => setEntry({ ...entry, comments: e.target.value })}
                        className="rounded-md p-2 w-1/2 h-24"
                    />
                </div>

            </form>
            <div className="bg-blue-900 text-white text-bold text-center py-2 mt-4 rounded-md shadow-2xl" >
                <h2>CONSOLIDADORES</h2>
            </div>
            <div>
                {newContainers.map((container, index) => (
                    <div key={index}>
                        <h2 className="text-xl text-white font-semibold mt-2 text-center bg-sky-950 shadow-lg rounded-tl-lg rounded-tr-lg overflow-hidden">Datos del consolidador</h2>
                        <form key={index} className="bg-blue-50 text-sky-950 shadow-lg rounded-bl-lg rounded-br-lg overflow-hidden grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="w-3/4 ml-2 mr-2">
                                <label htmlFor={`ruc_${index}`} className="block font-semibold mb-1">RUC</label>
                                <input
                                    type="text"
                                    id={`ruc_${index}`}
                                    name={`ruc_${index}`}
                                    value={container.ruc}
                                    onChange={(e) => handleContainerChange(index, 'ruc', e.target.value)}
                                    className="rounded-md p-2 w-full"
                                />
                            </div>
                            <div className="w-3/4 ml-2 mr-2">
                                <label htmlFor={`containerName_${index}`} className="block font-semibold mb-1">Nombre del cliente</label>
                                <input
                                    type="text"
                                    id={`containerName_${index}`}
                                    name={`containerName_${index}`}
                                    value={container.name}
                                    onChange={(e) => handleContainerChange(index, 'name', e.target.value)}
                                    className="rounded-md p-2 w-full"
                                />
                            </div>
                            <div className="w-3/4 ml-2 mr-2">
                                <label htmlFor={`containerBlNumber_${index}`} className="block font-semibold mb-1">Número del Contenedor</label>
                                <input
                                    type="text"
                                    id={`containerBlNumber_${index}`}
                                    name={`blNumber_${index}`}
                                    value={container.containerNumber}
                                    onChange={(e) => handleContainerChange(index, 'containerNumber', e.target.value)}
                                    className="rounded-md p-2 w-full"
                                />
                            </div>
                            <div className="w-3/4 ml-2 mr-2">
                                <label htmlFor={`wareHouseName_${index}`} className="block font-semibold mb-1">Bodega</label>
                                <input
                                    type="text"
                                    id={`wareHouseName_${index}`}
                                    name={`wareHouseName_${index}`}
                                    value={container.wareHouseName}
                                    onChange={(e) => handleContainerChange(index, 'wareHouseName', e.target.value)}
                                    className="rounded-md p-2 w-full"
                                />
                            </div>
                            <div className="w-3/4 ml-2 mr-2">
                                <label htmlFor={`description_${index}`} className="block font-semibold mb-1">Descripción</label>
                                <textarea
                                    id={`description_${index}`}
                                    name={`description_${index}`}
                                    value={container.description}
                                    onChange={(e) => handleContainerChange(index, 'description', e.target.value)}
                                    className="rounded-md p-2 w-full"
                                />
                            </div>
                            <div className="w-3/4 ml-2 mr-2">
                                <label htmlFor={`address${index}`} className="block font-semibold mb-1">Direccion</label>
                                <input
                                    id={`address${index}`}
                                    name={`address${index}`}
                                    value={container.address}
                                    onChange={(e) => handleContainerChange(index, 'address', e.target.value)}
                                    className="rounded-md p-2 w-full"
                                />
                            </div>
                            <div className="w-3/4 ml-2 mr-2">
                                <label htmlFor={`email${index}`} className="block font-semibold mb-1">email</label>
                                <input
                                    id={`email${index}`}
                                    name={`email${index}`}
                                    value={container.email}
                                    onChange={(e) => handleContainerChange(index, 'email', e.target.value)}
                                    className="rounded-md p-2 w-full"
                                />
                            </div>
                            <div className="w-3/4 ml-2 mr-2">
                                <label htmlFor={`phone${index}`} className="block font-semibold mb-1">telefono</label>
                                <input
                                    id={`phone${index}`}
                                    name={`phone${index}`}
                                    value={container.phone}
                                    onChange={(e) => handleContainerChange(index, 'phone', e.target.value)}
                                    className="rounded-md p-2 w-full"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => addNewProduct(index)}
                                className="w-1/2 h-1/2 bg-blue-900 border-2 border-blue-900 text-white px-2 py-1 mt-4 rounded-lg text-sm hover:bg-blue-50 hover:text-sky-950"
                            >
                                Agregar Bl hijo
                            </button>
                        </form>
                        {container.products.map((product, productIndex) => (
                            <div key={productIndex}>
                                <h1 className="bg-blue-900 text-white text-bold text-center py-2 mt-4 rounded-md shadow-2xl">HBL</h1>
                                <form className="bg-blue-50 text-sky-950 shadow-lg rounded-lg overflow-hidden mt-4 p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="mb-4">
                                        <label htmlFor={`productObservations-${index}-${productIndex}`} className="block font-semibold mb-1">RUC</label>
                                        <input
                                            id={`productObservations-${index}-${productIndex}`}
                                            name={`productObservations-${index}-${productIndex}`}
                                            value={product.ruc}
                                            onChange={(e) => handleProductChange(index, productIndex, 'ruc', e.target.value)}
                                            className="rounded-md p-2 w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor={`productObservations-${index}-${productIndex}`} className="block font-semibold mb-1">Nombre del cliente</label>
                                        <input
                                            id={`productObservations-${index}-${productIndex}`}
                                            name={`productObservations-${index}-${productIndex}`}
                                            value={product.customerName}
                                            onChange={(e) => handleProductChange(index, productIndex, 'customerName', e.target.value)}
                                            className="rounded-md p-2 w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor={`productName-${index}-${productIndex}`} className="block font-semibold mb-1">Nombre del Producto</label>
                                        <input
                                            type="text"
                                            id={`productName-${index}-${productIndex}`}
                                            name={`productName-${index}-${productIndex}`}
                                            value={product.name}
                                            onChange={(e) => handleProductChange(index, productIndex, 'name', e.target.value)}
                                            className="rounded-md p-2 w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor={`nationalQuantity-${index}-${productIndex}`} className="block font-semibold mb-1">Cantidad bodega nacional</label>
                                        <input
                                            type="text"
                                            id={`nationalQuantity-${index}-${productIndex}`}
                                            name={`nationalQuantity-${index}-${productIndex}`}
                                            value={product.nationalQuantity}
                                            onChange={(e) => handleProductChange(index, productIndex, 'nationalQuantity', e.target.value)}
                                            className="rounded-md p-2 w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor={`zoneFQuantity-${index}-${productIndex}`} className="block font-semibold mb-1">Cantidad Zona Franca</label>
                                        <input
                                            type="text"
                                            id={`zoneFQuantity-${index}-${productIndex}`}
                                            name={`zoneFQuantity-${index}-${productIndex}`}
                                            value={product.zoneFQuantity}
                                            onChange={(e) => handleProductChange(index, productIndex, 'zoneFQuantity', e.target.value)}
                                            className="rounded-md p-2 w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor={`patioQuantity-${index}-${productIndex}`} className="block font-semibold mb-1">Cantidad Patio</label>
                                        <input
                                            type="text"
                                            id={`patioQuantity-${index}-${productIndex}`}
                                            name={`patioQuantity-${index}-${productIndex}`}
                                            value={product.patioQuantity}
                                            onChange={(e) => handleProductChange(index, productIndex, 'patioQuantity', e.target.value)}
                                            className="rounded-md p-2 w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor={`productQuantity-${index}-${productIndex}`} className="block font-semibold mb-1">Dimensiones</label>
                                        <input
                                            type="text"
                                            id={`productQuantity-${index}-${productIndex}`}
                                            name={`productQuantity-${index}-${productIndex}`}
                                            value={product.dimensions}
                                            onChange={(e) => handleProductChange(index, productIndex, 'dimensions', e.target.value)}
                                            className="rounded-md p-2 w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor={`productQuantity-${index}-${productIndex}`} className="block font-semibold mb-1">Numero HBL</label>
                                        <input
                                            type="text"
                                            id={`productQuantity-${index}-${productIndex}`}
                                            name={`productQuantity-${index}-${productIndex}`}
                                            value={product.blNumber}
                                            onChange={(e) => handleProductChange(index, productIndex, 'blNumber', e.target.value)}
                                            className="rounded-md p-2 w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block font-semibold mb-1">Dias libres</label>
                                        <input
                                            type="text"
                                            id={`freeDays-${index}-${productIndex}`}
                                            name={`freeDays-${index}-${productIndex}`}
                                            value={product.freeDays}
                                            onChange={(e) => handleProductChange(index, productIndex, 'freeDays', e.target.value)}
                                            className="rounded-md p-2 w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block font-semibold mb-1">Almacenaje Diario</label>
                                        <input
                                            type="text"
                                            id={`dayValue-${index}-${productIndex}`}
                                            name={`dayValue-${index}-${productIndex}`}
                                            value={product.dayValue}
                                            onChange={(e) => handleProductChange(index, productIndex, 'dayValue', e.target.value)}
                                            className="rounded-md p-2 w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor={`productObservations-${index}-${productIndex}`} className="block font-semibold mb-1">Observaciones</label>
                                        <textarea
                                            id={`productObservations-${index}-${productIndex}`}
                                            name={`productObservations-${index}-${productIndex}`}
                                            value={product.observations}
                                            onChange={(e) => handleProductChange(index, productIndex, 'observations', e.target.value)}
                                            className="rounded-md p-2 w-full"
                                        />
                                    </div>


                                    <button
                                        type="button"
                                        onClick={() => removeProduct(index, productIndex)} // Llama a la función removeProduct con los índices relevantes
                                        className="w-1/2 h-1/2 bg-sky-950 border-2 border-sky-950 text-white px-2 py-1 mt-8 rounded-lg text-sm hover:bg-blue-50 hover:text-sky-950"
                                    >
                                        Eliminar Bl hijo
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                ))}
                <button onClick={addNewContainerForm} className="bg-blue-900 border-2 border-blue-900 text-white px-4 py-2 mt-4 rounded-xl hover:bg-blue-50 hover:text-sky-950">
                    Agregar Nuevo Consolidador
                </button>
                <button
                    type="button"
                    onClick={removeLastContainer}
                    className="bg-sky-950 text-blue-50 px-4 ml-2 py-2 mt-4 border-2 border-sky-950 rounded-xl hover:bg-blue-50 hover:text-sky-950"
                >
                    Eliminar Contenedor
                </button>
            </div>
            <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 mt-4 rounded-xl hover:bg-red-900">
                Enviar Formulario
            </button>
        </div>
    );
};

export default EntriesForm;