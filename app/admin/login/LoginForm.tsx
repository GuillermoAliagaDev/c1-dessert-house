"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });
  return (
    <motion.form
      action={action}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="card relative z-10 w-full max-w-sm space-y-4 p-7"
    >
      <div className="text-center">
        <Logo className="mx-auto h-14 w-14 animate-float" />
        <h1 className="mt-2 font-script text-2xl text-choco">Panel de administración</h1>
      </div>
      <label className="block text-sm font-bold">Usuario
        <input name="user" className="input mt-1" required autoComplete="username" />
      </label>
      <label className="block text-sm font-bold">Contraseña
        <input name="password" type="password" className="input mt-1" required autoComplete="current-password" />
      </label>
      {state.error && <p role="alert" className="rounded-xl bg-red-50 p-2 text-sm font-bold text-red-600">{state.error}</p>}
      <button className="btn w-full" disabled={pending}>{pending ? "Entrando…" : "Entrar"}</button>
    </motion.form>
  );
}
