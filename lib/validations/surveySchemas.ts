import { z } from 'zod';

export const parroquiaSchema = z.enum([
  'Lizarzaburu','Maldonado','Velasco','Veloz','Yaruquíes',
  'Cacha','Calpi','Cubijíes','Flores','Licán','Licto',
  'Pungalá','Punín','Quimiag','San Juan','San Luis',
]);

export const slide1Schema = z.object({
  parroquia: parroquiaSchema,
  edad: z.enum(['16-20', '21-35', '36-50', '51+']),
  genero: z.enum(['Masculino', 'Femenino', 'Otro', 'Prefiero no decir']),
  nivel_instruccion: z.enum(['Ninguna', 'Primaria', 'Secundaria', 'Superior']),
});

export const slide2Schema = z.object({
  estado_animo: z.enum([
    'Preocupación', 'Esperanza', 'Desconfianza',
    'Molestia', 'Optimismo moderado', 'Indiferencia',
  ]),
});

export const slide3Schema = z.object({
  problema_principal: z.enum([
    'Seguridad', 'Empleo', 'Movilidad', 'Servicios básicos',
    'Desorden municipal/corrupción', 'Comercio', 'Ambiente/limpieza', 'Otro',
  ]),
});

export const slide4Schema = z.object({
  prioridades_administracion: z.array(z.enum([
    'Mejorar la recolección de basura', 'Arreglar las calles y vías', 'Fomentar el turismo',
    'Simplificar trámites municipales', 'Mejorar la seguridad ciudadana', 'Generar más empleo',
    'Ampliar agua potable y alcantarillado', 'Apoyar el comercio y a los emprendedores',
    'Mejorar parques y espacios públicos', 'Otro',
  ])).min(0),
});

export const slide5Schema = z.object({
  canal_comunicacion: z.enum([
    'Facebook/Instagram', 'WhatsApp', 'Radio', 'TikTok',
    'Medios digitales', 'Televisión local', 'Reuniones', 'Familiares/amigos',
  ]),
});

export const slide6Schema = z.object({
  alcaldia_asistida: z.array(z.string()).min(0),
});

export const slide7Schema = z.object({
  prefectura_asistida: z.array(z.string()).min(0),
});

export const fullSubmitSchema = slide1Schema
  .merge(slide2Schema)
  .merge(slide3Schema)
  .merge(slide4Schema)
  .merge(slide5Schema)
  .merge(slide6Schema)
  .merge(slide7Schema)
  .extend({
    duration_seconds: z.number().int().nonnegative(),
    turnstile_token: z.string().min(1, 'Falta verificación anti-bot'),
  });

export type FullSubmitInput = z.infer<typeof fullSubmitSchema>;
