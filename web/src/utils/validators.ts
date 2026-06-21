export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'La contraseña es obligatoria.';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
  return null;
};

export const validateRequired = (value: string | number | undefined | null, fieldName: string): string | null => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `El campo ${fieldName} es obligatorio.`;
  }
  return null;
};
