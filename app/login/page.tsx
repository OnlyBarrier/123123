'use client'
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';

// Componente de inicio de sesión
const Login: React.FC = () => {
  // Estados para los campos de entrada
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Manejador para enviar el formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
    
    } catch (error) {
      console.error('Error durante la autenticación:', error);
    }
  };

  return (
    <div className="">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo de correo electrónico */}
        <div>
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Campo de contraseña */}
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Botón de enviar */}
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;