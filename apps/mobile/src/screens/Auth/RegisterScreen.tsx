import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme';
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
} from '../../utils/validation';
import { PHONE_MASK, formatPhone } from '../../utils/masks';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import { Link } from '../../components/Link';

export const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { register } = useAuth();

  useEffect(() => {
    validateForm();
  }, [name, email, phone, password, confirmPassword]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (name && !validateName(name)) {
      newErrors.name = 'Nome inválido. Use apenas letras e espaços';
    }

    if (email && !validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    if (phone && !validatePhone(phone)) {
      newErrors.phone = 'Número de telefone inválido';
    }

    if (password) {
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors[0];
      }
    }

    if (confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (Object.keys(errors).length > 0) {
      Alert.alert('Erro', 'Por favor, corrija os erros no formulário');
      return;
    }

    try {
      setIsLoading(true);
      await register({
        name,
        email,
        password,
        phone: formatPhone(phone),
      });
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>
          Preencha seus dados para começar
        </Text>
      </View>

      <View style={styles.form}>
        <FormInput
          label="Nome completo"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          error={errors.name}
          placeholder="Digite seu nome completo"
        />

        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.email}
          placeholder="Digite seu email"
        />

        <FormInput
          label="Telefone (opcional)"
          value={phone}
          mask={PHONE_MASK}
          onMaskChange={(masked, unmasked) => setPhone(unmasked)}
          keyboardType="phone-pad"
          error={errors.phone}
          placeholder="+55 (00) 00000-0000"
        />

        <FormInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
          placeholder="Digite sua senha"
        />

        <FormInput
          label="Confirmar senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={errors.confirmPassword}
          placeholder="Digite sua senha novamente"
        />

        <Button
          title="Criar conta"
          onPress={handleRegister}
          loading={isLoading}
          disabled={Object.keys(errors).length > 0}
          containerStyle={styles.button}
        />

        <Link
          title="Já tem uma conta? Faça login"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  button: {
    marginTop: 20,
    marginBottom: 10,
  },
}); 