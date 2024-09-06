import { View, Text, ScrollView, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import { StatusBar } from 'expo-status-bar'
import { useRefresh } from '../../context/RefreshContext'
import styles from '../styles'

const SignIn = () => {
    const { setUser, setIsLoggedIn, setLeague } = useGlobalContext();
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const { triggerRefresh } = useRefresh();

    const [isSubmitting, setIsSubmitting] = useState(false)

    const submit = async () => {
        if (!form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all the fields')
        }
        setIsSubmitting(true);
        try {
            await signIn(form.email, form.password);

            const result = await getCurrentUser();
            setUser(result);
            setLeague(result.league);
            setIsLoggedIn(true);

            router.replace('../league')
            triggerRefresh();

        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={{ paddingBottom: 260 }} showsVerticalScrollIndicator={false}>
                <View className="w-full  h-full px-5 my-0 color-white">
                    <Text style={{ color: '#DBB978' }} className="text-5xl mt-8 text-bold font-bold text-center color-white">
                        Brouha
                    </Text>
                    <Text style={{ color: '#DBB978' }} className="text-2xl text-bold mt-10 font-bold text-center color-white">
                        Welcome Back!
                    </Text>
                    <Text style={{ color: '#DBB978' }} className="text-xl text-bold mt-5 text-center color-white">
                        Go ahead and log in below
                    </Text>
                    <FormField
                        title="Email"
                        value={form.email}
                        placeholder="Type your email"
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                        titleStyle={{ color: '#DBB978' }}
                    />

                    <FormField
                        title="Password"
                        value={form.password}
                        placeholder="Type your password"
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                        titleStyle={{ color: '#DBB978' }}
                    />

                    <CustomButton
                        title="Log In"
                        handlePress={submit}
                        containerStyles={"mt-12"}
                        isLoading={isSubmitting}
                    />
                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text style={{ color: '#DBB978' }} className="text-lg font-pregular color-white">
                            Don't have an account?
                        </Text>
                        <Link href="./sign-up" className="text-lg font-psemibold text-red-600">Sign up</Link>
                    </View>
                </View>
            </ScrollView>
            <StatusBar style='light' />
        </SafeAreaView>

    )
}

export default SignIn