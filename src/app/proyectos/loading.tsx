import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/layout/navbar";

export default function ProyectosLoading() {
  return (
    <>
      <Navbar solid />
      <main className="flex-1 pt-24">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="mt-4 h-6 w-96" />
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl bg-white shadow-sm">
                <Skeleton className="aspect-[16/10] rounded-t-2xl" />
                <div className="p-5">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="mt-2 h-4 w-32" />
                  <Skeleton className="mt-4 h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
