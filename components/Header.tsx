"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X, Search, ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Header.module.css";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { cartCount } = useCart();
    const { user, signOut } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const userInitials = user?.email?.substring(0, 2).toUpperCase() || "??";

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
            <div className={`container ${styles.container}`}>
                <div className={styles.mobileMenuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </div>

                <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
                    <Link href="/catalog" className={styles.navLink}>Shop</Link>
                    <Link href="/contact" className={styles.navLink}>Contact</Link>
                    <Link href="/about" className={styles.navLink}>Our Story</Link>
                </nav>

                <Link href="/" className={styles.logoContainer}>
                    <Image
                        src="https://i.pinimg.com/1200x/c0/77/1f/c0771f0f67d5bffb2668c803b77dd868.jpg"
                        alt="Achimota Centenary Logo"
                        width={60}
                        height={60}
                        className={styles.logo}
                    />
                    <div className={styles.logoText}>
                        <span className={styles.schoolName}>ACHIMOTA</span>
                        <span className={styles.centenary}>CENTENARY</span>
                    </div>
                </Link>

                <div className={styles.actions}>
                    <button className={styles.actionBtn}>
                        <Search size={20} />
                    </button>
                    <Link href="/cart" className={styles.actionBtn}>
                        <ShoppingBag size={20} />
                        {mounted && cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                    </Link>
                    {mounted && user ? (
                        <div className={styles.userMenuContainer} ref={dropdownRef}>
                            <button 
                                className={styles.userTrigger}
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                            >
                                <div className={styles.userAvatar}>
                                    {userInitials}
                                </div>
                                <ChevronDown size={14} className={`${styles.chevron} ${isUserDropdownOpen ? styles.chevronRotate : ""}`} />
                            </button>

                            <AnimatePresence>
                                {isUserDropdownOpen && (
                                    <motion.div 
                                        className={styles.dropdownMenu}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className={styles.dropdownHeader}>
                                            <span className={styles.userEmail}>{user.email}</span>
                                        </div>
                                        <div className={styles.dropdownDivider} />
                                        <button onClick={signOut} className={styles.dropdownItem}>
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link href="/login" className={styles.adminLink}>Login / Signup</Link>
                    )}
                </div>
            </div>
        </header>
    );
}
