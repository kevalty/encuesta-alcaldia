import type {
  Parroquia,
  RangoEdad,
  Genero,
  NivelInstruccion,
  EstadoAnimo,
  ProblemaPrincipal,
  PrioridadAdministracion,
  CanalComunicacion,
} from '@/types';

export const PARROQUIAS_URBANAS: Parroquia[] = [
  'Lizarzaburu', 'Maldonado', 'Velasco', 'Veloz', 'Yaruquíes',
];

export const PARROQUIAS_RURALES: Parroquia[] = [
  'Cacha', 'Calpi', 'Cubijíes', 'Flores', 'Licán', 'Licto',
  'Pungalá', 'Punín', 'Quimiag', 'San Juan', 'San Luis',
];

export const RANGOS_EDAD: RangoEdad[] = ['16-20', '21-35', '36-50', '51+'];

export const GENEROS: Genero[] = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];

export const NIVELES_INSTRUCCION: NivelInstruccion[] = ['Ninguna', 'Primaria', 'Secundaria', 'Superior'];

export const ESTADOS_ANIMO: EstadoAnimo[] = [
  'Preocupación', 'Esperanza', 'Desconfianza', 'Molestia', 'Optimismo moderado', 'Indiferencia',
];

export const PROBLEMAS_PRINCIPALES: ProblemaPrincipal[] = [
  'Seguridad', 'Empleo', 'Movilidad', 'Servicios básicos',
  'Desorden municipal/corrupción', 'Comercio', 'Ambiente/limpieza', 'Otro',
];

export const PRIORIDADES_ADMINISTRACION: PrioridadAdministracion[] = [
  'Mejorar la recolección de basura', 'Arreglar las calles y vías', 'Fomentar el turismo',
  'Simplificar trámites municipales', 'Mejorar la seguridad ciudadana', 'Generar más empleo',
  'Ampliar agua potable y alcantarillado', 'Apoyar el comercio y a los emprendedores',
  'Mejorar parques y espacios públicos', 'Otro',
];

export const CANALES_COMUNICACION: CanalComunicacion[] = [
  'Facebook/Instagram', 'WhatsApp', 'Radio', 'TikTok',
  'Medios digitales', 'Televisión local', 'Reuniones', 'Familiares/amigos',
];

export const NINGUNO_DE_LOS_ANTERIORES = 'Ninguno de los anteriores';

export const HAS_VOTED_COOKIE = 'has_voted_2027';
export const HAS_VOTED_SESSION_KEY = 'encuesta_2027_completada';

// Modo prueba temporal: pon NEXT_PUBLIC_TESTING_MODE=true en .env.local (nunca
// en Vercel/producción) para desactivar el bloqueo de "ya respondiste" y el
// requisito de Turnstile, y poder enviar varias encuestas seguidas de prueba.
export const TESTING_MODE = process.env.NEXT_PUBLIC_TESTING_MODE === 'true';
