import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { cadastrarUsuario } from '../database/database/database.js';
 
export function CadastroScreen() {
  const [userType, setUserType] = useState<'cuidador' | 'familiar'>(
    'cuidador'
  );
 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
const handleCadastro = () => {
  if (!name.trim() || !email.trim() || !password || !confirmPassword) {
    alert('Preencha todos os campos.');
    return;
  }
 
  if (password !== confirmPassword) {
    alert('As senhas não coincidem.');
    return;
  }
 
  try {
    const usuarioId = cadastrarUsuario(
      name,
      email,
      password,
      userType
    );
 
    alert('Cadastro realizado com sucesso!');
 
    router.replace({
      pathname: '/Inicio',
      params: {
        usuarioId: String(usuarioId),
      },
    });
  } catch (error) {
    console.log('Erro ao cadastrar:', error);
    alert('Não foi possível realizar o cadastro.');
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
        <View style={styles.content}>
 
       
          <Text style={styles.title}>Cadastro</Text>
 
          
          <View style={styles.signupBox}>
 
            
            <View style={styles.userTypeContainer}>
 
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'cuidador' &&
                    styles.userTypeButtonActive,
                ]}
                onPress={() => setUserType('cuidador')}
              >
                <Text
                  style={[
                    styles.userTypeText,
                    userType === 'cuidador' &&
                      styles.userTypeTextActive,
                  ]}
                >
                  Cuidador
                </Text>
              </TouchableOpacity>
 
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'familiar' &&
                    styles.userTypeButtonActive,
                ]}
                onPress={() => setUserType('familiar')}
              >
                <Text
                  style={[
                    styles.userTypeText,
                    userType === 'familiar' &&
                      styles.userTypeTextActive,
                  ]}
                >
                  Familiar
                </Text>
              </TouchableOpacity>
 
            </View>
 
           
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#752cb9"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
 
      
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#752cb9"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
 
          
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#752cb9"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
 
            <TextInput
              style={styles.input}
              placeholder="Confirmar senha"
              placeholderTextColor="#752cb9"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
 
          
            <TouchableOpacity
              style={styles.signupButton}
               onPress={handleCadastro}
            >
              <Text style={styles.signupButtonText}>
                Cadastrar
              </Text>
            </TouchableOpacity>
 
          
            <TouchableOpacity
              style={styles.loginLinkContainer}
              onPress={() => router.push('/')}
            >
              <Text style={styles.loginLink}>
                Já tenho conta
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
 
  content: {
    width: '100%',
    maxWidth: 500,
  },
 
  title: {
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 48,
    fontWeight: 'bold',
    color: '#28033c',
    fontFamily: 'Times New Roman',
  },
 
  signupBox: {
    width: '100%',
    padding: 32,
    borderRadius: 24,
    backgroundColor: '#7B2CBF',
  },
 
  userTypeContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
 
  userTypeButton: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3cbff',
    borderWidth: 2,
    borderColor: '#471C6C',
  },
 
  userTypeButtonActive: {
    backgroundColor: '#471C6C',
  },
 
  userTypeText: {
    color: '#752cb9',
    fontSize: 16,
    fontFamily: 'Times New Roman',
  },
 
  userTypeTextActive: {
    color: '#FFFFFF',
  },
 
  input: {
    width: '100%',
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f3cbff',
    color: '#752cb9',
    fontSize: 16,
    fontFamily: 'Times New Roman',
    marginBottom: 16,
  },
 
  signupButton: {
    width: '100%',
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#471C6C',
    marginTop: 8,
  },
 
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Times New Roman',
  },
 
  loginLinkContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
 
  loginLink: {
    color: '#FFFFFF',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontFamily: 'Times New Roman',
  },
});