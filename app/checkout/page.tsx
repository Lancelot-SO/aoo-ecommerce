"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";
import { GHANA_REGIONS } from "@/constants/ghana";
import { ChevronRight, CreditCard, Smartphone, Building, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        region: "Greater Accra",
        address: "",
        notes: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("momo");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert("Your cart is empty");
            return;
        }

        setLoading(true);

        try {
            const orderNumber = `AOSA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
            const subtotal = cartTotal;
            const deliveryFee = 25;
            const total = subtotal + deliveryFee;

            const orderData = {
                order_number: orderNumber,
                customer_name: formData.fullName,
                customer_email: formData.email,
                customer_phone: formData.phone,
                delivery_address: `${formData.address}, ${formData.region}`,
                delivery_notes: formData.notes,
                items: cart.map(item => ({
                    product_id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size
                })),
                subtotal,
                delivery_fee: deliveryFee,
                total,
                payment_method: paymentMethod,
                payment_status: 'pending',
                order_status: 'pending'
            };

            const { error } = await supabase
                .from('orders')
                .insert([orderData]);

            if (error) throw error;

            clearCart();
            router.push(`/checkout/success?order=${orderNumber}`);
        } catch (error: any) {
            console.error('Error creating order:', error.message);
            alert(`Failed to place order: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <Header />
            <div className="container" style={{ paddingTop: '120px' }}>
                <h1 className={styles.title}>Checkout</h1>

                <form onSubmit={handleSubmit} className={styles.checkoutGrid}>
                    <div className={styles.formSection}>
                        <div className={styles.card}>
                            <h2>1. Delivery Information</h2>
                            <div className={styles.inputGrid}>
                                <div className={styles.inputGroup}>
                                    <label>Full Name</label>
                                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Email Address</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Phone Number (MoMo)</label>
                                    <input type="tel" name="phone" placeholder="024XXXXXXX" required value={formData.phone} onChange={handleChange} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Region</label>
                                    <select name="region" value={formData.region} onChange={handleChange}>
                                        {GHANA_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>Delivery Address / Town</label>
                                    <input type="text" name="address" required value={formData.address} onChange={handleChange} />
                                </div>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>Additional Notes (Optional)</label>
                                    <textarea name="notes" rows={3} value={formData.notes} onChange={handleChange}></textarea>
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.card} ${styles.paymentCard}`}>
                            <h2>2. Payment Method</h2>
                            <div className={styles.paymentOptions}>
                                <div
                                    className={`${styles.paymentOption} ${paymentMethod === 'momo' ? styles.activeOption : ""}`}
                                    onClick={() => setPaymentMethod('momo')}
                                >
                                    <Smartphone size={24} />
                                    <div>
                                        <strong>Mobile Money</strong>
                                        <p>MTN, Vodafone, AirtelTigo</p>
                                    </div>
                                    {paymentMethod === 'momo' && <div className={styles.check}>✓</div>}
                                </div>

                                <div
                                    className={`${styles.paymentOption} ${paymentMethod === 'card' ? styles.activeOption : ""}`}
                                    onClick={() => setPaymentMethod('card')}
                                >
                                    <CreditCard size={24} />
                                    <div>
                                        <strong>Debit/Credit Card</strong>
                                        <p>Visa, Mastercard</p>
                                    </div>
                                    {paymentMethod === 'card' && <div className={styles.check}>✓</div>}
                                </div>

                                <div
                                    className={`${styles.paymentOption} ${paymentMethod === 'bank' ? styles.activeOption : ""}`}
                                    onClick={() => setPaymentMethod('bank')}
                                >
                                    <Building size={24} />
                                    <div>
                                        <strong>Bank Transfer</strong>
                                        <p>Manual confirmation</p>
                                    </div>
                                    {paymentMethod === 'bank' && <div className={styles.check}>✓</div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.orderSummary}>
                        <div className={styles.card}>
                            <h2>Order Summary</h2>
                            <div className={styles.itemsList}>
                                {cart.length > 0 ? cart.map(item => (
                                    <div key={`${item.id}-${item.size}`} className={styles.item}>
                                        <span>{item.name} {item.size ? `(${item.size})` : ""} x {item.quantity}</span>
                                        <span>GH₵ {(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                )) : (
                                    <p style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Your cart is empty</p>
                                )}
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>GH₵ {cartTotal.toLocaleString()}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Delivery Fee</span>
                                <span>GH₵ 25.00</span>
                            </div>
                            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                                <span>Total</span>
                                <span>GH₵ {(cartTotal + 25).toLocaleString()}</span>
                            </div>

                            <button type="submit" className={styles.payBtn} disabled={loading || cart.length === 0}>
                                {loading ? <><Loader2 className={styles.spin} size={20} /> Processing...</> : <>Pay Now <ChevronRight size={20} /></>}
                            </button>

                            <p className={styles.legal}>
                                By placing this order, you agree to our Terms of Service & Privacy Policy.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
