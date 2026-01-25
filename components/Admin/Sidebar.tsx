"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    ChevronLeft
} from "lucide-react";
import Image from "next/image";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/admin/dashboard" },
        { label: "Inventory", icon: <Package size={20} />, href: "/admin/dashboard/inventory" },
        { label: "Orders", icon: <ShoppingBag size={20} />, href: "/admin/dashboard/orders" },
        { label: "Customers", icon: <Users size={20} />, href: "/admin/dashboard/customers" },
        { label: "Settings", icon: <Settings size={20} />, href: "/admin/dashboard/settings" },
    ];

    const router = useRouter();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.push("/catalog");
        } catch (error) {
            console.error("Error logging out:", error);
            // Fallback redirect even if error occurs
            router.push("/catalog");
        }
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <Image src="/logo.png" alt="AOSA Logo" width={40} height={40} />
                <span>Admin AOSA</span>
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className={styles.footer}>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
