'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Entries } from '@/utils/types';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/formatDate';
import ShowEntries from '@/components/ShowEntries';
import EntryDetail from '@/components/EntryDetail';
import { useMyContext } from '@/components/MyContext';

const EntriesPage: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [selectedEntry, setSelectedEntry] = useState<Entries>({
    id: '',  //selectedEntry.id = "2"  selectedEntry.id = [[asdasd,5156156,"sadasd"]
    name: '',
    date: '',
    sealNumber: '',
    blNumber: '',
    comments: '',
    active: true,
    entryNumber: 0,
    containers: [],
  });



  const router = useRouter()
  const { profile, setProfile } = useMyContext();

  useEffect(() => {
    if (profile.role !== 'ADMIN') {
      router.push('/');
    }
  }, [profile.role, router]);
  const handleDetailsClick = (entry: Entries) => {
    if (entry) {
      setSelectedEntry(entry)
      setShowDetail(true)
    }
  };
  const closeDetail = async (value: boolean, entry: Entries | null) => {
    console.log("activo")
    if (entry) {
      try {
        // Crear un objeto que contenga los datos de entry, incluyendo containers y productos
        const dataToSend = {
          entry: entry,
          containers: entry.containers,
        };
        console.log("data")
        console.log(dataToSend)
        // Realiza una solicitud HTTP POST al servidor
        //const response = await axios.post('/pages/api/entries', dataToSend);              
      } catch (error) {
        console.error('Error al enviar datos:', error);
      }
      setShowDetail(value);
    } else {
      setShowDetail(value);
    }

  };
  return (
    <div className='mt-4 mb-12'>
      {showDetail ? (
        /*@ts-ignore*/
        <EntryDetail entry={selectedEntry} closeDetail={closeDetail} />
      ) : (
        /*@ts-ignore*/
        <ShowEntries onDetailsClick={handleDetailsClick} />
      )}
    </div>
  );
};

export default EntriesPage;