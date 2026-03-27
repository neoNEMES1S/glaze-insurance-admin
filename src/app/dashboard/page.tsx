'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

import { SummaryCard, SummaryCardSkeleton } from '@/components/dashboard/summary-card';
import { PolicyCard, PolicyCardSkeleton, type PolicyData } from '@/components/dashboard/policy-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ShieldCheck,
    FileStack,
    ClipboardCheck,
    Activity,
    IndianRupee,
    Search,
    SlidersHorizontal,
    X,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    Building2,
    Users,
} from 'lucide-react';
import { toast } from 'sonner';

// ── Mock data ──────────────────────────────────────────────

const MOCK_POLICIES: PolicyData[] = [
    {
        id: '1',
        title: 'Medi Assist',
        policyNumber: 'POL-MA-2025-001',
        validity: '31 Mar 2026',
        status: 'Confirmed',
        enrollmentDaysLeft: 24,
        insurerName: 'Medi Assist',
        tag: 'Sponsored',
        sumInsured: '₹5,00,000',
        logoUrl: '/logos/medi-assist-transparent.png',
    },
    {
        id: '2',
        title: 'GPA Accident Cover',
        policyNumber: 'POL-GPA-2025-042',
        validity: '15 Jun 2026',
        status: 'Confirmed',
        enrollmentDaysLeft: 45,
        insurerName: 'HDFC ERGO',
        tag: 'Mandatory',
        sumInsured: '₹10,00,000',
    },
    {
        id: '3',
        title: 'Top-Up Health Plan',
        policyNumber: 'POL-TUP-2025-018',
        validity: '31 Mar 2026',
        status: 'Pending',
        enrollmentDaysLeft: 14,
        insurerName: 'Star Health',
        tag: 'Voluntary',
        sumInsured: '₹15,00,000',
    },
    {
        id: '4',
        title: 'Motor Fleet Insurance',
        policyNumber: 'POL-MFI-2025-007',
        validity: '30 Sep 2025',
        status: 'Confirmed',
        enrollmentDaysLeft: 0,
        insurerName: 'Bajaj Allianz',
        tag: 'Sponsored',
        sumInsured: '₹2,00,000',
    },
    {
        id: '5',
        title: 'D&O Liability Cover',
        policyNumber: 'POL-DNO-2025-003',
        validity: '31 Dec 2025',
        status: 'Draft',
        enrollmentDaysLeft: 60,
        insurerName: 'Tata AIG',
        tag: 'Sponsored',
        sumInsured: '₹1,00,00,000',
    },
    {
        id: '6',
        title: 'Workmen Compensation',
        policyNumber: 'POL-WMC-2025-009',
        validity: '31 Mar 2026',
        status: 'Expired',
        enrollmentDaysLeft: 0,
        insurerName: 'New India Assurance',
        tag: 'Mandatory',
    },
];

interface DashboardStats {
    available_policies: number;
    enrolled_policies: number;
    in_drive_policies: number;
    total_premium: number;
    total_tenants: number;
    total_employees: number;
    pending_enrollments: number;
    approved_enrollments: number;
    enrollment_rate: number;
}

// ── Component ──────────────────────────────────────────────

type FilterTag = 'All' | PolicyData['tag'] | PolicyData['status'];

