import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { validarLogin } from '../database/database/database.js';
 
export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
const handleLogin = () => {
  if (!email || !password) {
    alert('Preencha o e-mail e a senha.');
    return;
  }
 
  try {
    const usuario = validarLogin(email, password);
 
    if (usuario) {
  alert('Login realizado com sucesso!');
  router.push('/Inicio');
} else {
  alert('E-mail ou senha incorretos.');
}
  } catch (error) {
    console.log('Erro ao realizar login:', error);
    alert('Ocorreu um erro ao tentar entrar.');
  }
};
 
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.loginBox}>
          <Text style={styles.title}>Login</Text>
 
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email:</Text>
 
            <TextInput
              style={styles.input}
              placeholder="seuemail@email.com"
              placeholderTextColor="#752CB9"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
 
 
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha:</Text>
 
            <TextInput
              style={styles.input}
              placeholder="sua senha"
              placeholderTextColor="#752CB9"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
 
          <View style={styles.forgotContainer}>
            <TouchableOpacity>
              <Text style={styles.forgotText}>
                Esqueci minha senha
              </Text>
            </TouchableOpacity>
          </View>
 
          
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
 
          
          <View style={styles.signupContainer}>
            <TouchableOpacity
              onPress={() => router.push('/Cadastro')}
            >
              <Text style={styles.signupText}>
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d7b5eb',
  },
 
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
 
  loginBox: {
    width: '100%',
    maxWidth: 500,
    padding: 32,
    borderRadius: 24,
    backgroundColor: '#7B2CBF',
  },
 
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Times New Roman',
  },
 
  inputContainer: {
    marginBottom: 16,
  },
 
  label: {
    fontSize: 20,
    color: '#28033c',
    marginBottom: 8,
    fontFamily: 'Times New Roman',
  },
 
  input: {
    width: '100%',
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#f3cbff',
    color: '#752cb9',
    borderWidth: 2,
    borderColor: '#471c6c',
    fontSize: 16,
    fontFamily: 'Times New Roman',
  },
 
  forgotContainer: {
    alignItems: 'flex-end',
    marginTop: 2,
  },
 
  forgotText: {
    fontSize: 14,
    color: '#d39af4',
    textDecorationLine: 'underline',
    fontFamily: 'Times New Roman',
  },
 
  loginButton: {
    width: '60%',
    height: 44,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#471C6C',
    marginTop: 24,
  },
 
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Times New Roman',
  },
 
  signupContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
 
  signupText: {
    color: '#d39af4',
    textDecorationLine: 'underline',
    fontSize: 16,
    fontFamily: 'Times New Roman',
  },
});
 