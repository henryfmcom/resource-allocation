'use client'

import { useEffect, useState } from 'react';
import AddAllocationForm from '@/components/misc/AddAllocationForm';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AllocationEditClientProps {
  id: string;
}

export default function AllocationEditClient({ id }: AllocationEditClientProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/auth/signin');
          return;
        }
        
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
          variant: "destructive",
        });
        router.push('/allocations');
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen">
      <DashboardLayout user={user}>
        <AddAllocationForm allocationId={id} />
      </DashboardLayout>
    </div>
  );
} 