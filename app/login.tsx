import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
  } from 'react-native';
  
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext'; 
import axios from 'axios';

export default function LoginPage() { // Changed to default export
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth(); // Access signIn from context

    const handleLogin = async () => {
        if (!correo || !password) {
            Alert.alert('Error', 'Please enter both username and password.');
            return;
        }

        setLoading(true);
        try {

            const response = await axios.post(`http://10.22.198.197:5050/api/login`, {
                correo,
                password,
            });

            console.log("Login response data:", response.data);

            const {token} = response.data;
            
            await signIn(token); // Store token and update auth state
            // Expo Router's _layout.js will handle the redirect after signIn updates userToken
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            Alert.alert('Login Failed', error.response?.data?.message || 'Invalid credentials or server error.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = () => {
      router.push('/signup');
    };

    return (
        <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Inicia</Text>
              <Text style={styles.title}>Sesión</Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                placeholderTextColor="#999"
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.loginButtonText}>Ingresar</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity 
            style={styles.createAccountContainer}
            onPress={handleCreateAccount}
            activeOpacity={0.7}
            >
            <Text style={styles.createAccountText}>
                ¿No tienes una cuenta todavía?{'\n'}
                <Text style={styles.createAccountLink}>Crea una nueva</Text>
            </Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
     </SafeAreaView>
    );
};
        

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    lineHeight: 50,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#C31F39',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#C31F39',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createAccountContainer: {
    alignItems: 'center',
  },
  createAccountText: {
    fontSize: 14,
    color: '#C31F39',
    textAlign: 'center',
    lineHeight: 20,
  },
  createAccountLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});