'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Entries } from '@/utils/types';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/formatDate';

interface ShowEntriesProps {
  onDetailsClick: (entry: Entries) => (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ShowEntries: React.FC<ShowEntriesProps> = ({ onDetailsClick }) => {
  const [entries, setEntries] = useState<Entries[]>([{
    id: '',
    name: '',
    date: '',
    sealNumber: '',
    blNumber: '',
    comments: '',
    active: true,
    entryNumber: 0,
    containers: [],
  }]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const router = useRouter();
  const entriesPerPage = 8; // Cambia el número de entradas por página
  const [selectedEntry, setSelectedEntry] = useState<Entries | null>(null);

  useEffect(() => {
    axios.get('/pages/api/entries')
      .then((response) => {
        const data = response.data;

        setEntries(data.entries.reverse());
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const filterEntries = (entry: Entries, searchTerm: string): boolean => {
    // Convertir el término de búsqueda a minúsculas para que la búsqueda sea insensible a mayúsculas/minúsculas
    const searchTermLower = searchTerm.toLowerCase();
    // Calcular el número mínimo de caracteres que deben coincidir
    const minLengthToMatch = searchTerm.length - 2;

    // Verificar si alguna propiedad de la entrada coincide con el término de búsqueda
    return (
      entry.name.toLowerCase().includes(searchTermLower) ||
      entry.sealNumber.toLowerCase().includes(searchTermLower) ||
      entry.blNumber.toLowerCase().includes(searchTermLower) ||
      entry.entryNumber.toString().includes(searchTermLower) ||
      entry.containers.some(container =>
        container.name.toLowerCase().includes(searchTermLower) ||
        container.wareHouseName.toLowerCase().includes(searchTermLower) ||
        (container.products && container.products.some(product =>
          product.name.toLowerCase().includes(searchTermLower) && product.name.length >= minLengthToMatch
        ))
      )
    );
  };

  const filteredEntries = entries.filter(entry => filterEntries(entry, searchTerm));
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const pageNumbers: number[] = [];
  for (let i = currentPage; i < (currentPage + 5); i++) {
    if (i <= Math.ceil(filteredEntries.length / entriesPerPage)) {
      pageNumbers.push(i);
    }
  }


  const onClick = (entry: Entries) => {
    onDetailsClick(entry)
  }

  const movePages = (dir: string) => {
    if (dir === 'r' && (currentPage + 2 <= Math.ceil(filteredEntries.length / entriesPerPage))) {

      setCurrentPage(currentPage + 2)
    } else if (dir === 'l' && (currentPage - 2 < 1)) {
      setCurrentPage(1)
    } else if (dir === 'l') {
      setCurrentPage(currentPage - 2)
    }
  }

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
    <div className="bg-blue-100 h-full">
      <div className="flex flex-row bg-blue-50 rounded-md shadow-md shadow-blue-900 mx-4 p-4">
        <div className="flex flex-row w-full items-center">
          <h3 className="block font-semibold p-4">Escribe lo que buscas:</h3>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            className="rounded bg-blue-900 border-blue-900 text-white focus:caret-white focus:border-white focus:border-2 w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-row h-1/2 pr-24 mt-4">
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


      <div className="flex flex-wrap">
        {currentEntries.map((entry) => (
          <div key={entry.id} className="w-1/2 p-4">
            <div className="bg-blue-50 text-white rounded-lg shadow-xl shadow-blue-900 ">
              <div className="bg-blue-900 w-full rounded-t-md">
                <h1 className="font-bold  text-center">Entrada número: 000000{entry.entryNumber}</h1>
              </div>
              <div className=" text-sky-950 p-4">
                <h3 className="font-semibold">Nombre de la Naviera: {entry.name}</h3>
                <p className="font-semibold">Número BL: {entry.blNumber}</p>
                <p className="font-semibold">Fecha de registro: {formatDate(entry.date)}</p>
                <div className="flex justify-center">
                  <button
                    className=" rounded-md border-2 border-blue-900 bg-blue-900 text-white w-1/3 mt-4 hover:bg-white hover:text-sky-950"
                    onClick={() => onClick(entry)}
                  >
                    Detalles
                  </button>
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ShowEntries;