export default function DashboardPage() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterTag>('All');

    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            return {
                available_policies: 5,
                enrolled_policies: 3,
                in_drive_policies: 5,
                total_premium: 59000,
                total_tenants: 12,
                total_employees: 2847,
                pending_enrollments: 143,
                approved_enrollments: 2584,
                enrollment_rate: 90.8,
            } as DashboardStats;
        },
    });

    const { data: policies, isLoading: policiesLoading } = useQuery({
        queryKey: ['policies'],
        queryFn: async () => MOCK_POLICIES,
    });

    const filteredPolicies = useMemo(() => {
        if (!policies) return [];
        return policies.filter((p) => {
            const matchesSearch =
                searchQuery === '' ||
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.insurerName.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter =
                activeFilter === 'All' ||
                p.tag === activeFilter ||
                p.status === activeFilter;

            return matchesSearch && matchesFilter;
        });
    }, [policies, searchQuery, activeFilter]);

    const filterTags: FilterTag[] = ['All', 'Sponsored', 'Voluntary', 'Mandatory', 'Confirmed', 'Pending'];

    const summaryCards = [
        {
            title: 'Available Policies',
            value: stats?.available_policies ?? 0,
            icon: FileStack,
            gradient: 'bg-gradient-to-br from-blue-600 to-blue-800',
            iconBg: 'bg-white/20',
        },
        {
            title: 'Enrolled Policies',
            value: stats?.enrolled_policies ?? 0,
            icon: ClipboardCheck,
            gradient: 'bg-gradient-to-br from-amber to-amber-dark',
            iconBg: 'bg-white/20',
        },
        {
            title: 'In Drive Policies',
            value: stats?.in_drive_policies ?? 0,
            icon: Activity,
            gradient: 'bg-gradient-to-br from-purple-600 to-purple-800',
            iconBg: 'bg-white/20',
        },
        {
            title: 'Total Premium',
            value: `₹${(stats?.total_premium ?? 0).toLocaleString('en-IN')}`,
            icon: IndianRupee,
            gradient: 'bg-gradient-to-br from-rose-500 to-rose-700',
            iconBg: 'bg-white/20',
        },
    ];

    return (
        <div className="space-y-6">
            {/* ── Header ─────────────────────────────────── */}
            <div>
                <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-amber" />
                    Welcome back, {user?.first_name || 'Admin'}!
                </h1>
                <p className="text-navy/50 mt-1">
                    Here&apos;s an overview of your insurance portfolio
                </p>
            </div>

            {/* ── Summary Cards ──────────────────────────── */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {isLoading
                    ? Array.from({ length: 4 }).map((_, i) => <SummaryCardSkeleton key={i} />)
                    : summaryCards.map((card, i) => (
                          <SummaryCard key={card.title} {...card} delay={i * 0.08} />
                      ))}
            </div>



            {/* ── Policy Section Header ──────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                <div>
                    <h2 className="text-xl font-bold text-navy">Your Policies</h2>
                    <p className="text-sm text-navy/40 mt-0.5">
                        {filteredPolicies.length} {filteredPolicies.length === 1 ? 'policy' : 'policies'} found
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
                        <Input
                            placeholder="Search policies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-8 w-64 bg-white border-cream-dark text-navy placeholder:text-navy/30 focus:border-amber/50 focus:ring-amber/20 rounded-xl h-10"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-navy/30 mr-1" />
                {filterTags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => setActiveFilter(tag)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                            activeFilter === tag
                                ? 'bg-navy text-white border-navy shadow-md shadow-navy/15'
                                : 'bg-white text-navy/60 border-cream-dark hover:border-amber/30 hover:text-navy'
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* ── Policy Grid ────────────────────────── */}
            <div className="grid gap-5 md:grid-cols-2">
                {policiesLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <PolicyCardSkeleton key={i} />)
                ) : filteredPolicies.length === 0 ? (
                    <div className="md:col-span-2 flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-cream-dark/60 flex items-center justify-center mb-4">
                            <Search className="w-7 h-7 text-navy/25" />
                        </div>
                        <p className="text-navy/50 font-medium">No policies match your search</p>
                        <p className="text-sm text-navy/30 mt-1">Try adjusting your filters or search terms</p>
                        <Button
                            size="sm"
                            variant="outline"
                            className="mt-4 border-cream-dark text-navy/50 hover:border-amber/30 rounded-xl"
                            onClick={() => {
                                setSearchQuery('');
                                setActiveFilter('All');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredPolicies.map((policy, i) => (
                            <PolicyCard
                                key={policy.id}
                                policy={policy}
                                delay={i * 0.06}
                                onEnroll={(id) => {
                                    if (policy.id === '1') {
                                        router.push('/dashboard/tpa-forms?tpa=medi_assist');
                                    } else {
                                        toast.info(`Opening enrollment for ${policy.title}`);
                                    }
                                }}
                                onViewDetails={(id) => router.push(`/dashboard/policy-details?policy=${encodeURIComponent(policy.title)}&policyNumber=${encodeURIComponent(policy.policyNumber)}`)}
                            />
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
