import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
  return (
    <>
      <Navbar solid />
      <main className="flex flex-1 items-center justify-center pt-24">
        <div className="mx-auto max-w-md px-6 py-32 text-center">
          <h1 className="font-heading text-6xl font-bold text-navy">404</h1>
          <p className="mt-4 text-lg text-gray">
            La página que buscas no existe o fue movida.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-celeste px-6 py-3 text-base font-medium text-white transition-all duration-300 hover:bg-celeste/90"
          >
            Volver al Inicio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
