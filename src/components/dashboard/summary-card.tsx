'use client';

import { type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    gradient: string;
    iconBg: string;
    delay?: number;
}

export function SummaryCard({ title, value, icon: Icon, gradient, iconBg, delay = 0 }: SummaryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-lg cursor-default ${gradient}`}
        >
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5" />

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
                    <p className="text-3xl font-bold tracking-tight">{value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${iconBg}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </div>
        </motion.div>
    );
}

export function SummaryCardSkeleton() {
    return (
        <div className="rounded-2xl p-5 bg-cream-dark/50 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="space-y-3">
                    <div className="h-4 w-24 rounded bg-cream-dark" />
                    <div className="h-8 w-16 rounded bg-cream-dark" />
                </div>
                <div className="h-10 w-10 rounded-xl bg-cream-dark" />
            </div>
        </div>
    );
}
