'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
    ShieldCheck,
    FileText,
    CheckCircle2,
    Rocket,
    IndianRupee,
    Search,
    Filter,
    ClipboardCheck,
    Eye,
    CalendarClock,
    Building2,
    ArrowUpRight,
    Sparkles,
} from 'lucide-react';

// ── Types ──
interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    gradient: string;
    iconBg: string;
    delay: number;
}

interface Policy {
    id: string;
    name: string;
    policyNumber: string;
    validTill: string;
    status: 'Confirmed' | 'Pending' | 'Draft';
    enrollmentDaysLeft: number;
    insurer: string;
    insurerLogo: string;
    type: 'sponsored' | 'voluntary';
    tpaProvider?: string;
    tpaLogo?: string;
}

// ── Summary Card Component ──
function SummaryCard({ title, value, icon: Icon, gradient, iconBg, delay }: SummaryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group cursor-default"
        >
            <div className={`relative overflow-hidden rounded-2xl p-5 ${gradient} shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                {/* Background decoration */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 blur-sm" />
                <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/5" />

                <div className="relative z-10 flex items-start justify-between">
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-white/80 tracking-wide">{title}</p>
                        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${iconBg} backdrop-blur-sm`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>

                {/* Subtle animated shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
        </motion.div>
    );
}

// ── Summary Card Skeleton ──
function SummaryCardSkeleton() {
    return (
        <div className="rounded-2xl p-5 bg-cream-dark/60 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-28 bg-cream-dark" />
                    <Skeleton className="h-8 w-20 bg-cream-dark" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl bg-cream-dark" />
            </div>
        </div>
    );
}

// ── Policy Card Component ──
function PolicyCard({ policy, delay, onEnroll, onPolicyDetails }: { policy: Policy; delay: number; onEnroll: (policy: Policy) => void; onPolicyDetails: (policy: Policy) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -3, scale: 1.01 }}
            className="group"
        >
            <div className="relative bg-white rounded-2xl border border-cream-dark overflow-hidden shadow-sm hover:shadow-lg hover:shadow-navy/5 hover:border-amber/30 transition-all duration-300">
                {/* Status Ribbon */}
                <div className="absolute top-0 right-0 z-10">
                    <div className={`
                        px-4 py-1.5 text-xs font-bold uppercase tracking-widest
                        rounded-bl-2xl shadow-md
                        ${policy.status === 'Confirmed'
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                            : policy.status === 'Pending'
                                ? 'bg-gradient-to-r from-amber to-amber-light text-white'
                                : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                        }
                    `}>
                        {policy.status}
                    </div>
                </div>

                {/* TPA Logo - positioned below ribbon */}
                {policy.tpaLogo && (
                    <img
                        src={policy.tpaLogo}
                        alt={`${policy.name} logo`}
                        className="absolute top-9 right-3 w-28 h-12 object-contain z-[5]"
                    />
                )}

                {/* Header */}
                <div className="p-5 pb-3 border-b border-cream-dark/80">
                    <div className="pr-24">
                        <h3 className="text-lg font-bold text-navy group-hover:text-navy-dark transition-colors">
                            {policy.name}
                        </h3>
                        <p className="text-xs font-mono text-navy/40 mt-1">{policy.policyNumber}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <CalendarClock className="w-3.5 h-3.5 text-amber" />
                        <span className="text-xs text-navy/50">Valid till</span>
                        <Badge className="bg-amber/15 text-amber-dark border-amber/20 text-xs font-semibold px-2 py-0.5">
                            {policy.validTill}
                        </Badge>
                    </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    {/* Buttons */}
                    <div className="flex gap-3">
                        <Button
                            size="sm"
                            className="flex-1 bg-navy hover:bg-navy-dark text-white font-semibold shadow-md shadow-navy/15 hover:shadow-lg hover:shadow-navy/20 transition-all duration-300 rounded-xl h-10"
                            onClick={() => {
                                if (policy.tpaProvider === 'medi_assist') {
                                    onEnroll(policy);
                                } else {
                                    toast.info('Enrollment form coming soon for this policy');
                                }
                            }}
                        >
                            <ClipboardCheck className="w-4 h-4 mr-2" />
                            Enroll
                            <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-cream-dark text-navy/60 hover:text-navy hover:bg-cream/50 hover:border-amber/30 transition-all duration-300 rounded-xl h-10"
                            onClick={() => onPolicyDetails(policy)}
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Policy Details
                        </Button>
                    </div>

                    {/* Enrollment Countdown */}
                    <div className="bg-gradient-to-r from-amber/8 to-amber/4 border border-amber/15 rounded-xl px-4 py-3 flex items-center gap-3">
                        <div className="p-2 bg-amber/15 rounded-lg">
                            <CalendarClock className="w-4 h-4 text-amber-dark" />
                        </div>
                        <p className="text-sm text-navy/60">
                            Enrollment period ends in{' '}
                            <span className="text-2xl font-bold text-amber-dark mx-1">
                                {policy.enrollmentDaysLeft}
                            </span>
                            days
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-cream/30 border-t border-cream-dark/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white border border-cream-dark flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-navy/40" />
                        </div>
                        <span className="text-xs font-medium text-navy/50">{policy.insurer}</span>
                    </div>
                    <Badge className={`
                        text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full
                        ${policy.type === 'sponsored'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }
                    `}>
                        {policy.type === 'sponsored' ? '✦ Sponsored' : '◆ Voluntary'}
                    </Badge>
                </div>
            </div>
        </motion.div>
    );
}

