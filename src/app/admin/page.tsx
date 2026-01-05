'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin/portfolio');
    } else if (status === 'unauthenticated') {
      router.replace('/admin/login');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Loader2 className="w-8 h-8 animate-spin text-[#025566]" />
    </div>
  );
}
