import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '../../theme';
import { validateEmail } from '../../utils/validation';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import { Link } from '../../components/Link';

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    validateForm();
  }, [email]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (email && !validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu email');
      return;
    }

    if (Object.keys(errors).length > 0) {
      Alert.alert('Erro', 'Por favor, corrija os erros no formulário');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement password reset functionality
      Alert.alert(
        'Sucesso',
        'Se o email existir em nossa base de dados, você receberá as instruções para redefinir sua senha.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao enviar email de recuperação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.subtitle}>
          Digite seu email para receber as instruções de recuperação de senha
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

        <Button
          title="Enviar instruções"
          onPress={handleResetPassword}
          loading={isLoading}
          disabled={Object.keys(errors).length > 0}
          containerStyle={styles.button}
        />

        <Link
          title="Voltar para o login"
          onPress={() => navigation.navigate('Login')}
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
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  button: {
    marginTop: 20,
    marginBottom: 10,
  },
}); 