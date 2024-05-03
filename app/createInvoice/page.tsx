'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Invoice, InputRow } from '@/utils/types';
import { eInvoice } from '@/utils/eInvoice';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { emailChecker } from '@/utils/emailChecker';
import { formatDate } from '@/utils/formatDate';
import Swal from 'sweetalert2';
import { useMyContext } from '@/components/MyContext';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';

const FormPage: React.FC = () => {
  const currentDate = format(new Date(), 'dd/MM/yyyy');
  const [newSerial, setNewSerial] = useState<String>("")
  const [valueAuto, setValueAuto] = useState<Invoice[]>([]);  // aca se van a guardar los objetos que llegan para el llenado automatico
  const [inputValue, setInputValue] = useState<string>('');
  const [total, setTotal] = useState<number>(0.0);
  const [taxes, setTaxes] = useState<number>(0.0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [noComplete, setNoComplete] = useState<boolean>(false); // usado para mostrar un mensaje en caso de que el formulario este incompleto
  const [invoiceData, setInvoiceData] = useState<Invoice>({
    id: "",
    serial: "",
    userId: "",
    date: currentDate,
    customerName: "",
    customerId: "",
    total: 0,
    active: true,
    blNumber: "",
    containerNumber: "",
    nature: "",
    receiverType: "", //desplegable 01 contribuyente 02 consumidor 03 gobierno 04 extranjero
    rucType: "", // ruc type es un desplegable 1 natural 2 juridico
    paymentMethods: "", // 01: Crédito 02: Efectivo 03: Tarjeta Crédito 04: Tarjeta Débito 08: Transf./Depósito a cta. Bancaria 09: Cheque
    telephones: "",
    emails: "",
    address: "",
    eInvoiceCreated: false,
    items: [{
      description: "",
      value: "",
      tax: "",
    }],
  });
  const router = useRouter()
  const { profile, setProfile } = useMyContext();

  useEffect(() => {
    if (profile.role !== 'ADMIN') {
      router.push('/');
    }
  }, [profile.role, router]);

  if (total !== invoiceData.total) {
    setInvoiceData((prevState) => ({
      ...prevState,
      total: total,
    }));
  }

  useEffect(() => {
    const fetchData = async () => {

      if (newSerial === "") {
        try {
          const response = await axios.get('/pages/api/invoice/serial');
          setNewSerial(response.data)
          // Manejar la respuesta aquí
        } catch (error) {
          console.error('Error al obtener el serial:', error);
        }
      }
    };
    
    fetchData(); // Llama a la función fetchData para ejecutarla
  }, [newSerial]);


  async function sendData() {
    try {
      const response = await axios.post('/pages/api/invoice', invoiceData);
      setInvoiceData({
        id: "",
        eInvoiceCreated: false,
        serial: "",
        userId: "",
        date: currentDate,
        customerName: "",
        customerId: "",
        total: 0,
        active: true,
        blNumber: "",
        containerNumber: "",
        nature: "",
        receiverType: "",
        rucType: "",
        paymentMethods: "",
        telephones: "",
        emails: "",
        address: "",
        items: [{
          description: "",
          value: "",
          tax: "",
        }],
      });
      setNoComplete(false)
      setTaxes(0.0)
      setTotal(0.0)
      if (response.status === 200) {
        Swal.fire({
          title: 'Factura creada con éxito',
          icon: 'success',
          iconColor: '#001f3f',
          color: '#001f3f',
          background: '#f0f9ff',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#001f3f'
        })
      } else if (response.status === 201) {
        Swal.fire({
          title: 'Factura creada en DB',
          text: 'Falta confirmación en la creación de la factura electrónica',
          icon: 'warning',
          iconColor: '#001f3f',
          color: '#001f3f',
          background: '#f0f9ff',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#001f3f'
        })
      }
      return response.data;
    } catch (error) {
      console.error('Error al realizar la solicitud POST:', error);
    }
  }

  const handleSendForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // @ts-ignore
    setInvoiceData((prevState) => ({
      ...prevState,
      date: selectedDate,
    }));
    // @ts-ignore
    const isAnyFieldEmpty = Object.keys(invoiceData).filter((key) => key !== "serial" && key !== "userId" && key !== "id").some((key) => invoiceData[key] === "");
    if (Array.isArray(emailChecker(invoiceData.emails))) {
      // poner alerta de correos mal escritos
      Swal.fire({
        title: 'Correo inválido',
        icon: 'error',
        iconColor: '#001f3f',
        color: '#001f3f',
        background: '#f0f9ff',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#001f3f'
      })
      return
    }
    console.log(isAnyFieldEmpty)
    if (isAnyFieldEmpty) {
      setNoComplete(true);
      Swal.fire({
        title: 'Faltan campos por completar',
        icon: 'error',
        iconColor: '#001f3f',
        color: '#001f3f',
        background: '#f0f9ff',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#001f3f'
      })
      return; // Detiene el envío del formulario si hay campos vacíos
    } else {
      setNoComplete(false); // Todos los campos tienen valores válidos
    }

    const newInvoiceData = invoiceData
    newInvoiceData.date = formatDate(invoiceData.date);
    setInvoiceData(newInvoiceData)
    await sendData();
  }

  const handleInvoiceChange = (name: string, value: string) => {
    const updatedInvoice = { ...invoiceData };
    // @ts-ignore
    updatedInvoice[name] = value;
    setInvoiceData(updatedInvoice)
  }

  const sumTotal = () => {
    const validOptions = ["Alquiler", "Alquileres y Almacenaje", "Almacenaje", "Alquileres"];
    let tax: number = 0;
    let basicTax: number = 0; //usado para dar valor al impuesto individualmente en cada item del invoiceData
    const sumInput2: number = invoiceData.items
      .map((row) => {
        // Convierte input1 a minúsculas y elimina espacios en blanco alrededor
        const descriptionLowerCase = row.description.toLowerCase().trim();
        // Verifica si alguna de las opciones válidas está incluida en input1
        const isInput1Valid = validOptions.some((option) =>
          descriptionLowerCase.includes(option.toLowerCase())
        );

        if (isInput1Valid) {
          basicTax = Number(((Number(row.value) / 100) * 7).toFixed(2));
          tax += (Number(row.value) / 100) * 7;
        }
        return Number(row.value);
      })
      .reduce((acc, currentValue) => acc + currentValue, 0);
    setTaxes(Number(tax.toFixed(2)));
    setTotal(sumInput2 + tax);
    return basicTax.toString();
  };
  const handleInputChange = (rowIndex: number, inputIndex: 1 | 2, value: string) => {
    const updatedItems = [...invoiceData.items];
    if (inputIndex === 2) {
      value = value.replace(/[^0-9.]/g, '');//  Preventing characters in numbers.
      updatedItems[rowIndex].value = value;
    } else {
      updatedItems[rowIndex].description = value;
    }
    const tax: string = sumTotal();
    updatedItems[rowIndex].tax = tax;
    setInvoiceData((prevState) => ({
      ...prevState,
      items: updatedItems,
    }));
  };

  const addNewRow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (invoiceData.items.length < 7) {
      //setInputRows([...inputRows, { input1: '', input2: '' }]);
      const newItem = { description: '', value: '', tax: '' };
      setInvoiceData((prevData) => ({
        ...prevData,
        items: [...prevData.items, newItem],
      }));
    }
  };

  const removeRow = (rowIndex: number) => {
    const updatedInputRows = [...invoiceData.items];
    updatedInputRows.splice(rowIndex, 1); // Elimina la fila en el índice rowIndex
    setInvoiceData((prevData) => ({ ...prevData, items: updatedInputRows }));
    sumTotal();
  };


  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInvoiceData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setInvoiceData((prevState) => ({
        ...prevState,
        date: date.toString(),
      }));
      setSelectedDate(date)
    }
  };

  const automaticData = async (e: any) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    try {
      console.log(inputValue)
      const response = await axios.get(`/pages/api/invoice/${inputValue}`);
      console.log(response)
      if (response.status === 200) {
        setValueAuto(response.data)
      }
    } catch (error) {
      setInvoiceData({
        ...invoiceData,
        nature: "",
        receiverType: "",
        rucType: "",
        paymentMethods: "",
        telephones: "",
        emails: "",
        address: "",
        customerName: "",
        customerId: "",
      });
      Swal.fire({
        title: 'Cliente no encontrado',
        icon: 'error',
        iconColor: '#001f3f',
        color: '#001f3f',
        background: '#f0f9ff',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#001f3f'
      })
    }
  };

  const completeFields = (invoice: Invoice) => {
    setInvoiceData({
      ...invoiceData,
      blNumber: invoice.blNumber || "",
      nature: invoice.nature || "",
      receiverType: invoice.receiverType || "",
      rucType: invoice.rucType || "",
      paymentMethods: invoice.paymentMethods || "",
      telephones: invoice.telephones || "",
      emails: invoice.emails || "",
      address: invoice.address || "",
      customerName: invoice.customerName || "",
      customerId: invoice.customerId || "",
    });
  }
 
  return (
    <div className="flex flex-wrap w-full bg-blue-100 overflow-hidden h-full">
      <form className="w-5/6 bg-blue-50 shadow-blue-900 shadow-xl rounded-lg overflow-hidden mt-4 ml-12 mb-4">
        <div>
          <div className="bg-blue-900 grid grid-cols-2 mb-4">
            <div className="w-[80%] grid grid-cols-1 mb-8">
              <label htmlFor="field2" className="font-semibold mb-2 justify-center mt-4 text-sm text-white ml-4">
                SERIAL DE FACTURA : {newSerial}
              </label>
            </div>
            <div className="mr-8 grid grid-cols-1 ">
              <label htmlFor="field2" className="font-semibold mb-2 justify-center mt-4 text-sm text-white">
                TRANSALMA INTERNACIONAL S.A
              </label>
              <label htmlFor="field2" className="font-semibold mb-12 text-white justify-center text-xs">
                155707616-2-2021 DV64
              </label>
            </div>

          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sky-900">
            <div className="ml-2 mr-2">
              <label htmlFor="field2" className="block font-semibold mb-1">
                ID(RUC):
              </label>
              <input
                type="text"
                id="field2"
                name="customerId"
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-900"
                value={invoiceData.customerId}
                onChange={(e) => handleInvoiceChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="ml-2 mr-2">
              <label htmlFor="field3" className="block font-semibold mb-1">
                Nombre del cliente:
              </label>
              <input
                type="text"
                id="field3"
                name="customerName"
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-900"
                value={invoiceData.customerName}
                onChange={(e) => handleInvoiceChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="ml-2 mr-2">
              <label htmlFor="field5" className="block font-semibold mb-1">
                Número BL:
              </label>
              <input
                type="text"
                id="field5"
                name="blNumber"
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-900"
                value={invoiceData.blNumber}
                onChange={(e) => handleInvoiceChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="ml-2 mr-2">
              <label htmlFor="containerNumber" className="block font-semibold mb-1">
                Número del contenedor:
              </label>
              <input
                type="text"
                id="fieldContainer"
                name="containerNumber"
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-900"
                value={invoiceData.containerNumber}
                onChange={(e) => handleInvoiceChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="ml-2 mr-2">
              <h2 className="block font-semibold mb-1 rounded focus:border-blue-900">Selecciona una fecha:</h2>
              <DatePicker className="border rounded"
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy" // Formato de fecha 
              />
            </div>
            <div className="ml-2 mr-2">
              <h2 className="block font-semibold mb-1 focus:outline-none focus:border-blue-900">Tipo de operación:</h2>
              <select className="border rounded" value={invoiceData.nature} name="nature" onChange={handleDropdownChange}>
                <option className="focus:bg-gray-800" value="">Selecciona una opción</option>
                <option value="01">Venta</option>
                <option value="02">Exportación</option>
                <option value="03">Re-exportación</option>
                <option value="04">Venta de fuente extrajera</option>
                <option value="10">Transferencia/Traspaso</option>
                <option value="11">Devolución</option>
                <option value="20">Compra</option>
                <option value="21">Importación</option>
              </select>
            </div>
            <div className="ml-2 mr-2">
              <h2 className="block font-semibold mb-1">Tipo de cliente:</h2>
              <select className="border rounded" value={invoiceData.receiverType} name="receiverType" onChange={handleDropdownChange}>
                <option className="focus:bg-gray-800" value="">Selecciona una opción</option>
                <option value="01">Contribuyente</option>
                <option value="02">Consumidor final</option>
                <option value="03">Gobierno</option>
                <option value="04">Extranjero</option>
              </select>
            </div>
            <div className="ml-2 mr-2">
              <h2 className="block font-semibold mb-1">Tipo de RUC:</h2>
              <select className="border rounded" value={invoiceData.rucType} name="rucType" onChange={handleDropdownChange}>
                <option className="focus:bg-gray-800" value="">Selecciona una opción</option>
                <option value="01">Natural</option>
                <option value="02">Jurídico</option>
              </select>
            </div>
            <div className="ml-2 mr-2">
              <h2 className="block font-semibold mb-1">Método de pago:</h2>
              <select className="border rounded" value={invoiceData.paymentMethods} name="paymentMethods" onChange={handleDropdownChange}>
                <option className="focus:bg-gray-800" value="">Selecciona una opción</option>
                <option value="01">Crédito</option>
                <option value="02">Efectivo</option>
                <option value="03">Tarjeta Crédito</option>
                <option value="04">Tarjeta Débito</option>
                <option value="08">Transf./Depósito bancario</option>
                <option value="09">Cheque</option>
              </select>
            </div>
            <div className="ml-2 mr-2">
              <label htmlFor="field2" className="block font-semibold mb-1 ">
                Telefonos
              </label>
              <input
                type="text"
                id="telephones"
                name="telephones"
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-900"
                value={invoiceData.telephones}
                onChange={(e) => handleInvoiceChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="ml-2 mr-2">
              <label htmlFor="field2" className="block font-semibold mb-1">
                Dirección
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-900"
                value={invoiceData.address}
                onChange={(e) => handleInvoiceChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="ml-2 mr-2">
              <label htmlFor="field2" className="block font-semibold mb-1">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="emails"
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-900"
                value={invoiceData.emails}
                onChange={(e) => handleInvoiceChange(e.target.name, e.target.value)}
              />
            </div>
          </div>
        </div>
        {invoiceData.items.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3 gap-2 mt-0 text-sky-900">
            <div className="m-2">
              {rowIndex === 0 && (
                <label htmlFor={`input1-${rowIndex}`} className="font-semibold mb-1 mt-6">
                  Servicios:
                </label>
              )}
              <input
                type="text"
                id={`input1-${rowIndex}`}
                name={`input1-${rowIndex}`}
                value={row.description}
                onChange={(e) => handleInputChange(rowIndex, 1, e.target.value)}
                className="p-2 border rounded focus:outline-none focus:border-blue-900"
              />
            </div>
            <div className="m-2">
              {rowIndex === 0 && (
                <label htmlFor={`input2-${rowIndex}`} className="font-semibold mb-1 mt-6">
                  Costo:
                </label>
              )}
              <input
                type="text"
                id={`input2-${rowIndex}`}
                name={`input2-${rowIndex}`}
                value={row.value}
                onChange={(e) => handleInputChange(rowIndex, 2, e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-900"
              />
            </div>
            <div className="flex items-center w-full">
              {rowIndex === invoiceData.items.length - 1 && ( // Solo muestra el botón Eliminar para la última fila
                <button
                  onClick={() => removeRow(rowIndex)}
                  className="block font-semibold mb-1"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex  mr-44 text-sky-900">
          <label
            className="w-full p-2 block font-semibold mb-1 mt-4"
          >
            Impuestos : {Number.isNaN(taxes) ? "No use mas de un punto en el mismo número" : taxes}
          </label>
          <label
            className="w-full p-2 block font-semibold mb-1 mt-4"
          >
            Total : {Number.isNaN(total) ? "No use mas de un punto en el mismo número" : total}
          </label>
        </div>
        <div className="flex">
          <button
            onClick={addNewRow}
            className="bg-blue-900 border-2 border-blue-900 text-white px-3 py-1 rounded-md hover:bg-blue-50 hover:text-sky-950 m-4"
          >
            Agregar Fila
          </button>
        </div>
        <button
          onClick={handleSendForm}
          className="bg-blue-900 border-2 border-blue-900 text-white px-3 py-1 rounded-md hover:bg-blue-50 hover:text-sky-950 m-4"
        >
          Enviar
        </button>
      </form>
      <div className="bg-blue-50 ml-12 flex flex-col rounded rounded-md mb-12 w-5/6 shadow-lg shadow-blue-950">
        <div>
          <div className="flex items-center justify-center">
            <input className="w-[30%] text-blue-50 bg-sky-950 border border-blue-900 mt-8 placeholder-blue-50 focus:outline-none rounded-sm bg-blue-50 text-bold rounded rounded-sm"
              placeholder="Nombre del cliente..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)} />
          </div>
          <div className="flex items-center justify-center">
            <button className="w-1/6 rounded rounded-md bg-sky-950 border-2 border-blue-50 text-blue-50 px-3 py-1  mt-2 hover:bg-sky-950 hover:text-blue-50 hover:animate-pulse" onClick={automaticData}>
              Buscar
            </button>
          </div>
        </div>
        <div>
          {valueAuto.length > 0 ? (
            valueAuto.map((value, index) => (
              <button
                onClick={() => completeFields(value)}
                key={index} // Agrega una key única para cada elemento en el array
                className="bg-sky-950 border-2 border-blue-900 text-white px-3 py-1 rounded-md hover:bg-blue-50 hover:text-sky-950 m-4"
              >
                {value.customerName}
              </button>
            ))
          ) : (
            <p>No hay elementos disponibles</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default FormPage;