import { auth } from "@clerk/nextjs/server";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.JSX.Element> {
  await auth.protect({ unauthenticatedUrl: "/sign-in" });

  return <>{children}</>;
}
