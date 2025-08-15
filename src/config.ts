// Configuración central del sitio

// Fecha y hora del evento (hora local del navegador)
// Ajustado a la hora de inicio de la ceremonia
export const EVENT_DATETIME = new Date('2025-11-29T13:30:00')

// Información de regalos (editar cuando tengan datos definitivos)
export const GIFTS = {
  message:
    'El mejor obsequio es tu presencia. Si deseas hacernos un regalo, agradeceremos mucho una contribución para nuestro nuevo hogar.',
  bank: {
    bankName: 'Banco (editar)',
    beneficiary: 'Beneficiario (editar)',
    clabe: '000000000000000000', // CLABE a 18 dígitos (editar)
    accountNumber: '0000000000', // Número de cuenta (opcional)
  },
}

// RSVP: configura un formulario real o medios de contacto
export const RSVP = {
  formUrl: '', // Pega aquí tu URL de Google Forms si la tienes
  // Correo de contacto para RSVP
  emailAddress: 'gsrodz724704@gmail.com',
  mailto: 'mailto:gsrodz724704@gmail.com?subject=RSVP%20Boda%20Jorge%20y%20Esmeralda',
  // Números de WhatsApp para contacto directo (formato internacional sin espacios; recomendación: incluir código de país 52)
  whatsapps: ['+524521820225', '+523121446290'],
  // Compatibilidad: un enlace único si se requiere
  whatsapp: 'https://wa.me/524521820225?text=Quiero%20confirmar%20mi%20asistencia%20a%20la%20boda',
}

// Mapa y cómo llegar (lugares del evento)
export const MAP = {
  ceremony: {
    name: 'Parque Central',
    query: 'Parque Central, Comala, Colima',
  },
  reception: {
    name: 'La Molienda',
    query: 'La Molienda, Hacienda Noguera, Comala, Colima',
  },
  streetNote: 'Hacienda Noguera (Ex Hacienda de Noguera)',
}
