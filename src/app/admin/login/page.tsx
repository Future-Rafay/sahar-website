import { AuthForm } from "@/components/site/auth-form";
import { Card } from "@/components/ui/card";

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4">
      <Card className="w-full max-w-md">
        <p className="font-semibold text-secondary">SAHAR ADMIN</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Staff sign in</h1>
        <div className="mt-6"><AuthForm locale="en" mode="login" admin /></div>
      </Card>
    </main>
  );
}
