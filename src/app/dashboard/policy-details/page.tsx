'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
    ChevronRight,
    ArrowLeft,
    Shield,
    ClipboardCheck,
    Heart,
    FileCheck,
    FileText,
    FilePlus,
    CalendarCheck,
    Upload,
    Ban,
    CircleSlash,
    Building2,
    CalendarClock,
    Users,
    IndianRupee,
    ChevronDown,
} from 'lucide-react';

// ── Action Tile Data ──
interface ActionTile {
    id: string;
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
    available: boolean;
}

const actionTiles: ActionTile[] = [
    {
        id: 'enrollment',
        label: 'Enrollment',
        icon: ClipboardCheck,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'hover:border-blue-300',
        description: 'Manage employee enrollments',
        available: true,
    },
    {
        id: 'coverages',
        label: 'Coverages',
        icon: Heart,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'hover:border-amber-300',
        description: 'View coverage details & benefits',
        available: true,
    },
    {
        id: 'document_checklist',
        label: 'Document Checklist',
        icon: FileCheck,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'hover:border-emerald-300',
        description: 'Required documents for claims',
        available: true,
    },
    {
        id: 'claims',
        label: 'Claims',
        icon: FileText,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'hover:border-indigo-300',
        description: 'Track & manage claim requests',
        available: true,
    },
    {
        id: 'claim_form',
        label: 'Claim Form',
        icon: FilePlus,
        color: 'text-violet-600',
        bgColor: 'bg-violet-50',
        borderColor: 'hover:border-violet-300',
        description: 'Submit a new claim form',
        available: true,
    },
    {
        id: 'claim_intimation',
        label: 'Claim Intimation',
        icon: CalendarCheck,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'hover:border-orange-300',
        description: 'Intimate a planned hospitalization',
        available: true,
    },
    {
        id: 'document_submission',
        label: 'Document Submission',
        icon: Upload,
        color: 'text-sky-600',
        bgColor: 'bg-sky-50',
        borderColor: 'hover:border-sky-300',
        description: 'Upload supporting documents',
        available: true,
    },
    {
        id: 'standard_exclusions',
        label: 'Standard Exclusions',
        icon: Ban,
        color: 'text-rose-600',
        bgColor: 'bg-rose-50',
        borderColor: 'hover:border-rose-300',
        description: 'Items not covered under policy',
        available: true,
    },
    {
        id: 'non_payable_items',
        label: 'Non Payable Items',
        icon: CircleSlash,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'hover:border-red-300',
        description: 'Items excluded from reimbursement',
        available: true,
    },
];

// ── Demo policy info ──
const policyInfo = {
    name: 'GMC Base Policy',
    number: 'POL-GMC-2025-001',
    validTill: '31 Mar 2026',
    insurer: 'Medi Assist',
    sumInsured: '₹3,00,000',
    lives: 142,
    premium: '₹59,000',
    status: 'Active',
};

// ── Action Tile Component ──
function ActionTileCard({ tile, index, onClick }: { tile: ActionTile; index: number; onClick: () => void }) {
    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                group relative flex flex-col items-center justify-center gap-3 p-6
                bg-white rounded-2xl border-2 border-cream-dark/60
                shadow-sm hover:shadow-lg transition-all duration-300
                cursor-pointer min-h-[140px]
                ${tile.borderColor}
            `}
        >
            {/* Icon Container */}
            <div className={`
                p-4 rounded-2xl ${tile.bgColor}
                group-hover:scale-110 transition-transform duration-300
            `}>
                <tile.icon className={`w-7 h-7 ${tile.color}`} strokeWidth={1.8} />
            </div>

            {/* Label */}
            <span className="text-sm font-semibold text-navy text-center leading-tight">
                {tile.label}
            </span>

            {/* Hover shimmer */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
        </motion.button>
    );
}

// ── Loading Skeleton ──
function PolicyDetailsSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-5 w-48 bg-cream-dark" />
            <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-xl bg-cream-dark" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-56 bg-cream-dark" />
                    <Skeleton className="h-4 w-40 bg-cream-dark" />
                </div>
            </div>
            <Skeleton className="h-28 w-full rounded-2xl bg-cream-dark" />
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="h-36 rounded-2xl bg-cream-dark" />
                ))}
            </div>
        </div>
    );
}

// ── Inner Content ──
function PolicyDetailsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const policyName = searchParams.get('policy') || policyInfo.name;
    const policyNumber = searchParams.get('policyNumber') || policyInfo.number;

    const handleTileClick = (tile: ActionTile) => {
        if (tile.id === 'enrollment') {
            router.push(`/dashboard/enroll?policy=${encodeURIComponent(policyName)}&policyNumber=${encodeURIComponent(policyNumber)}`);
        } else {
            toast.info(`${tile.label} — Coming soon`, {
                description: tile.description,
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 text-sm"
            >
                <button
                    onClick={() => router.push('/dashboard')}
                    className="text-amber hover:text-amber-dark transition-colors font-medium"
                >
                    Dashboard
                </button>
                <ChevronRight className="w-4 h-4 text-navy/30" />
                <span className="text-navy font-medium">Policy Details</span>
            </motion.div>

            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-navy/10 rounded-xl">
                        <Shield className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-navy">{policyName}</h1>
                        <p className="text-sm text-navy/50 mt-0.5">
                            <span className="font-mono text-xs">{policyNumber}</span>
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/dashboard')}
                    className="border-cream-dark text-navy/50 hover:text-navy hover:border-amber/30 transition-all rounded-xl self-start sm:self-auto"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
            </motion.div>

            {/* Policy Info Banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-gradient-to-r from-navy via-navy-dark to-navy rounded-2xl p-5 relative overflow-hidden"
            >
                {/* Background decorations */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-sm" />
                <div className="absolute -bottom-6 left-1/3 w-24 h-24 rounded-full bg-amber/10 blur-md" />

                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Building2 className="w-4 h-4 text-white/80" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/50 uppercase tracking-wider">Insurer</p>
                            <p className="text-sm font-semibold text-white">{policyInfo.insurer}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <CalendarClock className="w-4 h-4 text-white/80" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/50 uppercase tracking-wider">Valid Till</p>
                            <p className="text-sm font-semibold text-amber-light">{policyInfo.validTill}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <IndianRupee className="w-4 h-4 text-white/80" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/50 uppercase tracking-wider">Sum Insured</p>
                            <p className="text-sm font-semibold text-white">{policyInfo.sumInsured}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Users className="w-4 h-4 text-white/80" />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/50 uppercase tracking-wider">Lives Covered</p>
                            <p className="text-sm font-semibold text-white">{policyInfo.lives}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Select Policy Dropdown (decorative) */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
            >
                <button className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl text-sm font-semibold shadow-md shadow-navy/15 hover:bg-navy-dark transition-colors">
                    Select Policy
                    <ChevronDown className="w-4 h-4" />
                </button>
            </motion.div>

            {/* Action Tiles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {actionTiles.map((tile, i) => (
                    <ActionTileCard
                        key={tile.id}
                        tile={tile}
                        index={i}
                        onClick={() => handleTileClick(tile)}
                    />
                ))}
            </div>
        </div>
    );
}

// ── Page Wrapper ──
export default function PolicyDetailsPage() {
    return (
        <Suspense fallback={<PolicyDetailsSkeleton />}>
            <PolicyDetailsContent />
        </Suspense>
    );
}
