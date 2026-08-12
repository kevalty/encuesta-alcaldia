export type Parroquia =
  | 'Lizarzaburu' | 'Maldonado' | 'Velasco' | 'Veloz' | 'Yaruquíes'
  | 'Cacha' | 'Calpi' | 'Cubijíes' | 'Flores' | 'Licán' | 'Licto'
  | 'Pungalá' | 'Punín' | 'Quimiag' | 'San Juan' | 'San Luis';

export type RangoEdad = '16-20' | '21-35' | '36-50' | '51+';
export type Genero = 'Masculino' | 'Femenino' | 'Otro' | 'Prefiero no decir';
export type NivelInstruccion = 'Ninguna' | 'Primaria' | 'Secundaria' | 'Superior';
export type Dignidad = 'alcaldia_riobamba' | 'prefectura_chimborazo';

export type EstadoAnimo =
  | 'Preocupación' | 'Esperanza' | 'Desconfianza'
  | 'Molestia' | 'Optimismo moderado' | 'Indiferencia';

export type ProblemaPrincipal =
  | 'Seguridad' | 'Empleo' | 'Movilidad' | 'Servicios básicos'
  | 'Desorden municipal/corrupción' | 'Comercio' | 'Ambiente/limpieza' | 'Otro';

export type CanalComunicacion =
  | 'Facebook/Instagram' | 'WhatsApp' | 'Radio' | 'TikTok'
  | 'Medios digitales' | 'Televisión local' | 'Reuniones' | 'Familiares/amigos';

export interface Candidate {
  id: string;
  name: string;
  dignity: Dignidad;
  is_active: boolean;
  display_order: number;
}

export interface SurveyPayload {
  parroquia: Parroquia;
  edad: RangoEdad;
  genero: Genero;
  nivel_instruccion: NivelInstruccion;
  estado_animo: EstadoAnimo;
  problema_principal: ProblemaPrincipal;
  canal_comunicacion: CanalComunicacion;
  alcaldia_espontanea: string;
  prefectura_espontanea: string;
  alcaldia_asistida: string[];
  prefectura_asistida: string[];
  duration_seconds: number;
  turnstile_token: string;
}

export interface SubmitResult {
  success: boolean;
  error?: string;
}
