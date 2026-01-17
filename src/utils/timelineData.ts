/**
 * Timeline data for the Space Race (1957-1975)
 * Historical events to display alongside the cumulative launches chart
 */

export interface TimelineEvent {
  title: string;
  country: 'USA' | 'URSS' | 'USA, URSS';
  date: string;
  description: string;
}

export interface YearEvents {
  year: number;
  events: TimelineEvent[];
}

export const timelineData: YearEvents[] = [
  {
    year: 1957,
    events: [
      {
        title: 'Lanzamiento de Sputnik 1',
        country: 'URSS',
        date: 'octubre 1957',
        description: 'La Unión Soviética lanza el primer satélite artificial, Sputnik 1.',
      },
      {
        title: 'Lanzamiento de Sputnik 2 con Laika',
        country: 'URSS',
        date: 'noviembre 1957',
        description: 'Un mes después, la URSS lanza el Sputnik 2, llevando a Laika, el primer ser vivo en orbitar la Tierra.',
      },
    ],
  },
  {
    year: 1958,
    events: [
      {
        title: 'Primer satélite estadounidense',
        country: 'USA',
        date: 'enero 1958',
        description: 'Estados Unidos lanza su primer satélite, Explorer 1, que descubre los cinturones de radiación de Van Allen.',
      },
      {
        title: 'Creación de la NASA',
        country: 'USA',
        date: 'julio 1958',
        description: 'En respuesta a los avances soviéticos, el gobierno de EE.UU. establece la Administración Nacional de Aeronáutica y del Espacio (NASA) para coordinar los esfuerzos de exploración espacial.',
      },
    ],
  },
  {
    year: 1961,
    events: [
      {
        title: 'Primer humano en el espacio (Yuri Gagarin)',
        country: 'URSS',
        date: 'abril 1961',
        description: 'El cosmonauta soviético Yuri Gagarin se convierte en el primer humano en viajar al espacio a bordo del Vostok 1.',
      },
    ],
  },
  {
    year: 1962,
    events: [
      {
        title: 'Primer estadounidense en órbita (John Glenn)',
        country: 'USA',
        date: 'febrero 1962',
        description: 'John Glenn se convierte en el primer estadounidense en orbitar la Tierra a bordo del Friendship 7.',
      },
    ],
  },
  {
    year: 1963,
    events: [
      {
        title: 'Primera mujer en el espacio (Valentina Tereshkova)',
        country: 'URSS',
        date: 'junio 1963',
        description: 'La cosmonauta soviética Valentina Tereshkova pilota el Vostok 6, pasando casi tres días en el espacio y orbitando la Tierra 48 veces.',
      },
    ],
  },
  {
    year: 1964,
    events: [
      {
        title: 'Primer programa con tripulación múltiple',
        country: 'URSS',
        date: 'octubre 1964',
        description: 'La Unión Soviética lanza la misión Voskhod 1, la primera nave espacial con tripulación múltiple, llevando a tres cosmonautas en una sola misión.',
      },
    ],
  },
  {
    year: 1965,
    events: [
      {
        title: 'Primer hombre en caminar en el espacio',
        country: 'URSS',
        date: 'marzo 1965',
        description: 'Alexei Leonov realiza la primera actividad extravehicular (EVA), flotando libremente en el espacio durante 12 minutos.',
      },
    ],
  },
  {
    year: 1966,
    events: [
      {
        title: 'Primer soft landing en la Luna',
        country: 'URSS',
        date: 'febrero 1966',
        description: 'La sonda soviética Luna 9 realiza el primer softlanding en la superficie lunar, enviando las primeras imágenes desde la Luna.',
      },
      {
        title: 'Primer acoplamiento de dos naves',
        country: 'USA',
        date: 'marzo 1966',
        description: 'La misión Gemini 8 logra el primer acoplamiento exitoso en el espacio con otra nave, el Agena Target Vehicle.',
      },
    ],
  },
  {
    year: 1967,
    events: [
      {
        title: 'Tragedia del Apolo 1',
        country: 'USA',
        date: 'enero 1967',
        description: 'Un incendio durante una prueba en tierra de la misión Apolo 1 resulta en la muerte de los tres astronautas a bordo: Gus Grissom, Ed White y Roger Chaffee.',
      },
      {
        title: 'Muerte de Vladimir Komarov',
        country: 'URSS',
        date: 'abril 1967',
        description: 'El cosmonauta soviético Vladimir Komarov muere cuando su nave Soyuz 1 se estrella al reingresar debido a fallos técnicos.',
      },
    ],
  },
  {
    year: 1968,
    events: [
      {
        title: 'Primera nave en orbitar la Luna y regresar',
        country: 'URSS',
        date: 'febrero 1968',
        description: 'La sonda soviética Zond 5 se convierte en la primera nave en orbitar la Luna y regresar a la Tierra, llevando tortugas y otros organismos vivos.',
      },
      {
        title: 'Primera nave tripulada en orbitar la luna',
        country: 'USA',
        date: 'diciembre 1968',
        description: 'La misión Apolo 8 se convierte en la primera nave tripulada en orbitar la Luna, con Frank Borman, James Lovell y William Anders a bordo.',
      },
    ],
  },
  {
    year: 1969,
    events: [
      {
        title: 'Aterrizaje en la Luna',
        country: 'USA',
        date: 'julio 1969',
        description: 'La misión Apolo 11 logra el primer aterrizaje humano en la Luna, con Neil Armstrong y Buzz Aldrin caminando sobre la superficie lunar.',
      },
    ],
  },
  {
    year: 1971,
    events: [
      {
        title: 'Primera estación espacial',
        country: 'URSS',
        date: 'abril 1971',
        description: 'La Unión Soviética lanza la primera estación espacial, Salyut 1, abriendo el camino para la habitabilidad humana a largo plazo.',
      },
    ],
  },
  {
    year: 1975,
    events: [
      {
        title: 'Acuerdo de Apolo-Soyuz',
        country: 'USA, URSS',
        date: 'julio 1975',
        description: 'La misión conjunta Apolo-Soyuz marca el primer encuentro en el espacio entre naves de dos naciones, simbolizando un paso hacia la cooperación internacional en la exploración espacial.',
      },
    ],
  },
];

/**
 * Get events for a specific year
 */
export function getEventsForYear(year: number): TimelineEvent[] {
  const yearData = timelineData.find((d) => d.year === year);
  return yearData?.events || [];
}

/**
 * Get country flag/icon based on country name
 */
export function getCountryFlag(country: 'USA' | 'URSS' | 'USA, URSS'): string {
  switch (country) {
    case 'USA':
      return '🇺🇸';
    case 'URSS':
      return '☭';
    case 'USA, URSS':
      return '🇺🇸 ☭';
    default:
      return '';
  }
}
