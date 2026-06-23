import { useState } from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to sign in";
}

export default function SignInScreen(): React.JSX.Element {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn(): Promise<void> {
    if (!isLoaded || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(app)/dashboard");
      } else {
        setErrorMessage("Additional verification is required to complete sign in");
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        onChangeText={setEmailAddress}
        placeholder="Email"
        placeholderTextColor="#8a8f98"
        style={styles.input}
        value={emailAddress}
      />
      <TextInput
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#8a8f98"
        secureTextEntry
        style={styles.input}
        value={password}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Pressable disabled={isSubmitting} onPress={handleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>{isSubmitting ? "Signing in..." : "Sign in"}</Text>
      </Pressable>
      <Link href="/(auth)/sign-up" style={styles.link}>
        Create an account
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#111318",
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#1c2028",
    borderColor: "#303642",
    borderRadius: 8,
    borderWidth: 1,
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#f2c46d",
    borderRadius: 8,
    marginTop: 8,
    paddingVertical: 14,
  },
  buttonText: {
    color: "#171717",
    fontSize: 16,
    fontWeight: "700",
  },
  error: {
    color: "#ff8a8a",
    marginBottom: 8,
  },
  link: {
    color: "#f2c46d",
    fontSize: 16,
    marginTop: 18,
    textAlign: "center",
  },
});
