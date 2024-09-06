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
import { useRefresh } from '../../context/RefreshContext'
import styles from '../styles'
import { StatusBar } from 'expo-status-bar'

const SignUp = () => {
    const { setUser, setIsLoggedIn, setLeague } = useGlobalContext();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    })

    const { triggerRefresh } = useRefresh();

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
            setLeague(null)
            setIsLoggedIn(true);

            router.replace("../league")
            triggerRefresh();
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 240 }} // Enable scrolling and centering
                showsVerticalScrollIndicator={false} // Hide the vertical scroll indicator (optional)
            >
                <View className="w-full  h-full px-5 my-6 color-white">
                    <Text style={{ color: '#DBB978' }} className="text-5xl mt-2 text-bold font-bold text-center color-white">
                        Brouha
                    </Text>
                    <Text style={{ color: '#DBB978' }} className="text-2xl text-bold mt-8 font-bold text-center color-white">
                        Create an account
                    </Text>
                    <Text style={{ color: '#DBB978' }} className=" text-bold mt-5 text-center color-white">
                        Enter your username and personal account info
                    </Text>
                    <FormField
                        title="Username"
                        value={form.username}
                        placeholder="Make your username"
                        handleChangeText={(e) => setForm({ ...form, username: e })}
                        otherStyles="mt-7"
                        titleStyle={{ color: '#DBB978' }}
                    />
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

                    <View className="flex-row items-center mt-5 ml-3">
                        <Checkbox
                            value={isChecked}
                            onValueChange={setChecked}
                            color={isChecked ? '#DC2626' : undefined}
                        />
                        <Text style={{ color: '#DBB978' }} className="text-lg font-pregular ml-2 color-white">
                            I agree to the{' '}
                            <Text
                                onPress={() => { }}
                                style={{ color: '#DBB978', textDecorationLine: 'underline' }}
                            >
                                terms of service
                            </Text>
                        </Text>
                    </View>

                    <CustomButton
                        title="Sign up"
                        handlePress={submit}
                        containerStyles={"mt-8"}
                        isLoading={isSubmitting}
                    />
                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text style={{ color: '#DBB978' }} className="text-lg font-pregular color-white">
                            Already have an account?
                        </Text>
                        <Link href="./sign-in" className="text-lg font-psemibold text-red-600" >Log In</Link>
                    </View>
                </View>
            </ScrollView>
            <StatusBar style='light' />
        </SafeAreaView >
    )
}

export default SignUp