// ── Policy Card Skeleton ──
function PolicyCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden animate-pulse">
            <div className="p-5 pb-3 border-b border-cream-dark/80">
                <Skeleton className="h-6 w-48 bg-cream-dark" />
                <Skeleton className="h-3 w-32 bg-cream-dark mt-2" />
                <Skeleton className="h-5 w-40 bg-cream-dark mt-3" />
            </div>
            <div className="p-5 space-y-4">
                <div className="flex gap-3">
                    <Skeleton className="h-10 flex-1 rounded-xl bg-cream-dark" />
                    <Skeleton className="h-10 flex-1 rounded-xl bg-cream-dark" />
                </div>
                <Skeleton className="h-14 w-full rounded-xl bg-cream-dark" />
            </div>
            <div className="px-5 py-3 border-t border-cream-dark/60 flex justify-between">
                <Skeleton className="h-6 w-32 bg-cream-dark" />
                <Skeleton className="h-6 w-24 bg-cream-dark rounded-full" />
            </div>
        </div>
    );
}

// ── Demo Data ──
const summaryData: Omit<SummaryCardProps, 'delay'>[] = [
    {
        title: 'Available Policies',
        value: 5,
        icon: FileText,
        gradient: 'bg-gradient-to-br from-blue-500 to-blue-700',
        iconBg: 'bg-white/15',
    },
    {
        title: 'Enrolled Policies',
        value: 3,
        icon: CheckCircle2,
        gradient: 'bg-gradient-to-br from-amber to-amber-dark',
        iconBg: 'bg-white/15',
    },
    {
        title: 'In Drive Policies',
        value: 5,
        icon: Rocket,
        gradient: 'bg-gradient-to-br from-violet-500 to-violet-700',
        iconBg: 'bg-white/15',
    },
    {
        title: 'Total Premium',
        value: '₹59,000',
        icon: IndianRupee,
        gradient: 'bg-gradient-to-br from-rose-500 to-rose-700',
        iconBg: 'bg-white/15',
    },
];

