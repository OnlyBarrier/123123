'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Entries, Containers, Products, Exits } from '@/utils/types';
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2';
import "react-datepicker/dist/react-datepicker.css";


interface DetailsProps {
  entry: Entries; // Definimos la propiedad entry de tipo Entries
  closeDetail: (value: boolean, entry: Entries | null) => () => void;
}
const EntryDetail: React.FC<DetailsProps> = ({ entry, closeDetail }) => {
  const [exit, setExit] = useState<Exits>({
    liqNumber: '',
    date: '',
    quantity: '',
    transCompany: '',
    driverName: '',
    truckPlate: '',
    productId: 'none',
    exitType: '1',
  })
  const [updatedEntry, setUpdatedEntry] = useState<Entries>({
    id: entry.id,
    name: entry.name,
    date: entry.date,
    sealNumber: entry.sealNumber,
    blNumber: entry.blNumber,
    comments: entry.comments,
    active: true,
    entryNumber: entry.entryNumber,
    containers: [],
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(entry.date));
  const [newContainers, setNewContainers] = useState<Containers[]>(entry.containers);

  const handleDateChange = (date: Date | null | string) => {
    if (date instanceof Date) {
      setUpdatedEntry((prevState) => ({
        ...prevState,
        date: date.toString(),
      }));
      setSelectedDate(date);
    } else if (typeof date === 'string') {
      // Aquí puedes manejar la lógica para convertir la cadena de fecha a Date si es necesario
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        setUpdatedEntry((prevState) => ({
          ...prevState,
          date: parsedDate.toString(),
        }));
        setSelectedDate(parsedDate);
      }
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
    setUpdatedEntry((prevEntry) => {
      const updatedEntry = { ...prevEntry };
      updatedEntry.containers[index] = {
        ...updatedEntry.containers[index],
        [field]: value,
      };
      return updatedEntry;
    });
  };
  const handleProductChange = (containerIndex: number, productIndex: number, field: string, value: string) => {
    if (field === "freeDays" || field === "dayValue" || field === "quantity" || field === "exitQuantity") {
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
        date: '',
        payment: '',
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
        exitDate: ''
      });

      return updatedContainers;
    });
  };
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
    setUpdatedEntry((prevEntry) => ({
      ...prevEntry,
      containers: [...prevEntry.containers, newContainer],
    }));
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
  const removeLastContainer = () => {
    if (newContainers.length > 0) {
      const updatedContainers = [...newContainers];
      updatedContainers.pop(); // Elimina el último elemento del arreglo
      setNewContainers(updatedContainers);
    }
  };

  const returnBack = () => {
    closeDetail(false, null)
  };
  const saveData = async () => {
    updatedEntry.containers = newContainers;
    let hasError = false;


    if (!hasError) {
      try {
        // Realiza la solicitud put a la API con Axios, enviando toda la entrada
        const response = await axios.put('/pages/api/entries', updatedEntry);
        console.log(response.data); // Muestra la respuesta de la API en la consola
        // Cierra el detalle después de la eliminación exitosa
        closeDetail(false, updatedEntry);
      } catch (error) {
        //error conección DB
      }
    } else {
      console.error('Error en los datos, revise la cantidad de salida');
    }

  };



  const createExit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, product: Products) => {
    setExit({ ...exit, productId: product.id })
    event.preventDefault();
    let hasError: boolean = false;
    console.log(hasError)
    switch (exit.exitType) {
      case "1":
        hasError = parseInt(product.nationalQuantity) < parseInt(exit.quantity)
        console.log(hasError)
        break;
      case "2":
        hasError = parseInt(product.zoneFQuantity) < parseInt(exit.quantity);
        break;
      case "3":
        hasError = parseInt(product.patioQuantity) < parseInt(exit.quantity);
        break;
      case "4":
        console.log("4")
        hasError = parseInt(product.zoneFQuantity) < parseInt(exit.quantity);
        console.log(hasError)
        break;
    }

    if (hasError) {
      Swal.fire({
        title: 'La salida tiene valores inválidos',
        icon: 'error',
        iconColor: '#001f3f',
        color: '#001f3f',
        background: '#f0f9ff',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#001f3f'
      })
    } else {
      try {
        const response = await axios.post(`/pages/api/exits`, exit);
        if (response.status === 200) {
          Swal.fire({
            title: 'Salida Creada',
            text: 'salida creada exitósamente',
            icon: 'warning',
            iconColor: '#001f3f',
            color: '#001f3f',
            background: '#f0f9ff',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#001f3f'
          })
          setExit({
            liqNumber: '',
            date: '',
            quantity: '',
            transCompany: '',
            driverName: '',
            truckPlate: '',
            productId: 'none',
            exitType: '1',
          })
          console.log(updatedEntry.id)
          const response = await axios.get(`/pages/api/entries/${updatedEntry.id}`);
          console.log(response.data.updatedEntry)
          if (response.data.status === 200) {
            console.log(response.data)
            setUpdatedEntry(response.data.updatedEntry);
            console.log(updatedEntry)
            setNewContainers(response.data.updatedEntry.containers);
          }
        }
      } catch (error) {
        console.log(error)
        Swal.fire({
          title: 'No se pudo crear la salida',
          icon: 'error',
          iconColor: '#001f3f',
          color: '#001f3f',
          background: '#f0f9ff',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#001f3f'
        })
      }
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Verificar si el valor es un número utilizando la función isNaN
    if (!isNaN(Number(value))) {
      // Si es un número, actualiza el estado
      setExit({ ...exit, quantity: value });
    }
    // Si no es un número, no actualiza el estado (permite solo números)
  };

  if (!entry) {
    return <div>No hay detalles disponibles</div>;
  }
  return (
    <div>
      <div className='ml-8 mb-4 flex flex-row justify-center'>

        <button onClick={returnBack} className="w-1/8 h-1/2 bg-sky-950 border-2 border-sky-950 text-white px-2 py-1 mt-8 rounded-lg text-sm hover:bg-blue-50 hover:text-sky-950">
          Atras
        </button>
        <button onClick={saveData} className="w-1/8 ml-8 h-1/2 bg-sky-950 border-2 border-sky-950 text-white px-2 py-1 mt-8 rounded-lg text-sm hover:bg-blue-50 hover:text-sky-950">
          Guardar
        </button>
      </div>

      <div className="ml-8 mr-8">
        <div className="bg-blue-900 text-white text-center py-2 rounded-md font-bold">
          <h2>Crear Nueva Entrada</h2>
        </div>
        <form className="bg-blue-50 text-sky-950 shadow-lg rounded-lg overflow-hidden grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="w-3/4 ml-2 mr-2">
            <h2 className="block font-semibold mb-1 rounded focus:border-blue-900">Selecciona una fecha:</h2>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecciona una fecha"
              className="custom-datepicker-input"
              calendarClassName="custom-datepicker-calendar"
              popperClassName="custom-datepicker-popper"
            />
          </div>
          <div className="w-3/4 ml-2 mr-2">
            <label htmlFor="name" className="block font-semibold mb-1">Nombre de naviera</label>
            <input
              type="text"
              id="name"
              value={updatedEntry.name}
              onChange={(e) => setUpdatedEntry({ ...entry, name: e.target.value })}
              className="rounded-md p-2 w-full"
            />
          </div>
          <div className="w-3/4 ml-2 mr-2">
            <label htmlFor="sealNumber" className="block font-semibold mb-1">Número del Sello</label>
            <input
              type="text"
              id="sealNumber"
              value={updatedEntry.sealNumber}
              onChange={(e) => setUpdatedEntry({ ...entry, sealNumber: e.target.value })}
              className="rounded-md p-2 w-full"
            />
          </div>
          <div className="w-3/4 ml-2 mr-2">
            <label htmlFor="blNumber" className="block font-semibold mb-1">Número BL master</label>
            <input
              type="text"
              id="blNumber"
              value={updatedEntry.blNumber}
              onChange={(e) => setUpdatedEntry({ ...entry, blNumber: e.target.value })}
              className="rounded-md p-2 w-full"
            />
          </div>
          <div className="w-full ml-2 mr-2">
            <label htmlFor="comments" className="block font-semibold mb-1">Detalles</label>
            <textarea
              id="comments"
              value={updatedEntry.comments}
              onChange={(e) => setUpdatedEntry({ ...entry, comments: e.target.value })}
              className="rounded-md p-2 w-1/2 h-24"
            />
          </div>

        </form>
        <div className="bg-sky-950 text-white text-bold text-center py-2 mt-4 rounded-t-lg " >
          <h2>CONTENEDORES</h2>
        </div>
        <div>
          {newContainers.map((container, index) => (
            <div key={index}>
              <h2 className="text-xl text-white font-semibold text-center bg-blue-900 overflow-hidden">Datos del consolidador</h2>
              <form key={index} className="bg-blue-50 text-blue-900 shadow-lg rounded-bl-lg rounded-br-lg overflow-hidden grid grid-cols-2 md:grid-cols-3 gap-4">
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
                {/* <button
                  type="button"
                  onClick={() => addNewProduct(index)}
                  className="w-1/2 h-1/2 bg-blue-900 border-2 border-blue-900 text-white px-2 py-1 mt-4 rounded-lg text-sm hover:bg-blue-50 hover:text-sky-950"
                >
                  Agregar Bl hijo
                </button> */}
              </form>
              <h2 className="text-xl text-white font-semibold text-center rounded-t-lg bg-blue-900 overflow-hidden">HBL</h2>
              {container.products.map((product, productIndex) => (

                <div key={productIndex}>

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
                      <label htmlFor={`productQuantity-${index}-${productIndex}`} className="block font-semibold mb-1">Cantidad Bodega Nacional</label>
                      <input
                        type="text"
                        id={`nationalQuantity-${index}-${productIndex}`}
                        name={`nationalQuantity-${index}-${productIndex}`}
                        value={product.nationalQuantity}
                        onChange={(e) => handleProductChange(index, productIndex, 'nationalQuantity', e.target.value)}
                        className="rounded-md p-2 w-full"
                        readOnly
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor={`productQuantity-${index}-${productIndex}`} className="block font-semibold mb-1">Cantidad Zona Franca</label>
                      <input
                        type="text"
                        id={`zoneFQuantity-${index}-${productIndex}`}
                        name={`zoneFQuantity-${index}-${productIndex}`}
                        value={product.zoneFQuantity}
                        onChange={(e) => handleProductChange(index, productIndex, 'zoneFQuantity', e.target.value)}
                        className="rounded-md p-2 w-full"
                        readOnly
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor={`productQuantity-${index}-${productIndex}`} className="block font-semibold mb-1">Cantidad Patio</label>
                      <input
                        type="text"
                        id={`patioQuantity-${index}-${productIndex}`}
                        name={`patioQuantity-${index}-${productIndex}`}
                        value={product.patioQuantity}
                        onChange={(e) => handleProductChange(index, productIndex, 'patioQuantity', e.target.value)}
                        className="rounded-md p-2 w-full"
                        readOnly
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
                      <label htmlFor={`productQuantity-${index}-${productIndex}`} className="block font-semibold mb-1">HBL</label>
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
                      <label className="block font-semibold mb-1">Dias Libres</label>
                      <input
                        type="text"
                        id={`freeDays-${index}-${productIndex}`}
                        name={`freeDays-${index}-${productIndex}`}
                        value={product.freeDays}
                        onChange={(e) => handleProductChange(index, productIndex, 'freeDays', e.target.value)}
                        className="rounded-md p-2 w-full"
                        readOnly
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block font-semibold mb-1">Almacenaje diario</label>
                      <input
                        type="text"
                        id={`dayValue-${index}-${productIndex}`}
                        name={`dayValue-${index}-${productIndex}`}
                        value={product.dayValue}
                        onChange={(e) => handleProductChange(index, productIndex, 'dayValue', e.target.value)}
                        className="rounded-md p-2 w-full"
                        readOnly
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
                    {/* <button
                      type="button"
                      onClick={() => removeProduct(index, productIndex)} // Llama a la función removeProduct con los índices relevantes
                      className="w-1/2 h-1/2 bg-sky-950 border-2 border-sky-950 text-white px-2 py-1 mt-8 rounded-lg text-sm hover:bg-blue-50 hover:text-sky-950"
                    >
                      Eliminar Bl hijo
                    </button> */}
                    <button
                      type="button"
                      onClick={() => setExit({ ...exit, productId: product.id })} // Llama a la función removeProduct con los índices relevantes
                      className="w-1/2 h-1/2 bg-red-800 border-2 border-red-900 text-white px-2 py-1 mt-8 rounded-lg text-sm hover:bg-blue-50 hover:text-red-900"
                    >
                      Registrar Salida
                    </button>
                  </form>
                  {exit.productId === product.id &&
                    <form className="bg-blue-50 text-sky-950 shadow-lg rounded-lg overflow-hidden mt-4 p-4 flex flex-wrap">
                      <div className='mx-2'>
                        <label className="block font-semibold mb-1"># Liquidacion</label>
                        <input
                          id={`liqNumber-${index}-${productIndex}`}
                          name={`liqNumber-${index}-${productIndex}`}
                          value={exit.liqNumber}
                          onChange={(e) => setExit({ ...exit, liqNumber: e.target.value })}
                          className="rounded-md p-2 w-full"
                        />
                      </div>
                      <div className='mx-2'>
                        <label className="block font-semibold mb-1">Cantidad</label>
                        <input
                          id={`exitQuantity-${index}-${productIndex}`}
                          name={`exitQuantity-${index}-${productIndex}`}
                          value={exit.quantity}
                          onChange={handleQuantityChange}
                          className="rounded-md p-2 w-full"
                        />
                      </div>
                      <div className='mx-2'>
                        <label className="block font-semibold mb-1">Compañía de transportes</label>
                        <input
                          id={`transCompany-${index}-${productIndex}`}
                          name={`transCompany-${index}-${productIndex}`}
                          value={exit.transCompany}
                          onChange={(e) => setExit({ ...exit, transCompany: e.target.value })}
                          className="rounded-md p-2 w-full"
                        />
                      </div>
                      <div className='mx-2'>
                        <label className="block font-semibold mb-1">Nombre del conductor</label>
                        <input
                          id={`driverName-${index}-${productIndex}`}
                          name={`driverName-${index}-${productIndex}`}
                          value={exit.driverName}
                          onChange={(e) => setExit({ ...exit, driverName: e.target.value })}
                          className="rounded-md p-2 w-full"
                        />
                      </div>
                      <div className='mx-2'>
                        <label className="block font-semibold mb-1">Placa</label>
                        <input
                          id={`truckPlate-${index}-${productIndex}`}
                          name={`truckPlate-${index}-${productIndex}`}
                          value={exit.truckPlate}
                          onChange={(e) => setExit({ ...exit, truckPlate: e.target.value })}
                          className="rounded-md p-2 w-full"
                        />
                      </div>
                      <div>
                        <h1>Tipo de salida</h1>
                        <select multiple={false} onChange={(e) => setExit({ ...exit, exitType: e.target.value })}>
                          <option value="1">Nacionalizada ➡ Salida</option>
                          <option value="2">Zona Franca ➡ Salida</option>
                          <option value="3">Patio ➡ Salida</option>
                          <option value="4">Zona Franca ➡ Nacionalizada</option>
                        </select>
                      </div>
                      <div className='mx-2'>
                        <button onClick={(e) => createExit(e, product)} className="bg-red-800 border-2 border-red-900 text-white px-4 py-2 mt-4 rounded-xl hover:bg-blue-50 hover:text-red-900">
                          Guardar Salida
                        </button>

                      </div>
                      <div className='mx-2'>
                        <button onClick={() => setExit({ ...exit, productId: 'none' })} className="bg-sky-950 border-2 border-blue-900 text-white px-4 py-2 mt-4 rounded-xl hover:bg-blue-50 hover:sky-950">
                          Cancelar
                        </button>
                      </div>
                    </form>
                  }
                </div>
              ))}
            </div>
          ))}
          {/* <button onClick={addNewContainerForm} className="bg-blue-900 border-2 border-blue-900 text-white px-4 py-2 mt-4 rounded-xl hover:bg-blue-50 hover:text-sky-950">
            Agregar Nuevo contenedor
          </button> */}
          {/* <button
            type="button"
            onClick={removeLastContainer}
            className="bg-sky-950 text-blue-50 px-4 ml-2 py-2 mt-4 border-2 border-sky-950 rounded-xl hover:bg-blue-50 hover:text-sky-950"
          >
            Eliminar Contenedor
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default EntryDetail;