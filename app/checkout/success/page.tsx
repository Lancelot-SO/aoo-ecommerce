"use client";

import Header from "@/components/Header";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styles from "./success.module.css";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order') || "AOSA-ORDER";

    return (
        <div className={styles.successCard}>
            <div className={styles.iconWrapper}>
                <CheckCircle size={64} color="#10b981" />
            </div>
            <h1>Order Confirmed!</h1>
            <p className={styles.orderNumber}>Order #{orderNumber}</p>
            <p className={styles.message}>
                Thank you for your purchase. We've sent a confirmation email and SMS with your order details.
            </p>

            <div className={styles.details}>
                <div className={styles.detailRow}>
                    <span>Estimated Delivery</span>
                    <strong>Jan 28, 2027</strong>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.downloadBtn}>
                    <Download size={20} /> Download Invoice
                </button>
                <Link href="/catalog" className={styles.continueBtn}>
                    Continue Shopping <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <main>
            <Header />
            <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>
                <Suspense fallback={<div>Loading confirmation...</div>}>
                    <SuccessContent />
                </Suspense>
            </div>
        </main>
    );
}

