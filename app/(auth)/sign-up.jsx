import { View, Text, ScrollView, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import Checkbox from 'expo-checkbox';
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignUp = () => {
    const { setUser, setIsLoggedIn } = useGlobalContext();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isChecked, setChecked] = useState(false);

    const submit = async () => {
        if (!form.username || !form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all the fields')
        }
        setIsSubmitting(true);
        try {
            const result = await createUser(form.email, form.password, form.username);

            setUser(result);
            setIsLoggedIn(true);

            router.replace("../league")
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SafeAreaView className="bg-red-100 h-full">
            <View className="w-full  h-full px-5 my-6">
                <Text className="text-5xl mt-2 text-bold font-bold text-center">
                    Brouha
                </Text>
                <Text className="text-2xl text-bold mt-8 font-bold text-center">
                    Create an account
                </Text>
                <Text className=" text-bold mt-5 text-center">
                    Enter your username and personal account info
                </Text>
                <FormField
                    title="Username"
                    value={form.username}
                    placeholder="Make your username"
                    handleChangeText={(e) => setForm({ ...form, username: e })}
                    otherStyles="mt-7"
                />
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

                <View className="flex-row items-center mt-5 ml-3">
                    <Checkbox
                        value={isChecked}
                        onValueChange={setChecked}
                        color={isChecked ? '#4630EB' : undefined}
                    />
                    <Text className="text-lg font-pregular ml-2">
                        I agree to the terms of service
                    </Text>
                </View>

                <CustomButton
                    title="Sign up"
                    handlePress={submit}
                    containerStyles={"mt-8"}
                    isLoading={isSubmitting}
                />
                <View className="justify-center pt-5 flex-row gap-2">
                    <Text className="text-lg font-pregular">
                        Already have an account?
                    </Text>
                    <Link href="./sign-in" className="text-lg font-psemibold text-red-600">Log In</Link>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SignUp