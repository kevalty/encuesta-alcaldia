export type Parroquia =
  | 'Lizarzaburu' | 'Maldonado' | 'Velasco' | 'Veloz' | 'Yaruquíes'
  | 'Cacha' | 'Calpi' | 'Cubijíes' | 'Flores' | 'Licán' | 'Licto'
  | 'Pungalá' | 'Punín' | 'Quimiag' | 'San Juan' | 'San Luis';

export type RangoEdad = '16-20' | '21-35' | '36-50' | '51+';
export type Genero = 'Masculino' | 'Femenino' | 'Otro' | 'Prefiero no decir';
export type Dignidad = 'alcaldia_riobamba' | 'prefectura_chimborazo';

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
