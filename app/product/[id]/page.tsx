"use client";

import { useState, useEffect, use } from "react";
import Header from "@/components/Header";
import { ChevronLeft, ShoppingCart, Share2, Heart, Loader2, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import styles from "./product.module.css";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const router = useRouter();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("M");
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    async function fetchProduct() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*, categories(name)')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProduct(data);
            // Set default color if colors are available
            if (data?.colors && data.colors.length > 0) {
                setSelectedColor(data.colors[0]);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleAddToCart = () => {
        if (!product) return;

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || "/products/blazer.png",
            quantity: quantity,
            size: selectedSize,
            color: selectedColor || undefined
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push("/checkout");
    };

    if (loading) {
        return (
            <main>
                <Header />
                <div className={styles.loaderContainer}>
                    <Loader2 className={styles.spin} size={40} />
                    <p>Loading product details...</p>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main>
                <Header />
                <div className={styles.errorContainer}>
                    <h2>Product Not Found</h2>
                    <p>The product you're looking for doesn't exist or has been removed.</p>
                    <Link href="/catalog" className={styles.backBtn}>Return to Catalog</Link>
                </div>
            </main>
        );
    }

    const mainImage = product.images?.[0] || "/products/blazer.png";
    const galleryImages = product.images?.length > 0 ? product.images : [mainImage];

    return (
        <main>
            <Header />

            <div className="container" style={{ paddingTop: '120px' }}>
                <Link href="/catalog" className={styles.backBtn}>
                    <ChevronLeft size={20} /> Back to Catalog
                </Link>

                <div className={styles.productGrid}>
                    <div className={styles.imageGallery}>
                        <div className={styles.mainImage}>
                            <Image
                                src={mainImage}
                                alt={product.name}
                                fill
                                className={styles.img}
                                priority
                            />
                        </div>
                        <div className={styles.thumbnails}>
                            {galleryImages.map((img: string, i: number) => (
                                <div key={i} className={styles.thumbnail}>
                                    <Image src={img} alt={product.name} fill className={styles.img} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.details}>
                        <span className={styles.category}>{product.categories?.name || 'Commemorative'}</span>
                        <h1 className={styles.title}>{product.name}</h1>
                        <p className={styles.price}>GH₵ {product.price.toLocaleString()}</p>

                        <div className={styles.divider}></div>

                        <p className={styles.description}>{product.description || "Official commemorative merchandise for the Achimota Senior High School 100th Anniversary Celebration."}</p>
                        {product.sku && <p className={styles.sku}><strong>SKU:</strong> {product.sku}</p>}

                        <div className={styles.options}>
                            {/* Color Selector */}
                            {product.colors && product.colors.length > 0 && (
                                <div className={styles.optionGroup}>
                                    <span className={styles.optionLabel}>Color</span>
                                    <div className={styles.colorSelector}>
                                        {product.colors.map((color: string) => (
                                            <button
                                                key={color}
                                                className={`${styles.colorBtn} ${selectedColor === color ? styles.colorActive : ""}`}
                                                onClick={() => setSelectedColor(color)}
                                                title={color}
                                                style={{ backgroundColor: color.toLowerCase() }}
                                            >
                                                <span className={styles.colorLabel}>{color}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selector */}
                            <div className={styles.optionGroup}>
                                <span className={styles.optionLabel}>Size</span>
                                <div className={styles.sizeSelector}>
                                    {(product.sizes && product.sizes.length > 0 ? product.sizes : SIZES).map((size: string) => (
                                        <button
                                            key={size}
                                            className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeActive : ""}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.optionGroup}>
                                <span className={styles.optionLabel}>Quantity</span>
                                <div className={styles.quantitySelector}>
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                </div>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <button
                                className={`${styles.addToCart} ${added ? styles.added : ""}`}
                                onClick={handleAddToCart}
                                disabled={added}
                            >
                                {added ? <><Check size={20} /> Added!</> : <><ShoppingCart size={20} /> Add to Cart</>}
                            </button>
                            <button className={styles.buyNow} onClick={handleBuyNow}>
                                Buy It Now
                            </button>
                        </div>

                        <div className={styles.shippingInfo}>
                            <p>✓ Free delivery within Accra</p>
                            <p>✓ International shipping available</p>
                            <p>✓ Estimated delivery: 3-5 business days</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
