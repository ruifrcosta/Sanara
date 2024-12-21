import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import MaskInput, { MaskInputProps } from 'react-native-mask-input';
import { theme } from '../theme';

interface FormInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  mask?: MaskInputProps['mask'];
  onMaskChange?: MaskInputProps['onMaskText'];
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  containerStyle,
  mask,
  onMaskChange,
  ...props
}) => {
  const InputComponent = mask ? MaskInput : TextInput;
  const inputProps = mask
    ? { ...props, mask, onMaskText: onMaskChange }
    : props;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <InputComponent
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={theme.colors.textSecondary}
        {...inputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
}); 