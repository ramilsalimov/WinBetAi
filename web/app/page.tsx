import { redirect } from 'next/navigation';

// Root path → preview (Claude Design static export).
// Next.js App Router integration to proper components is TODO.
export default function Home() {
  redirect('/preview/index.html');
}
