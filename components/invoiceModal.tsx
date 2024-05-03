// EntryModal.tsx
'use client'
import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { Invoice } from '@/utils/types';
import { formatDate } from '@/utils/formatDate';
import DatePicker from "react-datepicker";

interface InvoiceModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: (arg: any) => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, isOpen, onClose }) => {
  const [invoiceData, setInvoiceData] = useState<any>(invoice);


  const handleInvoiceChange = (name: string, value: string) => {
    const updatedInvoice = { ...invoiceData };
    // @ts-ignore
    updatedInvoice[name] = value;
    setInvoiceData(updatedInvoice)
  }
  const handleInputChange = (rowIndex: number, inputIndex: 1 | 2, value: string) => {
    const updatedItems = [...invoiceData.items];
    if (inputIndex === 2) {
      value = value.replace(/[^0-9.]/g, '');//  Preventing characters in numbers.
      updatedItems[rowIndex].value = value;
    } else {
      updatedItems[rowIndex].description = value;
    }
    setInvoiceData((prevState: any) => ({
      ...prevState,
      items: updatedItems,
    }));
  };
  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInvoiceData((prevState: any) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const removeRow = (rowIndex: number) => {
    const updatedInputRows = [...invoiceData.items];
    updatedInputRows.splice(rowIndex, 1); // Elimina la fila en el índice rowIndex
    setInvoiceData((prevData: any) => ({ ...prevData, items: updatedInputRows }));
  };

  const addNewRow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (invoiceData.items.length < 7) {
      //setInputRows([...inputRows, { input1: '', input2: '' }]);
      const newItem = { description: '', value: '', tax: '' };
      setInvoiceData((prevData: { items: any; }) => ({
        ...prevData,
        items: [...prevData.items, newItem],
      }));
    }
  };

  const handleCancel = () => {
    onClose(null);
  };

  const handleCheckboxChange = () => {
    setInvoiceData((prevState:Invoice) => ({
      ...prevState,
      eInvoiceCreated: !prevState.eInvoiceCreated,
    }));
  };

  return (
    <ReactModal className="bg-sky-950 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 p-4 rounded-md shadow-lg"
      isOpen={isOpen} onRequestClose={() => onClose(null)}>
      <button className="absolute bottom-8 right-8 bg-blue-900 border-2 border-blue-900 text-white px-3 py-1 rounded-md hover:bg-blue-50 hover:text-sky-950" onClick={() => onClose(invoiceData)}>
        Guardar
      </button>

      <button className="absolute bottom-8 right-40 bg-sky-950  border-2 border-sky-950 text-white px-3 py-1 rounded-md  hover:bg-blue-50 hover:text-sky-950" onClick={handleCancel}>
        Cancelar
      </button>
      <form className="bg-blue-50 shadow-blue-900 shadow-xl rounded-lg overflow-hidden mt-4">
        <div className="">
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
              <input
                type="text"
                id="fieldContainer"
                name="date"
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-900"
                value={invoiceData.date}
                onChange={(e) => handleInvoiceChange(e.target.name, e.target.value)}
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
            <div className="ml-2 mr-2">
              <label htmlFor="field2" className="block font-semibold mb-1">
                Serial
              </label>
              <input
                type="text"
                id="serial"
                name="serial"
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-900"
                value={invoiceData.serial}
                onChange={(e) => handleInvoiceChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="ml-2 mr-2">
              <label htmlFor="eInvoiceCheckbox" className="block font-semibold mb-1">
                Factura Electrónica Creada:
              </label>
              <input
                type="checkbox"
                id="eInvoiceCheckbox"
                name="eInvoiceCreated"
                checked={invoiceData.eInvoiceCreated}
                onChange={handleCheckboxChange}
                className="p-2 border rounded focus:outline-none focus:border-blue-900"
              />
            </div>
          </div>
        </div>
        {invoiceData.items.map((row: any, rowIndex: any) => (
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
            Impuestos : {Number.isNaN(invoiceData.tax) ? "No use mas de un punto en el mismo número" : invoiceData.tax}
          </label>
          <label
            className="w-full p-2 block font-semibold mb-1 mt-4"
          >
            Total : {Number.isNaN(invoiceData.total) ? "No use mas de un punto en el mismo número" : invoiceData.total}
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
      </form>
    </ReactModal>
  );
};

export default InvoiceModal;


