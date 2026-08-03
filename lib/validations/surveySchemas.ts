import { z } from 'zod';

export const parroquiaSchema = z.enum([
  'Lizarzaburu','Maldonado','Velasco','Veloz','Yaruquíes',
  'Cacha','Calpi','Cubijíes','Flores','Licán','Licto',
  'Pungalá','Punín','Quimiag','San Juan','San Luis',
]);

export const slide1Schema = z.object({
  nombre: z.string().trim().min(2, 'Escribe tu nombre completo').max(100),
  parroquia: parroquiaSchema,
  edad: z.enum(['16-20', '21-35', '36-50', '51+']),
  genero: z.enum(['Masculino', 'Femenino', 'Otro', 'Prefiero no decir']),
});

export const slide2Schema = z.object({
  alcaldia_espontanea: z.string().max(200).optional().default(''),
});

export const slide3Schema = z.object({
  prefectura_espontanea: z.string().max(200).optional().default(''),
});

export const slide4Schema = z.object({
  alcaldia_asistida: z.array(z.string()).min(0),
});

export const slide5Schema = z.object({
  prefectura_asistida: z.array(z.string()).min(0),
});

export const fullSubmitSchema = slide1Schema
  .merge(slide2Schema)
  .merge(slide3Schema)
  .merge(slide4Schema)
  .merge(slide5Schema)
  .extend({
    duration_seconds: z.number().int().nonnegative(),
    turnstile_token: z.string().min(1, 'Falta verificación anti-bot'),
  });

export type FullSubmitInput = z.infer<typeof fullSubmitSchema>;
