import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Slot } from "expo-router";

export default function AuthLayout(): React.JSX.Element | null {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return <Slot />;
}
