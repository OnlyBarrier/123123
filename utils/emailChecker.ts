export function emailChecker(emails: string): boolean | string[] {
  // Dividir la cadena en correos electrónicos individuales usando una coma como separador
  const correos: string[] = emails.split(",");
  // Expresión regular para verificar la estructura básica de un correo electrónico
  const regexEmail: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  // Variable para almacenar correos no válidos
  const invalidEmails: string[] = [];
  // Iterar a través de cada correo electrónico y verificarlo
  correos.forEach((correo) => {
    const emailWithoutSpace: string = correo.trim(); // Eliminar espacios en blanco alrededor del correo
    if (!regexEmail.test(emailWithoutSpace)) {
      invalidEmails.push(emailWithoutSpace); // Agregar correo no válido a la lista
    }
  });
  if (invalidEmails.length === 0) {
    return true; // Todos los correos están bien escritos
  } else {
    return invalidEmails; // Devolver la lista de correos no válidos
  }
}
