import { LiveTransitMap } from '@/components/LiveTransitMap';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <LiveTransitMap />
      </div>
    </main>
  );
}