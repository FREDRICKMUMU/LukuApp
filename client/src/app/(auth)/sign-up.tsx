import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";
import { useSignUp } from "@clerk/expo";
import { COLORS } from "@/constants";

export default function SignUpScreen() {
    const { signUp, fetchStatus } = useSignUp();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [code, setCode] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);

    const loading = fetchStatus === "fetching";

    const onSignUpPress = async () => {
        if (!emailAddress || !password) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Please fill in all fields'
            });
            return;
        }

        const { error } = await signUp.password({
            emailAddress,
            password,
            firstName,
            lastName,
        });

        if (error) {
            Toast.show({
                type: 'error',
                text1: 'Failed to Sign Up',
                text2: error.message ?? "Something went wrong"
            });
            return;
        }

        const { error: sendError } = await signUp.verifications.sendEmailCode();

        if (sendError) {
            Toast.show({
                type: 'error',
                text1: 'Failed to Send Code',
                text2: sendError.message ?? "Something went wrong"
            });
            return;
        }

        setPendingVerification(true);
    };

    const onVerifyPress = async () => {
        if (!code) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Enter verification code'
            });
            return;
        }

        const { error } = await signUp.verifications.verifyEmailCode({ code });

        if (error) {
            Toast.show({
                type: 'error',
                text1: 'Failed to Verify',
                text2: error.message ?? "Invalid code"
            });
            return;
        }

        const { error: finalizeError } = await signUp.finalize();

        if (finalizeError) {
            Toast.show({
                type: 'error',
                text1: 'Failed to Complete Sign Up',
                text2: finalizeError.message ?? "Something went wrong"
            });
            return;
        }

        router.replace("/");
    };

    return (
        <SafeAreaView className="flex-1 bg-white justify-center" style={{ padding: 28 }}>
            {!pendingVerification ? (
                <>
                    <TouchableOpacity onPress={() => router.push("/")} className="absolute top-12 z-10">
                        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>

                    <View className="items-center mb-8">
                        <Text className="text-3xl font-bold text-primary mb-2">Create Account</Text>
                        <Text className="text-secondary">Sign up to get started</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="text-primary font-medium mb-2">First Name</Text>
                        <TextInput className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="John" placeholderTextColor="#999" value={firstName} onChangeText={setFirstName} />
                    </View>

                    <View className="mb-6">
                        <Text className="text-primary font-medium mb-2">Last Name</Text>
                        <TextInput className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="Doe" placeholderTextColor="#999" value={lastName} onChangeText={setLastName} />
                    </View>

                    <View className="mb-4">
                        <Text className="text-primary font-medium mb-2">Email</Text>
                        <TextInput className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="user@example.com" placeholderTextColor="#999" autoCapitalize="none" keyboardType="email-address" value={emailAddress} onChangeText={setEmailAddress} />
                    </View>

                    <View className="mb-6">
                        <Text className="text-primary font-medium mb-2">Password</Text>
                        <TextInput className="w-full bg-surface p-4 rounded-xl text-primary" placeholder="********" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} />
                    </View>

                    <TouchableOpacity className="w-full bg-primary py-4 rounded-full items-center mb-10" onPress={onSignUpPress} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Continue</Text>}
                    </TouchableOpacity>

                    <View className="flex-row justify-center">
                        <Text className="text-secondary">Already have an account? </Text>
                        <Link href="/sign-in">
                            <Text className="text-primary font-bold">Login</Text>
                        </Link>
                    </View>
                </>
            ) : (
                <>
                    <TouchableOpacity onPress={() => router.back()} className="absolute top-12 z-10">
                        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>

                    <View className="items-center mb-8">
                        <Text className="text-3xl font-bold text-primary mb-2">Verify Email</Text>
                        <Text className="text-secondary text-center">Enter the code sent to your email</Text>
                    </View>

                    <View className="mb-6">
                        <TextInput className="w-full bg-surface p-4 rounded-xl text-primary text-center tracking-widest" placeholder="123456" placeholderTextColor="#999" keyboardType="number-pad" value={code} onChangeText={setCode} />
                    </View>

                    <TouchableOpacity className="w-full bg-primary py-4 rounded-full items-center" onPress={onVerifyPress} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Verify</Text>}
                    </TouchableOpacity>
                </>
            )}
        </SafeAreaView>
    );
}