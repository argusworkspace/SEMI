import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Next.js + FastAPI Monorepo</h1>
      <p className="text-gray-500">Modular monolith template</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="rounded-md border px-4 py-2 hover:bg-gray-50"
        >
          Register
        </Link>
      </div>
    </main>
  );
}
