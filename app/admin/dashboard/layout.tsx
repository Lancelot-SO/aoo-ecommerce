"use client";

import Sidebar from "@/components/Admin/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAdmin, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/login");
            } else if (!isAdmin) {
                router.push("/catalog"); // Or some "Unauthorized" page
            }
        }
    }, [user, isAdmin, isLoading, router]);

    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>Loading...</div>;
    }

    if (!user || !isAdmin) {
        return null; // Don't render anything while redirecting
    }

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{ flex: 1, minHeight: '100vh', background: '#f9f9f9', position: 'relative' }}>
                {children}
            </main>
        </div>
    );
}
