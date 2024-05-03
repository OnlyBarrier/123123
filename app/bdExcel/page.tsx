'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Invoice, Items } from '@/utils/types';
import { formatDate } from '@/utils/formatDate';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';
import { useMyContext } from '@/components/MyContext';

const BdExcel: React.FC = () => {
    const [data, setData] = useState<Invoice[]>([]);

    const router = useRouter()
    const { profile, setProfile } = useMyContext();
  
    useEffect(() => {
      if (profile.role !== 'ADMIN') {
        router.push('/');
      }
    }, [profile.role, router]);

    useEffect(() => {
        // Realizar la solicitud GET a la API al cargar el componente
        const active = true;
        axios.get(`/pages/api/invoice?active=${active}`)

            .then((response) => {
                const modifiedData = response.data.map((invoice:any) => {
                    // Eliminar los campos "updatedAt" y "createdAt"
                    const { updatedAt, id, userId, createdAt, active, ...rest } = invoice;
                    return rest;
                });
                setData(modifiedData)
            })
            .catch((error) => {
                console.error('Error al obtener los datos:', error);
            });
    }, []);

    const formatItems = (items: Items[]) => {
        return items.map(item => {
            return `description:${item.description}, value:${item.value}, tax:${item.tax}`;
        }).join('; '); // Separador entre items
    };

    const toExcel = () => {
        const newData = data.map((invoice) => {
            const itemsString = formatItems(invoice.items);
            return { ...invoice, items: itemsString };
        });

        const ws = XLSX.utils.json_to_sheet(newData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
        XLSX.writeFile(wb, 'invoices.xlsx');
    };

    return (
        <></>
        // <button className="mt-64" onClick={() => toExcel()}>
        //     CREAR EXCEL
        // </button>
    );
};

export default BdExcel;