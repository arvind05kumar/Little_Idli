"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import Image from "next/image";

const FRAME_COUNT = 40;
const SCROLL_HEIGHT = "500vh";

export default function LittleIdliScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isScrollReady, setIsScrollReady] = useState(false);

    // Scroll progress for the entire container
    // Scroll progress relative to the container for the animation
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth scroll progress for softer animation
    // Initial value is 0 to start
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 200,
        damping: 40,
        restDelta: 0.001,
    });

    // Force scroll to top on load to prevent starting at the bottom
    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Hard reset scroll
        const resetScroll = () => {
            window.scrollTo(0, 0);

            // Stop any spring animation and force to 0
            if (smoothProgress) smoothProgress.set(0);

            // Double check in next frame (Next.js sometimes fights this)
            requestAnimationFrame(() => {
                window.scrollTo(0, 0);
                if (smoothProgress) smoothProgress.set(0);
                setTimeout(() => {
                    setIsScrollReady(true);
                }, 200);
            });
        };

        resetScroll();

        return () => {
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'auto';
            }
        };
    }, []);

    // Load images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            for (let i = 1; i <= FRAME_COUNT; i++) {
                const img = new window.Image();
                // Format: ezgif-frame-001.jpg
                const paddedIndex = i.toString().padStart(3, "0");
                img.src = `/Idli_sequence/ezgif-frame-${paddedIndex}.jpg`;

                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                }).catch((e) => console.error(`Failed to load frame ${i}`, e));

                loadedImages.push(img);
            }
            setImages(loadedImages);
            setIsLoading(false);
        };

        loadImages();
    }, []);

    // Handle Canvas Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && containerRef.current) {
                // Use the container dimensions to determine display size
                const { clientWidth, clientHeight } = containerRef.current;

                // High DPI scaling
                const dpr = window.devicePixelRatio || 1;

                // Set the physical resolution (buffer size)
                canvasRef.current.width = window.innerWidth * dpr;
                canvasRef.current.height = window.innerHeight * dpr;

                // Ensure the context knows we want high quality
                const ctx = canvasRef.current.getContext("2d");
                if (ctx) {
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = "high";
                }
            }
        };

        // Initial size
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Draw to canvas based on scroll
    useEffect(() => {
        let animationId: number;

        const render = () => {
            if (!canvasRef.current || images.length === 0) return;

            const ctx = canvasRef.current.getContext("2d");
            if (!ctx) return;

            // If not ready, force render frame 0.
            const progress = isScrollReady ? smoothProgress.get() : 0;

            // Map valid progress (0 to 1) to image index
            const frameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.floor(progress * FRAME_COUNT)
            );

            const img = images[frameIndex];
            if (img) {
                const canvasWidth = canvasRef.current.width;
                const canvasHeight = canvasRef.current.height;

                const canvasRatio = canvasWidth / canvasHeight;
                const imgRatio = img.width / img.height;
                let drawWidth, drawHeight;

                // "Cover" logic (opposite of contain)
                if (canvasRatio > imgRatio) {
                    // Canvas is wider than image (relative to height) -> Fit Width, Crop Height
                    drawWidth = canvasWidth;
                    drawHeight = drawWidth / imgRatio;
                } else {
                    // Canvas is taller than image (relative to width) -> Fit Height, Crop Width
                    drawHeight = canvasHeight;
                    drawWidth = drawHeight * imgRatio;
                }

                const x = (canvasWidth - drawWidth) / 2;
                const y = (canvasHeight - drawHeight) / 2;

                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                ctx.drawImage(img, x, y, drawWidth, drawHeight);
            }

            animationId = requestAnimationFrame(render);
        };

        animationId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationId);
    }, [images, smoothProgress, isScrollReady]);

    return (
        <div ref={containerRef} className={`relative w-full bg-[#F6F1E9]`} style={{ height: SCROLL_HEIGHT }}>
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F6F1E9]">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping" />
                </div>
            )}

            {/* Sticky Canvas Container */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain"
                    style={{ display: "block" }} // Removes annoying inline spacing
                />

                {/* Overlay Gradients to blend edges if needed, though canvas is transparent/bg matches */}
                {!isScrollReady && <div className="absolute inset-0 bg-[#F6F1E9] z-40" />}
            </div>

            <TextOverlays scrollProgress={smoothProgress} isReady={isScrollReady} />
        </div>
    );
}

