'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useMyContext } from '../components/MyContext';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

export default function Home() {
  const { profile, setProfile } = useMyContext();
  //------------------------------------------------
  const { register, handleSubmit, formState: { errors } } = useForm<any>();
  //const router = useRouter()

  // Manejador para enviar el formulario
  const onSubmit = async (formData: any) => {
    console.log(formData);
    try {
      if (!formData.password || !formData.email) {
        Swal.fire({
          title: 'Fallo al inciar sesion',
          text: 'Revisa los datos de inicio de sesion',
          icon: 'warning',
          iconColor: '#001f3f',
          color: '#001f3f',
          background: '#f0f9ff',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#001f3f'
        })
      } else {
        const response = await axios.post('pages/api/auth/login', formData);
        setProfile((prevProfile: any) => ({
          ...prevProfile,
          role: response.data.role,
          id: response.data.id,
          name: response.data.name,
          customerId: response.data.customerId,
          email: response.data.email,
          password: response.data.password,
        }));
        if (response.data.status === 400) {
          Swal.fire({
            title: 'Email en uso',
            text: 'El email que intentas utilizar ya está en uso',
            icon: 'warning',
            iconColor: '#001f3f',
            color: '#001f3f',
            background: '#f0f9ff',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#001f3f'
          })
        } else {
          if (response.data.status === 200) {
            Swal.fire({
              title: 'Usuario Creado',
              text: 'Usuario registrado con éxito',
              icon: 'success',
              iconColor: '#001f3f',
              color: '#001f3f',
              background: '#f0f9ff',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#001f3f'
            })
            //router.push('/')
          }
        }
      }
    } catch (error) {
      console.error('Error durante el envío del formulario:', error);
    }
  };


  const handleLogOut = () => {
    setProfile((prevProfile: any) => ({
      ...prevProfile,
      role: "",
      id: "",
      name: "",
      customerId: "",
      email: "",
      password: "",
    }));
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-8 bg-white">
      <div className='bg-blue-900 p-8 rounded-lg text-white'>
        {profile.role === "" ? (
          <><h2 className='mb-8 text-center text-2xl font-bold'>INICIAR SESION</h2><form onSubmit={handleSubmit(onSubmit)}>
            {/* Campo de correo electrónico */}
            <div>
              <label htmlFor="email">Correo Electrónico:</label>
              <input
                type="text"
                id="field1"
                {...register("email", {
                  required: {
                    value: true,
                    message: "El email es requerido"
                  }
                })}
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-900 text-sky-950" />
            </div>

            {/* Campo de contraseña */}
            <div>
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="field3"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Ingrese contraseña"
                  }
                })}
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-900 text-sky-950" />
            </div>

            {/* Botón de enviar */}
            <button className="block rounded mb-4 px-4 py-2 text-md mt-4 text-sky-950 bg-white hover:bg-blue-200 hover:text-sky-950"
              type="submit"
            >
              Continuar
            </button>
            <Link href="/createClient" className="mt-8 group text-white underline border border-transparent transition-colors">
              Crear cuenta
            </Link>
          </form></>
        ) : (
          // Si role es igual a "", renderiza la información del perfil
          <div>
            <h2 className='mb-4 text-center text-2xl font-bold'>Información del Perfil</h2>
            <p className="mb-2">Nombre: {profile.name}</p>
            <p className="mb-2">Correo Electrónico: {profile.email}</p>
            <p className="mb-2">ID del Cliente: {profile.customerId}</p>
            <button className="block rounded mb-4 px-4 py-2 text-md mt-4 text-sky-950 bg-white hover:bg-blue-200 hover:text-sky-950"
              onClick={handleLogOut}
            >
              Cerrar sesion
            </button>
          </div>
        )}
      </div>
    </main>
  );
}