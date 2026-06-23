import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  return (
    <main style={styles.shell}>
      <h1>Welcome, {firstName}</h1>
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
