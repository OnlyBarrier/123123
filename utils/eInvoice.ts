import axios from "axios";
import { EItems, Items } from "./types";
const idSandbox = "01GCY56M10RX63QG8P4SGN0935";
const bearerSandbox = `eyJhbGciOiJSUzI1NiIsImtpZCI6ImU1ZTEzYzFiLTJiYTgtNGYzOC1hNWMxLTQ5NWEzMjk3ZjE4ZiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5OTI0NDFjYy1jMmQ4LTQxNTAtYWE2Mi04NzhlODI1MDRmZWQiLCJlbWFpbCI6ImFwY29udGVzdEBhbGFudWJlLmNvIiwic2NvcGUiOiJjLmQuci51OmFwaXBhbl9mdWxsX2FjY2VzcyBnZW5lcmljIiwiaXNzIjoic2FuZC1hdXRoLWFwaS5hbGVncmEuY29tIiwiaWF0IjoxNjYzMTY0MTUxLCJleHAiOjExNzE3MzQwMjIsImp0aSI6IjliZTRmYTg3LWI4MzMtNDgxZi1hMWNjLTg3YzA3OTNiNWQzZiJ9.bH0VsJ2WbRj5_hetqfyXq95Gm7Ex4fceQpuQpYcBK0wA8ne-nF1qN8yIVl1Q9VC92-KI6oTo7q1hrAT6pXbVyT6erYZNzeP7OHjQ3_iEfjxaUi4_YPzaivSZN3zckaeB8LI4Dc0a3aTYoVMSkb7dpRLKFfu0AOFMwfdWVQRiHuKmKUBAUbgoTwZGdsLeDzN9_56NMYm17X8br_XU6WDOa8dJGd4G4WsndVeNtlaDhu57e3N-d7bnftCD0RAXyD7mq3NHyZp_GO6vOlCVbRPKZ3MQkF3YGNSTAHaayXNDC5fVimPRmApX9G-AduPypmtHb-i9NTp_ejfJy-lSIzO3Bg`;
const bearerReal = `eyJhbGciOiJSUzI1NiIsImtpZCI6IjU1NzhjMzkzLWJhNTItNGNlNS1hNzRhLTY3MzNlNTdlZTI1YSIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1Nzc4YzBkYi0zOTE1LTQ4YjctOTA3Mi04YjdhOTQ0ZGI3NDUiLCJlbWFpbCI6Imxhcm11ZWxsZXNAYXBjb25jb25zdWx0aW5nLmNvbSIsInNjb3BlIjoiYy5kLnIudTphcGlwYW5fZnVsbF9hY2Nlc3MgZ2VuZXJpYyIsImFwaV9rZXkiOiI3MTE4ZTE1NWY3OTQ0NDE3NWEyYSIsImlzcyI6ImF1dGgtYXBpLmFsZWdyYS5jb20iLCJpYXQiOjE2NjgxMTI1MzMsImV4cCI6MTE3MTczNDAyMiwianRpIjoiOGE3ZjkyNjUtNGVlZC00OTFlLThmMzktZTZiN2M5MDE1N2Y0In0.mJcj4lEfj2xIv0CrW9oIDNuj5jhIwM65h1CblShGGK1_t_JZ2V8eLmgH7QjYRpyHtLB3vJ36iv6cV9-ME1_z9FnE08qPw1ha_k40FKP_EDtRQCF9pKLb0PwtiEm3nlypDfoNTvCkIIzcmmYJI-Q1M1c7gyQT69-1iTSt3xxylI30q4kaVyrJRT10hf4vIIISjr-XPSoxboutcgQCKgnElwwUQCNFlcl3ahw9SEqbPv51CbN5oZaRbuS5WDm7fj6hFB0QzROyvMy9tk_9Fs8okChxFUaiCQotsPCuAvwPBKHwmvWFNuL_RTib4hKdbJhMOVlCAD0OZdpJEYd040fBtw`;
const idReal = "01H8MNS2V3H6YS5Y3W2J5JV18Z";

function createEItems(items: Items[]): EItems[] {
  let sequentialNumber = 1; // Inicializamos el número secuencial en 1
  const eItems: EItems[] = items.map((item) => {
    // Determinamos el valor de itbms.rate según el valor de tax
    const itbmsRate = item.tax === "0" ? "00" : "01";
    // Formamos el número secuencial con ceros a la izquierda
    const number = sequentialNumber.toString().padStart(4, "0");
    // Incrementamos el número secuencial para la siguiente iteración
    sequentialNumber++;
    // Creamos el objeto EItem
    const eItem: EItems = {
      prices: { transfer: parseFloat(item.value) }, // Convertimos value a número
      itbms: { rate: itbmsRate },
      description: item.description,
      quantity: 1, // Siempre es 1
      number: number,
    };

    return eItem;
  });

  return eItems;
}

