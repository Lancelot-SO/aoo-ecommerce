"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

// Validate if a URL is a proper image URL
function isValidImageUrl(url: string): boolean {
    if (!url) return false;

    // Check for common invalid patterns (page URLs instead of image URLs)
    const invalidPatterns = [
        /pinterest\.com\/pin\//i,
        /instagram\.com\/p\//i,
        /facebook\.com/i,
        /twitter\.com/i,
    ];

    if (invalidPatterns.some(pattern => pattern.test(url))) {
        return false;
    }

    // Basic URL validation
    try {
        new URL(url);
        return true;
    } catch {
        return url.startsWith('/'); // Allow relative paths
    }
}

const FALLBACK_IMAGE = "/products/blazer.png";

export default function ProductCard({ id, name, price, image, category }: ProductCardProps) {
    const { addToCart } = useCart();
    const [imgSrc, setImgSrc] = useState(() =>
        isValidImageUrl(image) ? image : FALLBACK_IMAGE
    );
    const [hasError, setHasError] = useState(false);
    const [added, setAdded] = useState(false);

    const handleImageError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(FALLBACK_IMAGE);
        }
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        addToCart({
            id,
            name,
            price,
            image: imgSrc,
            quantity: 1,
            size: "M", // Default size for quick add
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <div className={`${styles.card} premium-card`}>
            <div className={styles.imageContainer}>
                <Link href={`/product/${id}`} className={styles.imageLink}>
                    <Image
                        src={imgSrc}
                        alt={name}
                        fill
                        className={styles.image}
                        onError={handleImageError}
                    />
                </Link>
                <div className={styles.actions}>
                    <button 
                        className={`${styles.actionBtn} ${added ? styles.added : ""}`}
                        onClick={handleAddToCart}
                        title={added ? "Added to cart!" : "Add to cart"}
                    >
                        {added ? <Check size={18} /> : <ShoppingCart size={18} />}
                    </button>
                    <Link href={`/product/${id}`} className={styles.actionBtn}>
                        <Eye size={18} />
                    </Link>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.meta}>
                    <span className={styles.category}>{category}</span>
                </div>
                <Link href={`/product/${id}`}>
                    <h3 className={styles.name}>{name}</h3>
                </Link>
                <p className={styles.price}>GH₵ {price.toLocaleString()}</p>
            </div>
        </div>
    );
}
