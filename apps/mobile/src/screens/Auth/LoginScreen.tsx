import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme';
import { validateEmail } from '../../utils/validation';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import { Link } from '../../components/Link';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { login } = useAuth();

  useEffect(() => {
    validateForm();
  }, [email, password]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (email && !validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    if (password && password.length < 8) {
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
    }

    setErrors(newErrors);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (Object.keys(errors).length > 0) {
      Alert.alert('Erro', 'Por favor, corrija os erros no formulário');
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();

      if (available && biometryType) {
        const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Confirme sua identidade' });

        if (success) {
          // TODO: Implementar lógica de login biométrico
          Alert.alert('Sucesso', 'Autenticação biométrica bem-sucedida');
        } else {
          Alert.alert('Erro', 'Autenticação biométrica falhou');
        }
      } else {
        Alert.alert('Erro', 'Autenticação biométrica não disponível');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na autenticação biométrica');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo ao Sanara</Text>
        <Text style={styles.subtitle}>
          Faça login para acessar sua conta
        </Text>
      </View>

      <View style={styles.form}>
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
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
          placeholder="Digite sua senha"
        />

        <Button
          title="Entrar"
          onPress={handleLogin}
          loading={isLoading}
          disabled={Object.keys(errors).length > 0}
          containerStyle={styles.button}
        />

        <Button
          title="Login com Biometria"
          onPress={handleBiometricLogin}
          containerStyle={styles.button}
        />

        <Link
          title="Não tem uma conta? Cadastre-se"
          onPress={() => navigation.navigate('Register')}
        />

        <Link
          title="Esqueceu sua senha?"
          onPress={() => navigation.navigate('ForgotPassword')}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
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