function TextOverlays({ scrollProgress, isReady }: { scrollProgress: MotionValue<number>, isReady: boolean }) {
    // Brand Entry: 0% - 15%
    const opacity1 = useTransform(scrollProgress, [0, 0.1, 0.2], [1, 1, 0]);
    const scale1 = useTransform(scrollProgress, [0, 0.2], [1, 1.05]);

    // Food Awakens: 20% - 40%
    const opacity2 = useTransform(scrollProgress, [0.2, 0.25, 0.35, 0.4], [0, 1, 1, 0]);
    const y2 = useTransform(scrollProgress, [0.2, 0.4], [50, -50]);

    // Aroma Moment: 45% - 65%
    const opacity3 = useTransform(scrollProgress, [0.45, 0.5, 0.6, 0.65], [0, 1, 1, 0]);
    const y3 = useTransform(scrollProgress, [0.45, 0.65], [50, -50]);

    // Hero Dish: 70% - 90%
    const opacity4 = useTransform(scrollProgress, [0.7, 0.75, 0.85, 0.9], [0, 1, 1, 0]);
    const y4 = useTransform(scrollProgress, [0.7, 0.9], [50, -50]);

    // Final CTA: 90% - 100%
    const opacity5 = useTransform(scrollProgress, [0.9, 0.95, 1], [0, 1, 1]);
    const y5 = useTransform(scrollProgress, [0.9, 1], [50, 0]);

    // If we're not ready, hide everything or just show static initial state?
    // Safer to hide overlay until we are sure we are at 0, 
    // BUT we want the logo to be visible immediately as static.
    // Since motion values are reactive, if isReady is false, we can force a static view.

    if (!isReady) {
        // Show STATIC initial state only
        return (
            <div className="fixed inset-0 pointer-events-none flex flex-col justify-center items-center z-10 w-full h-full">
                <div className="absolute flex flex-col items-center justify-center text-center">
                    <div className="relative w-64 h-64 mb-4 drop-shadow-2xl">
                        <Image src="/logo_LI.png" alt="Little Idli" fill className="object-contain" priority />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-[#F6F1E9] tracking-tight mt-4 drop-shadow-lg">Little IDLI</h1>
                    <p className="text-lg md:text-2xl text-[#F6F1E9]/80 font-light mt-2 tracking-wide drop-shadow-md">Authentic South Indian Taste</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 pointer-events-none flex flex-col justify-center items-center z-10 w-full h-full">

            {/* 1. Brand Entry - Centered */}
            <motion.div style={{ opacity: opacity1, scale: scale1 }} className="absolute flex flex-col items-center justify-center text-center">
                <div className="relative w-64 h-64 mb-4 drop-shadow-2xl">
                    <Image src="/logo_LI.png" alt="Little Idli" fill className="object-contain" priority />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-[#F6F1E9] tracking-tight mt-4 drop-shadow-lg">Little IDLI</h1>
                <p className="text-lg md:text-2xl text-[#F6F1E9]/80 font-light mt-2 tracking-wide drop-shadow-md">Authentic South Indian Taste</p>
            </motion.div>

            {/* 2. Food Awakens - Left Aligned */}
            <motion.div
                style={{ opacity: opacity2, y: y2 }}
                className="absolute left-8 md:left-24 max-w-md text-left"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-[#F6F1E9] leading-tight drop-shadow-lg">Freshly Steamed.<br />Soft. Pure.</h2>
            </motion.div>

            {/* 3. Aroma Moment - Right Aligned */}
            <motion.div
                style={{ opacity: opacity3, y: y3 }}
                className="absolute right-8 md:right-24 max-w-md text-right"
            >
                <h2 className="text-4xl md:text-5xl font-bold text-[#F6F1E9] leading-tight drop-shadow-lg">Aroma That Feels<br />Like Home.</h2>
            </motion.div>

            {/* 4. Hero Dish - Centered */}
            <motion.div
                style={{ opacity: opacity4, y: y4 }}
                className="absolute text-center max-w-xl"
            >
                <h2 className="text-5xl md:text-6xl font-bold text-[#F6F1E9] text-center tracking-tight drop-shadow-lg">Crispy. Golden. Perfect.</h2>
            </motion.div>

            {/* 5. Final CTA - Centered */}
            <motion.div
                style={{ opacity: opacity5, y: y5 }}
                className="absolute text-center"
            >
                <h2 className="text-5xl md:text-7xl font-bold text-[#F6F1E9] mb-8 drop-shadow-lg">Come Hungry.<br />Leave Happy.</h2>
                <button className="px-10 py-4 bg-[#e85d04] text-white rounded-full text-xl font-bold shadow-2xl hover:bg-[#d94e00] hover:scale-105 transition-all duration-300 pointer-events-auto">
                    Order Now
                </button>
            </motion.div>

        </div>
    );
}
