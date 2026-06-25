import type { OnboardingInput } from "@arc/validations";
import { create } from "zustand";

type OnboardingFormState = Partial<OnboardingInput>;

interface OnboardingStore {
  currentStep: number;
  form: OnboardingFormState;
  setField: <Key extends keyof OnboardingInput>(field: Key, value: OnboardingInput[Key]) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
}

const initialForm: OnboardingFormState = {
  dietaryPreference: "",
  equipment: [],
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  currentStep: 0,
  form: initialForm,
  setField: (field, value) =>
    set((state) => ({
      form: {
        ...state.form,
        [field]: value,
      },
    })),
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) })),
  previousStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
  reset: () => set({ currentStep: 0, form: initialForm }),
}));
