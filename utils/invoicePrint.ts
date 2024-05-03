import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "./formatDate";
import logoC from "./img.png"; // Asegúrate de que la ruta sea correcta
import { table } from "console";

export const invoicePrint = (item: any) => {
  // Crear una nueva instancia de jsPDF
  const doc = new jsPDF();

  // Verifica si logoC es una URL válida

  // var image = new Image();

  // image.src = "./img.png";

  // doc.addImage(image, 10, 10, 200, 200);

  // Estilo del título
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text("TRANSALMA INTERNACIONAL S.A", 80, 20);
  doc.setFontSize(14);
  doc.text("155707616-2-2021 DV64", 95, 30);
  doc.setFontSize(10);
  doc.text("transalmainternacional@gmail.com", 100, 35);

  // Información de la factura
  doc.setFontSize(12);
  doc.text(`Factura con serial:   ${item.serial}`, 15, 65);
  doc.text(`Fecha de facturación:   ${item.date}`, 15, 75);
  doc.text(`Factura a nombre de:   ${item.customerName}`, 15, 85);
  doc.text(`Número BL:   ${item.blNumber}`, 15, 95);
  doc.text(`Número del contenedor:   ${item.containerNumber}`, 15, 105);

  const tableData = [];
  for (let i = 0; i < item.items.length; i++) {
    tableData.push([
      item.items[i].description,
      item.items[i].value,
      item.items[i].tax,
    ]);
  }
  console.log(tableData);

  autoTable(doc, {
    alternateRowStyles: { fillColor: [255, 255, 255] },
    startY: 120,
    head: [["Descripción", "Valor", "Impuestos"]],
    body: tableData,
    theme: "striped",
    styles: {
      halign: "left",
      fillColor: "#ffffff",
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 80, textColor: [0, 0, 0] },
      1: { textColor: [0, 0, 0] },
      2: { textColor: [0, 0, 0] },
    },
    headStyles: { fillColor: "#111111", textColor: [255, 255, 255] },
    tableLineColor: [6, 23, 39],
    tableLineWidth: 0.1,
  });

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  // doc.text(
  //   "____________________________________________________________________",
  //   15,
  //   157 + tableData.length * 2
  // );
  const totalTax = item.items.reduce(
    (total: number, currentItem: { tax: string }) =>
      total + parseFloat(currentItem.tax),
    0
  );
  doc.setFontSize(15);
  doc.text(`Impuestos: ${totalTax}`, 15, 165 + tableData.length * 2);
  doc.setFontSize(10);
  // doc.text(
  //   "____________________________________________________________________",
  //   15,
  //   167 + tableData.length * 2
  // );
  doc.setFontSize(15);
  doc.text(`Total: ${item.total}`, 15, 175 + tableData.length * 2);
  doc.setFontSize(10);
  // doc.text(
  //   "____________________________________________________________________",
  //   15,
  //   177 + tableData.length * 2
  // );
  doc.setFontSize(6);
  doc.text(`(impuesto incluido)`, 15, 181 + tableData.length * 2);

  doc.setFontSize(8);

  // Agregar líneas en el footer
  const footerY = doc.internal.pageSize.height - 10; // Posición Y en la parte inferior
  doc.text(
    "Dirección Calle Luis Felipe Clemente/ Ave Frangipany",
    140, // Posición X
    footerY
  );
  doc.text(
    "Tels 397-2004, 397-1790 y 397-2165",
    140, // Posición X
    footerY + 5 // Espaciado entre las dos líneas
  );

  doc.save(`factura_Numero_${item.serial}.pdf`); // Guardar el PDF con un nombre único
};
