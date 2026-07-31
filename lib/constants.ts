import type { Parroquia, RangoEdad, Genero } from '@/types';

export const PARROQUIAS_URBANAS: Parroquia[] = [
  'Lizarzaburu', 'Maldonado', 'Velasco', 'Veloz', 'Yaruquíes',
];

export const PARROQUIAS_RURALES: Parroquia[] = [
  'Cacha', 'Calpi', 'Cubijíes', 'Flores', 'Licán', 'Licto',
  'Pungalá', 'Punín', 'Quimiag', 'San Juan', 'San Luis',
];

export const RANGOS_EDAD: RangoEdad[] = ['16-20', '21-35', '36-50', '51+'];

export const GENEROS: Genero[] = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];

export const NINGUNO_DE_LOS_ANTERIORES = 'Ninguno de los anteriores';

export const HAS_VOTED_COOKIE = 'has_voted_2027';
export const HAS_VOTED_SESSION_KEY = 'encuesta_2027_completada';
