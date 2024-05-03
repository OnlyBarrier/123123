export const formatDate = (dateString: string) => {
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
