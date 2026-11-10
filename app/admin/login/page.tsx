import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Ingresar · Administración" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <LoginForm />
    </div>
  );
}
