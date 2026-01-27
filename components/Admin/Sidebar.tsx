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
    ChevronLeft,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const router = useRouter();

    const menuItems = [
        { label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/admin/dashboard" },
        { label: "Inventory", icon: <Package size={20} />, href: "/admin/dashboard/inventory" },
        { label: "Orders", icon: <ShoppingBag size={20} />, href: "/admin/dashboard/orders" },
        { label: "Customers", icon: <Users size={20} />, href: "/admin/dashboard/customers" },
        { label: "Settings", icon: <Settings size={20} />, href: "/admin/dashboard/settings" },
    ];

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.push("/catalog");
        } catch (error) {
            console.error("Error logging out:", error);
            router.push("/catalog");
        }
    };

    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button className={styles.mobileToggle} onClick={toggleMobile}>
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Backdrop */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div 
                        className={styles.backdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                <motion.aside 
                    className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarOpen : ""}`}
                    initial={{ x: "-100%" }}
                    animate={{ x: isMobileOpen ? 0 : "-100%" }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                >
                    <div className={styles.logo}>
                        <Image src="/logo.png" alt="AOSA Logo" width={40} height={40} />
                        <span>Admin OAA</span>
                    </div>

                    <nav className={styles.nav}>
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
                                onClick={() => setIsMobileOpen(false)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className={styles.footer}>
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </motion.aside>
            </AnimatePresence>
        </>
    );
}