export function changeOptions(options: any, invoiceData: any) {
  const securityCodeOptions: string[] = [
    "000000001",
    "999999991",
    "900000090",
    "100000000",
  ];
  const bodyObject = JSON.parse(options.body);
  // Modifica los campos
  bodyObject.information.nature = invoiceData.nature; // tipo de operacion
  bodyObject.information.numeration = invoiceData.serial.replace(/\s/g, ""); //arreglar el serial
  bodyObject.information.securityCode =
    securityCodeOptions[Math.floor(Math.random() * 4)];
  bodyObject.receiver.type = invoiceData.receiverType; // 01 contribuyente y 03 gobierno requieren ruc---- 00 y 04 no requieren

  if (invoiceData.receiverType === "01" || invoiceData.receiverType === "03") {
    bodyObject.receiver.ruc.ruc = invoiceData.customerId;
    bodyObject.receiver.ruc.type = parseInt(invoiceData.rucType);
  }
  bodyObject.receiver.name = invoiceData.customerName;
  bodyObject.receiver.address = invoiceData.address;
  bodyObject.receiver.telephones = invoiceData.telephones.trim().split(",");
  bodyObject.receiver.emails = invoiceData.emails.trim().split(",");
  bodyObject.items = createEItems(invoiceData.items);
  bodyObject.totals.paymentMethods[0].amount = invoiceData.total;
  bodyObject.totals.paymentMethods[0].type = invoiceData.paymentMethods;
  const newBodyString = JSON.stringify(bodyObject);

  // Actualiza la propiedad 'body' en las opciones originales
  options.body = newBodyString;
}

const options = {
  method: "POST",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    authorization: `Bearer ${bearerReal}`,
  },
  body: JSON.stringify({
    information: {
      issueType: "01", // estatico en 01
      documentType: "08", //  estatico en 08
      cafe: { format: 3, delivery: 3 }, //estatico en 1
      nature: "01", // desplegable en 01: Venta 02: Exportación 03: Re-exportación 04: Venta de fuente extrajera 10: Transferencia/Traspaso 11: Devolución 20: Compra 21: Importación
      operationType: 1, //  estatico en 1
      destination: 1, // estatico en 1  panamá
      receiverContainer: 1, //estatico en 1
      numeration: "0000000001", //serial
      billingPoint: "001", // estatico en 001
      securityCode: "000000001", // random entre 000000001  999999991  900000090  100000000
    },
    receiver: {
      type: "01", // 01 contribuyente y 03 gobierno requieren ruc---- 00 y 04 no requieren
      ruc: { type: 2, ruc: "25022201-3-2014" }, // juridico 2(RUC)  natural 1(Cedula)
      country: "PA",
      name: "NUEVA ASOCIACION DE PRODUC DE ARROZ",
      address: "CHIRIQUI",
      location: {
        code: "9-12-5",
        correction: "corregimiento de Curundu",
        district: "Distrito de Panama",
        province: "Panama",
      },
      telephones: ["6448-6525"],
      exportation: { incoterm: "EXW" },
      emails: ["cris-a2112@hotmail.com"],
    }, //type es un desplegable 01 contribuyente 02 consumidor final 03 gobierno 04 extranjero y ruc type es un desplegable 1 natural 2 juridico

    items: [
      {
        prices: { transfer: 25 }, //precio del objeto
        itbms: { rate: "01" }, // impuesto 00 ninguno 01 7%
        description: "alquiler", //matchearla con la descripción del objeto
        quantity: 1, //cantidad
        number: "0001", // secuencial del item, 1 sería 0001  si fuera el 3 seria 0003
      },
    ],
    totals: {
      paymentTime: 1,
      paymentMethods: [{ type: "02", amount: 26.75 }], // 01: Crédito 02: Efectivo 03: Tarjeta Crédito 04: Tarjeta Débito 08: Transf./Depósito a cta. Bancaria 09: Cheque // amount = precio
    },
  }),
};

export async function eInvoice(invoiceData: any): Promise<any> {
  changeOptions(options, invoiceData);

  try {
    console.log(options.body);
    const response = await fetch(
      `https://api.alanube.co/pan/v1/invoices?idCompany=${idReal}`,
      options
    );

    if (!response.ok) {
      console.log(response);
      throw new Error(`Problemas en la solicitud: ${response.statusText}`);
    }
    const status = response.status;
    if (status === 200 || status === 201 || status === 202) {
      // si el status es 200, 201 o 202
      try {
        const response = await axios.put(`http://localhost:3000/api/invoice/${invoiceData.serial}`);
        // Verificar el estado de la respuesta
        if (response.status === 200) {
            return {status: response.status, text:"Factura creada correctamente", updatedInvoice:response.data}
        } else {
          return {status: response.status, text:"Error al cambiar la factura en la DB"}
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
    } 
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

//https://api.alanube.co/pan/v1/invoices?idCompany=${idSandbox}