const policiesData: Policy[] = [
    {
        id: '1',
        name: 'Medi Assist',
        policyNumber: 'POL-GMC-2025-001',
        validTill: '31 Mar 2026',
        status: 'Confirmed',
        enrollmentDaysLeft: 24,
        insurer: 'Medi Assist',
        insurerLogo: '/logos/icici.png',
        type: 'sponsored',
        tpaProvider: 'medi_assist',
        tpaLogo: '/logos/medi-assist-transparent.png',
    },
    {
        id: '2',
        name: 'GPA Premium 2025-26',
        policyNumber: 'POL-GPA-2025-002',
        validTill: '31 Mar 2026',
        status: 'Confirmed',
        enrollmentDaysLeft: 24,
        insurer: 'HDFC Ergo',
        insurerLogo: '/logos/hdfc.png',
        type: 'voluntary',
    },
    {
        id: '3',
        name: 'Super Top-Up Health',
        policyNumber: 'POL-STU-2025-003',
        validTill: '15 Jun 2026',
        status: 'Pending',
        enrollmentDaysLeft: 45,
        insurer: 'Star Health',
        insurerLogo: '/logos/star.png',
        type: 'voluntary',
    },
    {
        id: '4',
        name: 'Term Life Cover',
        policyNumber: 'POL-TLC-2025-004',
        validTill: '31 Dec 2025',
        status: 'Confirmed',
        enrollmentDaysLeft: 12,
        insurer: 'Max Life',
        insurerLogo: '/logos/max.png',
        type: 'sponsored',
    },
    {
        id: '5',
        name: 'Cyber Security Shield',
        policyNumber: 'POL-CSS-2025-005',
        validTill: '28 Feb 2026',
        status: 'Draft',
        enrollmentDaysLeft: 60,
        insurer: 'Bajaj Allianz',
        insurerLogo: '/logos/bajaj.png',
        type: 'voluntary',
    },
    {
        id: '6',
        name: 'D&O Liability Cover',
        policyNumber: 'POL-DNO-2025-006',
        validTill: '30 Sep 2026',
        status: 'Confirmed',
        enrollmentDaysLeft: 30,
        insurer: 'New India Assurance',
        insurerLogo: '/logos/newsindia.png',
        type: 'sponsored',
    },
];

// ── Main Dashboard Page ──
export default function DashboardPage() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'sponsored' | 'voluntary'>('all');
    const [isLoading] = useState(false);

    const handleEnrollClick = (policy: Policy) => {
        const params = new URLSearchParams({
            policy: policy.name,
            policyNumber: policy.policyNumber,
        });
        router.push(`/dashboard/enroll?${params.toString()}`);
    };

    const handlePolicyDetailsClick = (policy: Policy) => {
        const params = new URLSearchParams({
            policy: policy.name,
            policyNumber: policy.policyNumber,
        });
        router.push(`/dashboard/policy-details?${params.toString()}`);
    };

    const filteredPolicies = policiesData.filter((p) => {
        const matchSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.policyNumber.toLowerCase().includes(search.toLowerCase()) ||
            p.insurer.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || p.type === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="space-y-8">
            {/* ── Header ── */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber/15 rounded-xl">
                        <ShieldCheck className="w-6 h-6 text-amber" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-navy">
                            Welcome back, {user?.first_name}!
                        </h1>
                        <p className="text-navy/50 text-sm mt-0.5">
                            Here&apos;s an overview of your insurance portfolio
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* ── Summary Cards ── */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => <SummaryCardSkeleton key={i} />)
                    : summaryData.map((card, i) => (
                          <SummaryCard key={card.title} {...card} delay={i * 0.1} />
                      ))}
            </div>

            {/* ── Policy Section Header ── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-4"
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber" />
                        <h2 className="text-xl font-bold text-navy">Your Policies</h2>
                        <Badge className="bg-navy/10 text-navy text-xs ml-1">
                            {filteredPolicies.length}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
                            <Input
                                placeholder="Search policies..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 w-64 bg-white border-cream-dark focus:border-amber/40 focus:ring-amber/20 rounded-xl h-10"
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex items-center bg-white border border-cream-dark rounded-xl p-1">
                            <Filter className="w-4 h-4 text-navy/30 mx-2" />
                            {(['all', 'sponsored', 'voluntary'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`
                                        px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 capitalize
                                        ${filter === f
                                            ? 'bg-navy text-white shadow-sm'
                                            : 'text-navy/50 hover:text-navy hover:bg-cream/50'
                                        }
                                    `}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── Policy Cards Grid ── */}
            <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => <PolicyCardSkeleton key={i} />)
                    : filteredPolicies.length === 0
                        ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full flex flex-col items-center justify-center py-16 text-center"
                            >
                                <div className="p-4 bg-cream-dark/50 rounded-2xl mb-4">
                                    <Search className="w-8 h-8 text-navy/20" />
                                </div>
                                <p className="text-navy/40 font-medium">No policies found</p>
                                <p className="text-navy/25 text-sm mt-1">Try adjusting your search or filter</p>
                            </motion.div>
                        )
                        : filteredPolicies.map((policy, i) => (
                              <PolicyCard key={policy.id} policy={policy} delay={0.5 + i * 0.08} onEnroll={handleEnrollClick} onPolicyDetails={handlePolicyDetailsClick} />
                          ))}
            </div>
        </div>
    );
}
