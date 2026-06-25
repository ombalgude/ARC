import { auth } from "@clerk/nextjs/server";
import styles from "./page.module.css";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

interface AdminHealth {
  status: "online";
  totalUsers: number;
  totalActiveWorkoutPlans: number;
  workoutSessionsLoggedToday: number;
}

const API_URL = process.env.API_URL ?? "http://localhost:3001";

export default async function AdminPage(): Promise<React.JSX.Element> {
  const { getToken } = await auth();
  const token = await getToken();

  const health = token ? await fetchAdminHealth(token) : null;

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>ARC Operations</p>
            <h1 className={styles.title}>Admin Control Center</h1>
          </div>
          <div className={styles.status}>
            <span className={styles.statusDot} />
            System Status: Online
          </div>
        </header>

        {health ? (
          <div className={styles.grid}>
            <StatCard label="Total Users" value={health.totalUsers} />
            <StatCard label="Active Plans" value={health.totalActiveWorkoutPlans} />
            <StatCard label="Sessions Today" value={health.workoutSessionsLoggedToday} />
          </div>
        ) : (
          <div className={styles.errorPanel}>
            <h2>Admin telemetry unavailable</h2>
            <p>Sign in with the configured admin account to view system metrics.</p>
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }): React.JSX.Element {
  return (
    <article className={styles.card}>
      <p className={styles.cardLabel}>{label}</p>
      <p className={styles.cardValue}>{value.toLocaleString("en-US")}</p>
    </article>
  );
}

async function fetchAdminHealth(token: string): Promise<AdminHealth | null> {
  try {
    const response = await fetch(`${API_URL}/api/v1/admin/health`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = (await response.json().catch(() => null)) as ApiResponse<AdminHealth> | null;

    if (!response.ok || !payload?.success || !payload.data) {
      return null;
    }

    return payload.data;
  } catch {
    return null;
  }
}
