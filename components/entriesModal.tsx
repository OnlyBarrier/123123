// EntryModal.tsx
'use client'
import React from 'react';
import ReactModal from 'react-modal';
import { Entries } from '@/utils/types';
import { formatDate } from '@/utils/formatDate';

interface EntryModalProps {
  entry: Entries;
  isOpen: boolean;
  onClose: () => void;
}

const EntryModal: React.FC<EntryModalProps> = ({ entry, isOpen, onClose }) => {
  return (
    <ReactModal className="bg-gray-900 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 p-4 rounded-md shadow-lg"
      isOpen={isOpen} onRequestClose={onClose}>

      <button className="absolute top-2 right-2 rounded bg-gray-200 text-black hover:bg-gray-400 focus:outline-none focus:ring focus:ring-neutral-300 block font-semibold" onClick={onClose}>Cerrar</button>
      <div className="grid  grid-cols-2">
        <div>
          <form className="overflow-hidden grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="w-3/4 ml-2 mr-2">
              <label htmlFor="entryNumber" className="block font-semibold mb-1">Entrada número:</label>
              <input
                id="entryNumber"
                disabled
                value={"0000000" + entry.entryNumber}
                className="bg-white rounded-md p-2 w-full block font-semibold text-black"
              />
            </div>
            <div className="w-3/4 ml-2 mr-2">
              <h2 className="block font-semibold mb-1">Fecha de creación:</h2>
              <input
                disabled
                type="text"
                id="name"
                value={formatDate(entry.date)}
                className="bg-white rounded-md p-2 w-full block font-semibold text-black"
              />
            </div>

            <div className="w-3/4 ml-2 mr-2">
              <label htmlFor="name" className="block font-semibold mb-1">Nombre de naviera</label>
              <input
                disabled
                id="name"
                value={entry.name}
                className="bg-white rounded-md p-2 w-full block font-semibold text-black"
              />
            </div>
            <div className="w-3/4 ml-2 mr-2">
              <label htmlFor="sealNumber" className="block font-semibold mb-1">Número del Sello</label>
              <input
                disabled
                type="text"
                id="sealNumber"
                value={entry.sealNumber}
                className="bg-white rounded-md p-2 w-full block font-semibold text-black"
              />
            </div>
            <div className="w-3/4 ml-2 mr-2">
              <label htmlFor="blNumber" className="block font-semibold mb-1">Número de BL</label>
              <input
                disabled
                type="text"
                id="blNumber"
                value={entry.blNumber}
                className="bg-white rounded-md p-2 w-full block font-semibold text-black"
              />
            </div>
            <div className="w-full ml-2 mr-2">
              <label htmlFor="comments" className="block font-semibold mb-1">Detalles</label>
              <textarea
                disabled
                id="comments"
                value={entry.comments}
                className="bg-white rounded-md p-2 w-4/5 block font-semibold text-black"
              />
            </div>

          </form>
        </div>
        <div >
          <h3 className="block font-semibold mb-1 mt-2 ">Contenedores:</h3>
          <form className="overflow-hidden grid grid-cols-2 md:grid-cols-3 gap-4">
            {entry.containers.map((container) => (
              <div key={container.ruc}>
                <label htmlFor="blNumber" className="block font-semibold mb-1">Número del contenedor:</label>
                <input
                  disabled
                  type="text"
                  id="containerNumber"
                  value={container.containerNumber}
                  className="bg-white rounded-md p-2 w-full block font-semibold text-black"
                />
                <label htmlFor="blNumber" className="block font-semibold mb-1">Nombre del Cliente:</label>
                <input
                  disabled
                  type="text"
                  id="containerName"
                  value={container.name}
                  className="bg-white rounded-md p-2 w-full block font-semibold text-black"
                />
                <label htmlFor="blNumber" className="block font-semibold mb-1">Bodega:</label>
                <input
                  disabled
                  type="text"
                  id="wareHouseName"
                  value={container.wareHouseName}
                  className="bg-white rounded-md p-2 w-full block font-semibold text-black"
                />
                <label htmlFor="blNumber" className="block font-semibold mb-1">RUC:</label>
                <input
                  disabled
                  type="text"
                  id="ruc"
                  value={container.ruc}
                  className="bg-white rounded-md p-2 w-full block font-semibold text-black"
                />
                <label htmlFor="blNumber" className="block font-semibold mb-1">Observaciones:</label>
                <input
                  disabled
                  type="text"
                  id="description"
                  value={container.description}
                  className="bg-white rounded-md p-2 w-full block font-semibold text-black"
                />

                <h4 className="block font-semibold mb-1 mt-2">{container.products.length === 0 ? "Contenedor sin productos o sellado" : "Productos en el contenedor:"} </h4>
                <form className="overflow-hidden grid grid-cols-2 md:grid-cols-3 gap-4"></form>
                {container.products.map((product) => (
                  <div key={product.blNumber}>
                    <label htmlFor="blNumber" className="block font-semibold mb-1">Tipo de producto:</label>
                    <input
                      disabled
                      type="text"
                      id="name"
                      value={product.name}
                      className="bg-white rounded-md p-2 w-full block font-semibold text-black"
                    />
                    <label htmlFor="blNumber" className="block font-semibold mb-1">Cantidad:</label>
                    <input
                      disabled
                      type="text"
                      id="quantity"
                      value={product.nationalQuantity}
                      className="bg-white rounded-md p-2 w-full block font-semibold text-black"
                    />
                    <label htmlFor="blNumber" className="block font-semibold mb-1">Dimensiones:</label>
                    <input
                      disabled
                      type="text"
                      id="dimensions"
                      value={product.dimensions}
                      className="bg-white rounded-md p-2 w-full block font-semibold text-black"
                    />
                    <label htmlFor="blNumber" className="block font-semibold mb-1">Número BL:</label>
                    <input
                      disabled
                      type="text"
                      id="blNumber"
                      value={product.blNumber}
                      className="bg-white rounded-md p-2 w-full block font-semibold text-black"
                    />
                  </div>
                ))}
                <form />
              </div>
            ))}
          </form>
        </div>

      </div>

    </ReactModal>
  );
};

export default EntryModal;


