'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteEntries: React.FC = () => {

    // useEffect(() => {
    //   if (profile.role !== 'ADMIN') {
    //     router.push('/');
    //   }
    // }, [profile.role, router]);

    const borrar = () =>{
        axios.get(`/pages/api/deleteEntries`)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error('Error al obtener los datos:', error);
            });
    }

    return (
        <button className="mt-64" onClick={() => borrar()}>
            Eliminar Entries
        </button>
    );
};

export default DeleteEntries;