'use client'
import { User } from '../utils/types';
import React, { createContext, useContext, ReactNode, useState } from 'react';

// Crear el contexto
const MyContext = createContext<any | undefined>(undefined);

// Definir un hook para acceder al contexto
const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext debe usarse dentro de un proveedor MyContext');
  }
  return context;
};

// Crear el componente proveedor del contexto
const MyContextProvider = ({ children }: { children: ReactNode }) => {
  // Estado para almacenar el valor
  const [profile, setProfile] = useState<User>({
    id: "",
    name: "",
    customerId: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  // Proporcionar el valor y la función para cambiarlo en el contexto
  const contextValue = { profile, setProfile };

  return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
};

export { MyContext, MyContextProvider, useMyContext };