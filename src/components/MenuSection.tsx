"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const MENU_ITEMS = [
    {
        title: "Steamed Idli",
        description: "Fluffy, fermented rice cakes served with coconut chutney and sambar.",
        image: "/menu-idli.png",
        price: "$8.99"
    },
    {
        title: "Masala Dosa",
        description: "Crispy golden crepe filled with spiced potato mash, served with trio of chutneys.",
        image: "/menu-dosa.png",
        price: "$12.99"
    },
    {
        title: "Medu Vada",
        description: "Crispy lentil doughnuts, golden fried and perfect for dipping in hot sambar.",
        image: "/menu-vada.png",
        price: "$9.99"
    }
];

export default function MenuSection() {
    return (
        <section className="relative w-full py-24 px-6 md:px-12 bg-[#F6F1E9] text-[#171717]">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-[#e85d04]">Our Classics</h2>
                    <p className="text-xl text-[#171717]/70 font-light max-w-2xl mx-auto">
                        Timeless recipes passed down through generations. Simple ingredients, complex flavors.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {MENU_ITEMS.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            className="group relative flex flex-col items-center"
                        >
                            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl shadow-xl mb-6">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                            </div>

                            <h3 className="text-2xl font-bold mb-2 group-hover:text-[#e85d04] transition-colors">{item.title}</h3>
                            <p className="text-center text-[#171717]/80 mb-3 px-4">{item.description}</p>
                            <span className="text-lg font-semibold text-[#e85d04]">{item.price}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
