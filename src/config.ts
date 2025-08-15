// Configuración central del sitio

// Fecha y hora del evento (hora local del navegador)
export const EVENT_DATETIME = new Date('2025-11-29T17:00:00')

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
  mailto: 'mailto:tu-correo@ejemplo.com?subject=RSVP%20Boda%20Jorge%20y%20Esmeralda',
  whatsapp: 'https://wa.me/521234567890?text=Quiero%20confirmar%20mi%20asistencia%20a%20la%20boda',
}

// Mapa y cómo llegar
export const MAP = {
  placeQuery: 'Comala, Colima',
  mapsLink: 'https://www.google.com/maps?q=Comala,+Colima',
  // Embed básico con query; reemplaza con un embed específico del venue cuando lo tengas
  embedSrc:
    'https://www.google.com/maps?q=Comala,+Colima&output=embed',
}
