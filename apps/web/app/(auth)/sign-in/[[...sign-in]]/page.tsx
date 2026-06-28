import { SignIn } from "@clerk/nextjs";

export default function SignInPage(): React.JSX.Element {
  return (
    <main style={styles.shell}>
      <SignIn signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard" />
    </main>
  );
}

const styles = {
  shell: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
} satisfies Record<string, React.CSSProperties>;
