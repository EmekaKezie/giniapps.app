import AppView from "@components/app/AppView";
import AuthLayout from "@core/layouts/AuthLayout";

export default function AppViewPage() {
  return (
    <AuthLayout>
      <AppView />
    </AuthLayout>
  );
}
