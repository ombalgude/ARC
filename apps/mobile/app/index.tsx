import { Redirect } from 'expo-router';

// Root index redirects to the welcome screen (entry point of auth flow)
export default function IndexRoute(): React.JSX.Element {
  return <Redirect href={"/(auth)/welcome" as any} />;
}
