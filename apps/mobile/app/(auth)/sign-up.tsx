import { useState } from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to sign up";
}

export default function SignUpScreen(): React.JSX.Element {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignUp(): Promise<void> {
    if (!isLoaded || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setIsVerifying(true);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerification(): Promise<void> {
    if (!isLoaded || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(app)/dashboard");
      } else {
        setErrorMessage("Unable to complete email verification");
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isVerifying ? "Verify email" : "Create account"}</Text>
      {isVerifying ? (
        <TextInput
          keyboardType="number-pad"
          onChangeText={setVerificationCode}
          placeholder="Verification code"
          placeholderTextColor="#8a8f98"
          style={styles.input}
          value={verificationCode}
        />
      ) : (
        <>
          <TextInput
            onChangeText={setFirstName}
            placeholder="First name"
            placeholderTextColor="#8a8f98"
            style={styles.input}
            value={firstName}
          />
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
        </>
      )}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Pressable
        disabled={isSubmitting}
        onPress={isVerifying ? handleVerification : handleSignUp}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Working..." : isVerifying ? "Verify" : "Sign up"}
        </Text>
      </Pressable>
      <Link href="/(auth)/sign-in" style={styles.link}>
        Already have an account?
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
