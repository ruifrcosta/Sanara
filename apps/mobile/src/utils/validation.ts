export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('A senha deve conter pelo menos um caractere especial (!@#$%^&*)');
  }
  
  return errors;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{9,}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 3 && /^[a-zA-ZÀ-ÿ\s]*$/.test(name);
}; 