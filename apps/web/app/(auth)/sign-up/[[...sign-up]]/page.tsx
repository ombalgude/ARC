import { SignUp } from "@clerk/nextjs";

export default function SignUpPage(): React.JSX.Element {
  return (
    <main style={styles.shell}>
      <SignUp signInUrl="/sign-in" />
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
