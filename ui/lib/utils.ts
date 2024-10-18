import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true; // Se não lançar erro, é uma URL válida
  } catch {
    return false; // Se lançar erro, a string não é uma URL válida
  }
}