import { Mask } from 'react-native-mask-input';

export const PHONE_MASK: Mask = '(99) 99999-9999';

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export const formatPhoneForDisplay = (phone: string): string => {
  const cleaned = formatPhone(phone);
  if (cleaned.length === 0) return '';
  
  if (cleaned.length <= 2) {
    return `+${cleaned}`;
  }
  
  if (cleaned.length <= 4) {
    return `+${cleaned.slice(0, 2)} (${cleaned.slice(2)}`;
  }
  
  if (cleaned.length <= 9) {
    return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4)}`;
  }
  
  return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9, 13)}`;
}; 