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

const TOTAL_SLIDES = 9;

interface SurveyState {
  currentSlide: number; // 1..9
  direction: number;
  startedAt: number | null;

  parroquia: Parroquia | null;
  edad: RangoEdad | null;
  genero: Genero | null;
  nivelInstruccion: NivelInstruccion | null;
  estadoAnimo: EstadoAnimo | null;
  problemaPrincipal: ProblemaPrincipal | null;
  canalComunicacion: CanalComunicacion | null;
  alcaldiaEspontanea: string;
  prefecturaEspontanea: string;
  alcaldiaAsistida: string[];
  prefecturaAsistida: string[];

  setParroquia: (p: Parroquia) => void;
  setEdad: (e: RangoEdad) => void;
  setGenero: (g: Genero) => void;
  setNivelInstruccion: (v: NivelInstruccion) => void;
  setEstadoAnimo: (v: EstadoAnimo) => void;
  setProblemaPrincipal: (v: ProblemaPrincipal) => void;
  setCanalComunicacion: (v: CanalComunicacion) => void;
  setAlcaldiaEspontanea: (v: string) => void;
  setPrefecturaEspontanea: (v: string) => void;
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
  canalComunicacion: null,
  alcaldiaEspontanea: '',
  prefecturaEspontanea: '',
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
  setCanalComunicacion: (v) => set({ canalComunicacion: v }),
  setAlcaldiaEspontanea: (v) => set({ alcaldiaEspontanea: v }),
  setPrefecturaEspontanea: (v) => set({ prefecturaEspontanea: v }),

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
