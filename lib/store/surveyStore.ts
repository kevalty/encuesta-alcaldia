import { create } from 'zustand';
import type {
  Parroquia,
  RangoEdad,
  Genero,
  NivelInstruccion,
  EstadoAnimo,
  ProblemaPrincipal,
  CanalComunicacion,
} from '@/types';
import { NINGUNO_DE_LOS_ANTERIORES } from '@/lib/constants';

const TOTAL_SLIDES = 8;

interface SurveyState {
  currentSlide: number; // 1..8
  direction: number;
  startedAt: number | null;

  parroquia: Parroquia | null;
  edad: RangoEdad | null;
  genero: Genero | null;
  nivelInstruccion: NivelInstruccion | null;
  estadoAnimo: EstadoAnimo | null;
  problemaPrincipal: ProblemaPrincipal | null;
  prioridadesAdministracion: string[];
  canalComunicacion: CanalComunicacion | null;
  alcaldiaAsistida: string[];
  prefecturaAsistida: string[];

  setParroquia: (p: Parroquia) => void;
  setEdad: (e: RangoEdad) => void;
  setGenero: (g: Genero) => void;
  setNivelInstruccion: (v: NivelInstruccion) => void;
  setEstadoAnimo: (v: EstadoAnimo) => void;
  setProblemaPrincipal: (v: ProblemaPrincipal) => void;
  togglePrioridadAdministracion: (v: string) => void;
  setCanalComunicacion: (v: CanalComunicacion) => void;
  toggleAlcaldiaAsistida: (name: string) => void;
  togglePrefecturaAsistida: (name: string) => void;
  startTimer: () => void;
  goNext: () => void;
  goBack: () => void;
  reset: () => void;
}

const initialState = {
  currentSlide: 1,
  direction: 1,
  startedAt: null,
  parroquia: null,
  edad: null,
  genero: null,
  nivelInstruccion: null,
  estadoAnimo: null,
  problemaPrincipal: null,
  prioridadesAdministracion: [] as string[],
  canalComunicacion: null,
  alcaldiaAsistida: [] as string[],
  prefecturaAsistida: [] as string[],
};

export const useSurveyStore = create<SurveyState>((set, get) => ({
  ...initialState,

  setParroquia: (p) => set({ parroquia: p }),
  setEdad: (e) => set({ edad: e }),
  setGenero: (g) => set({ genero: g }),
  setNivelInstruccion: (v) => set({ nivelInstruccion: v }),
  setEstadoAnimo: (v) => set({ estadoAnimo: v }),
  setProblemaPrincipal: (v) => set({ problemaPrincipal: v }),
  togglePrioridadAdministracion: (v) => {
    const current = get().prioridadesAdministracion;
    set({
      prioridadesAdministracion: current.includes(v)
        ? current.filter((n) => n !== v)
        : [...current, v],
    });
  },
  setCanalComunicacion: (v) => set({ canalComunicacion: v }),

  toggleAlcaldiaAsistida: (name) => {
    const current = get().alcaldiaAsistida;
    if (name === NINGUNO_DE_LOS_ANTERIORES) {
      set({ alcaldiaAsistida: current.includes(name) ? [] : [name] });
      return;
    }
    const withoutNone = current.filter((n) => n !== NINGUNO_DE_LOS_ANTERIORES);
    set({
      alcaldiaAsistida: withoutNone.includes(name)
        ? withoutNone.filter((n) => n !== name)
        : [...withoutNone, name],
    });
  },

  togglePrefecturaAsistida: (name) => {
    const current = get().prefecturaAsistida;
    if (name === NINGUNO_DE_LOS_ANTERIORES) {
      set({ prefecturaAsistida: current.includes(name) ? [] : [name] });
      return;
    }
    const withoutNone = current.filter((n) => n !== NINGUNO_DE_LOS_ANTERIORES);
    set({
      prefecturaAsistida: withoutNone.includes(name)
        ? withoutNone.filter((n) => n !== name)
        : [...withoutNone, name],
    });
  },

  startTimer: () => {
    if (!get().startedAt) set({ startedAt: Date.now() });
  },

  goNext: () =>
    set((s) => ({ currentSlide: Math.min(s.currentSlide + 1, TOTAL_SLIDES), direction: 1 })),
  goBack: () => set((s) => ({ currentSlide: Math.max(s.currentSlide - 1, 1), direction: -1 })),
  reset: () => set(initialState),
}));
