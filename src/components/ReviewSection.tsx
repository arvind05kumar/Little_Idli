"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const REVIEWS = [
    {
        name: "Aarav Patel",
        review: "The idlis are unbelievably soft, just like my grandmother makes. A true taste of home.",
        location: "Regular Customer"
    },
    {
        name: "Sarah Jenkins",
        review: "I never knew vegetarian food could be this flavorful. The Masala Dosa is a masterpiece!",
        location: "Food Blogger"
    },
    {
        name: "Rajesh Kumar",
        review: "Authentic vibes, perfect filter coffee, and the sambar has that genuine Chennai kick.",
        location: "Chef"
    }
];

export default function ReviewSection() {
    return (
        <section className="relative w-full py-32 px-6 md:px-12 text-white overflow-hidden">
            {/* Background with overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/review-bg.png"
                    alt="Restaurant Ambiance"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Loved by Locals</h2>
                    <div className="w-24 h-1 bg-[#e85d04] mx-auto rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {REVIEWS.map((review, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl relative"
                        >
                            <div className="absolute -top-6 left-8 text-6xl text-[#e85d04] font-serif opacity-80">"</div>
                            <p className="text-lg md:text-xl font-light leading-relaxed mb-6 pt-4 text-white/90">
                                {review.review}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center font-bold text-white">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{review.name}</h4>
                                    <span className="text-sm text-white/60 uppercase tracking-wider">{review.location}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
