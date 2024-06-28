import { View, Text, ScrollView, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { signIn } from '../../lib/appwrite'

const SignIn = () => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const submit = async () => {
        if (!form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all the fields')
        }
        setIsSubmitting(true);
        try {
            await signIn(form.email, form.password);
            router.replace('./league')
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SafeAreaView className="bg-red-100 h-full">
            <ScrollView>
                <View className="w-full  h-full px-5 my-6">
                    <Text className="text-5xl mt-12 text-bold font-bold text-center">
                        Brouha
                    </Text>
                    <Text className="text-2xl text-bold mt-10 font-bold text-center">
                        Welcome Back!
                    </Text>
                    <Text className="text-xl text-bold mt-5 text-center">
                        Go ahead and log in below
                    </Text>
                    <FormField
                        title="Email"
                        value={form.email}
                        placeholder="Type your email"
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />

                    <FormField
                        title="Password"
                        value={form.password}
                        placeholder="Type your password"
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                    />

                    <CustomButton
                        title="Log In"
                        handlePress={submit}
                        containerStyles={"mt-12"}
                        isLoading={isSubmitting}
                    />
                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg font-pregular">
                            Don't have an account?
                        </Text>
                        <Link href="./sign-up" className="text-lg font-psemibold text-red-600">Sign up</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignIn