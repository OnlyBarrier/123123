'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { User } from '@/utils/types';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CreateClient: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<User>();
    const router = useRouter()


    const onSubmit = async (formData: User) => {
        try {
            if (formData.password !== formData.confirmPassword) {
                Swal.fire({
                    title: 'Cuenta no creada',
                    text: 'Las contraseñas no coinciden',
                    icon: 'warning',
                    iconColor: '#001f3f',
                    color: '#001f3f',
                    background: '#f0f9ff',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#001f3f'
                })
            } else {
                const response = await axios.post('/pages/api/auth/login', formData);
                console.log(response)
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
                    if (response.status === 200) {
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
                        router.push('/')
                    }
                }
            }
        } catch (error) {
            console.error('Error durante el envío del formulario:', error);
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">

            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-blue-900 p-8 rounded-lg ">
                    <div>
                        <label htmlFor="field1" className="block text-sm text-white font-medium text-blue-900">
                            ID(RUC):
                        </label>
                        <input
                            type="text"
                            id="field1"
                            {...register("customerId", {
                                required: {
                                    value: true,
                                    message: "El id es requerido"
                                }
                            })}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-900"

                        />
                        {
                            errors.customerId && (
                                <span className="text-red-300">{errors.customerId.message}</span>
                            )
                        }
                    </div>
                    <div>
                        <label htmlFor="field1" className="block text-sm text-white font-medium text-blue-900">
                            Nombre:
                        </label>
                        <input
                            type="text"
                            id="field1"
                            {...register("name", {
                                required: {
                                    value: true,
                                    message: "El nombre es requerido"
                                }
                            })}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-900"

                        />
                        {
                            errors.name && (
                                <span className="text-red-300">{errors.name.message}</span>
                            )
                        }
                    </div>
                    <div>
                        <label htmlFor="field2" className="block  text-white text-sm font-medium">
                            Email:
                        </label>
                        <input
                            type="text"
                            id="field2"
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: "Email inválido"
                                }
                            })}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-900"
                        />
                        {
                            errors.email && (
                                <span className="text-red-300">{errors.email.message}</span>
                            )
                        }
                    </div>
                    <div>
                        <label htmlFor="field3" className="block text-white text-sm font-medium ">
                            Contraseña:
                        </label>
                        <input
                            type="password"
                            id="field3"
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: "Ingrese contraseña"
                                }
                            })}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-900"
                        />
                        {
                            errors.password && (
                                <span className="text-red-300">{errors.password.message}</span>
                            )
                        }
                    </div>
                    <div>
                        <label htmlFor="field4" className="block text-sm font-medium text-white">
                            Confirmar contraseña:
                        </label>
                        <input
                            type="password"
                            id="field4"
                            {...register("confirmPassword", {
                                required: {
                                    value: true,
                                    message: "Confirme contraseña"
                                }
                            })}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-900"
                        />
                        {
                            errors.confirmPassword && (
                                <span className="text-red-300">{errors.confirmPassword.message}</span>
                            )
                        }
                    </div>
                    <div>
                        <button className="block rounded px-4 py-2 text-md mt-4 text-sky-950 bg-white hover:bg-blue-200 hover:text-sky-950"
                            type="submit"
                        >
                            Crear cuenta
                        </button>
                        <Link href="/">
                            <h2 className="mt-2 text-sm underline text-white">
                                Iniciar sesión{" "}
                            </h2>
                        </Link>

                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateClient;
