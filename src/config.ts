// Configuración central del sitio

// Fecha y hora del evento (hora local del navegador)
// Ajustado a la hora de inicio de la ceremonia
export const EVENT_DATETIME = new Date('2025-11-29T13:30:00')
// Hora de la recepción
export const RECEPTION_DATETIME = new Date('2025-11-29T15:45:00')

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

// Opciones de alojamiento en Comala (fuente: lista proporcionada)
export const HOTELS = [
  {
    name: 'Hotel Posada Comala',
    address: 'Ignacio Allende #43',
    phones: ['312 315 51 65', '312 943 04 26'],
    mapQuery: 'Hotel Posada Comala, Comala, Colima',
  },
  {
    name: 'Hotel Quinta Comala',
    address: 'Reforma #137',
    phones: ['312 307 25 33'],
    mapQuery: 'Hotel Quinta Comala, Comala, Colima',
  },
  {
    name: 'Hotel La Paramera',
    address: 'Degollado #81',
    phones: ['312 688 29 29'],
    mapQuery: 'Hotel La Paramera, Comala, Colima',
  },
  {
    name: 'Hotel Los Suspiros',
    address: '16 de Septiembre #74',
    phones: ['312 317 78 70'],
    mapQuery: 'Hotel Los Suspiros, Comala, Colima',
  },
  {
    name: 'Hotel Comalitas',
    address: 'Capitán Iteneds #6',
    phones: ['312 273 76 82'],
    mapQuery: 'Hotel Comalitas, Comala, Colima',
  },
  {
    name: 'Hostal Casa Blanca',
    address: 'Degollado #75',
    phones: ['312 138 66 77'],
    mapQuery: 'Hostal Casa Blanca, Comala, Colima',
  },
  {
    name: 'Hotel La Parroquia',
    address: 'Miguel Hidalgo #287',
    phones: ['312 103 70 61'],
    mapQuery: 'Hotel La Parroquia, Comala, Colima',
  },
] as const

// Álbum compartido (pega aquí el enlace de tu álbum de Google Photos o Drive con permiso para subir)
export const ALBUM = {
  photosUrl: 'https://photos.app.goo.gl/yTfEDfix7xw5Xpn99', // Enlace real del álbum compartido
}

// Música de la página (elige al menos una fuente)
export const MUSIC = {
  title: 'Amor del Bueno — Reyli',
  // Pega el enlace de Spotify del track y lo convertiremos a embed automáticamente
  spotifyUrl: 'https://open.spotify.com/track/1OCre5vxYq2Vk1wfFsTWE1?si=KoXjwa4CSvSkt7mdjWE0fg', // Enlace de Spotify (track)
  // Si prefieres YouTube, pega el ID del video (lo que va después de v=)
  youtubeId: '', // Ej: AbCdEfGhIjk
  // O un archivo de audio propio alojado con permiso (mp3/ogg)
  audioUrl: '/audio/rio-roma-me-cambiaste-la-vida.mp3',
}
