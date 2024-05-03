'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMyContext } from '@/components/MyContext';
import { useRouter } from 'next/navigation';

const BdConsult: React.FC = () => {
    const [data, setData] = useState<any>({
        consult: "",
        pass: "",
    });
    const [response, setResponse] = useState("")

    const handleChange = (newData: string, name: string) => {
        setData({ ...data, [name]: newData });
    }

    const router = useRouter()
    const { profile, setProfile } = useMyContext();
  
    useEffect(() => {
      if (profile.role !== 'ADMIN') {
        router.push('/');
      }
    }, [profile.role, router]);

    const callDB = async () => {
        try {
            const response = await axios.post('/pages/api/SQL', data);
            const resultString = JSON.stringify(response.data.result);
            setResponse(resultString);
        } catch (error) {
            console.error('Error al enviar la consulta:', error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className='text-xl text-sky-950 font-bold mb-4'>CONSULTAS A LA BASE DE DATOS</h1>
            <textarea
                className="text-md text-sky-950 font-semibold w-96 h-48 p-2 border border-gray-300 rounded-md resize-none"
                placeholder='Ingresa la consulta entre comillas dobles " " '
                name="consult"
                value={data.consult}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
            >
            </textarea>
            <input className="mt-2 text-sky-950 border focus:border-sky-950 focus:ring-blue-950"
                name="pass"
                value={data.pass}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
            />
            <button className="bg-blue-900 border-2 border-blue-900 text-white px-3 py-1 rounded-md hover:bg-blue-50 hover:text-sky-950 m-4"
            onClick={callDB}
            >
                Enviar Consulta
            </button>

            {response != "" && 
            <textarea
                className="text-md text-sky-950 font-semibold w-96 h-48 p-2 border border-gray-300 rounded-md"
                name="response"
                value={response}
            >
            </textarea>}

        </div>
    );
};

export default BdConsult;