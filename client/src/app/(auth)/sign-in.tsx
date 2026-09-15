import { COLORS } from "@/constants";
import { useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, TextInput, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [showEmailCode, setShowEmailCode] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const loading = fetchStatus === "fetching";

  const onSignInPress = async () => {
    if (!emailAddress || !password) return;
    setErrorMsg("");

    const { error } = await signIn.password({
      identifier: emailAddress,
      password,
    });

    if (error) {
      setErrorMsg(error.message ?? "Something went wrong");
      return;
    }

    if (signIn.status === "complete") {
      router.replace("/");
    } else if (signIn.status === "needs_second_factor") {
      const { error: sendError } = await signIn.emailCode.sendCode();
      if (sendError) {
        setErrorMsg(sendError.message ?? "Couldn't send verification code");
        return;
      }
      setShowEmailCode(true);
    }
  };

  const onVerifyPress = async () => {
    if (!code) return;
    setErrorMsg("");

    const { error } = await signIn.emailCode.verifyCode({ code });

    if (error) {
      setErrorMsg(error.message ?? "Invalid code");
      return;
    }

    if (signIn.status === "complete") {
      router.replace("/");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center" style={{ padding: 28 }}>
      {!showEmailCode ? (
        <>
          <TouchableOpacity onPress={() => router.push("/")} className="absolute top-12 z-10">
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-primary mb-2">Welcome Back</Text>
            <Text className="text-secondary">Sign in to continue</Text>
          </View>

          <View className="mb-4">
            <Text className="text-primary font-medium mb-2">Email</Text>
            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary"
              placeholder="user@example.com"
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
              value={emailAddress}
              onChangeText={setEmailAddress}
            />
          </View>

          <View className="mb-6">
            <Text className="text-primary font-medium mb-2">Password</Text>
            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary"
              placeholder="********"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {errorMsg ? <Text className="text-red-500 mb-4 text-center">{errorMsg}</Text> : null}

          <Pressable
            className={`w-full py-4 rounded-full items-center mb-10 ${loading || !emailAddress || !password ? "bg-gray-300" : "bg-primary"}`}
            onPress={onSignInPress}
            disabled={loading || !emailAddress || !password}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Sign In</Text>}
          </Pressable>

          <View className="flex-row justify-center">
            <Text className="text-secondary">Don&apos;t have an account? </Text>
            <Link href="/sign-up">
              <Text className="text-primary font-bold">Sign up</Text>
            </Link>
          </View>
        </>
      ) : (
        <>
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-primary mb-2">Verify Email</Text>
            <Text className="text-secondary text-center">Enter the code sent to your email</Text>
          </View>

          <View className="mb-6">
            <TextInput
              className="w-full bg-surface p-4 rounded-xl text-primary text-center tracking-widest"
              placeholder="123456"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />
          </View>

          {errorMsg ? <Text className="text-red-500 mb-4 text-center">{errorMsg}</Text> : null}

          <Pressable className="w-full bg-primary py-4 rounded-full items-center" onPress={onVerifyPress} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold text-lg">Verify</Text>}
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
}