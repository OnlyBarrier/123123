import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Importa el estilo CSS

const CustomDatePicker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  return (
    <div className="custom-datepicker">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy" // Personaliza el formato de fecha
        placeholderText="Selecciona una fecha" // Texto del placeholder
        className="custom-datepicker-input" // Clase CSS personalizada para el input
        calendarClassName="custom-datepicker-calendar" // Clase CSS personalizada para el calendario
        popperClassName="custom-datepicker-popper" // Clase CSS personalizada para el contenedor del calendario
        // Puedes agregar más propiedades y estilos según tus necesidades
      />
    </div>
  );
};

export default CustomDatePicker;
