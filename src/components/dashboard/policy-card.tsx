'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    UserPlus,
    FileText,
    Clock,
    Calendar,
    Building2,
    ShieldCheck,
} from 'lucide-react';

export interface PolicyData {
    id: string;
    title: string;
    policyNumber: string;
    validity: string;
    status: 'Confirmed' | 'Pending' | 'Draft' | 'Expired';
    enrollmentDaysLeft: number;
    insurerName: string;
    insurerLogo?: string;
    tag: 'Sponsored' | 'Voluntary' | 'Mandatory';
    sumInsured?: string;
    logoUrl?: string;
}

interface PolicyCardProps {
    policy: PolicyData;
    delay?: number;
    onEnroll?: (id: string) => void;
    onViewDetails?: (id: string) => void;
}

const statusConfig: Record<PolicyData['status'], { bg: string; text: string; dot: string }> = {
    Confirmed: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    Pending: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
    Draft: { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400' },
    Expired: { bg: 'bg-red-50 border-red-200', text: 'text-red-600', dot: 'bg-red-500' },
};

const tagConfig: Record<PolicyData['tag'], { bg: string; text: string }> = {
    Sponsored: { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'text-blue-700' },
    Voluntary: { bg: 'bg-purple-50 text-purple-700 border-purple-200', text: 'text-purple-700' },
    Mandatory: { bg: 'bg-navy/8 text-navy border-navy/15', text: 'text-navy' },
};

export function PolicyCard({ policy, delay = 0, onEnroll, onViewDetails }: PolicyCardProps) {
    const defaultStatus = { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400' };
    const defaultTag = { bg: 'bg-slate-50 text-slate-600 border-slate-200', text: 'text-slate-600' };
    const statusStyle = statusConfig[policy.status] ?? defaultStatus;
    const tagStyle = tagConfig[policy.tag] ?? defaultTag;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay }}
            whileHover={{ y: -3 }}
            className="group relative bg-white rounded-2xl border border-cream-dark overflow-hidden shadow-sm hover:shadow-xl hover:shadow-navy/8 hover:border-amber/30 transition-all duration-300"
        >
            {/* Top-right: Status + Logo */}
            <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                <Badge
                    variant="outline"
                    className={`${statusStyle.bg} ${statusStyle.text} border px-3 py-1 text-xs font-semibold rounded-full`}
                >
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${statusStyle.dot}`} />
                    {policy.status}
                </Badge>
                {policy.logoUrl && (
                    <Image
                        src={policy.logoUrl}
                        alt={`${policy.title} logo`}
                        width={80}
                        height={28}
                        className="h-7 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                )}
            </div>

            {/* Top accent bar */}
            <div className="h-1 w-full glaze-gradient" />

            {/* Card Body */}
            <div className="p-5">
                {/* Policy Header */}
                <div className="pr-24 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-4 h-4 text-amber shrink-0" />
                        <h3 className="text-lg font-bold text-navy truncate">{policy.title}</h3>
                    </div>
                    <p className="text-xs text-navy/40 font-mono tracking-wide">
                        {policy.policyNumber}
                    </p>
                </div>

                {/* Info Row */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-amber" />
                        <span className="text-navy/60">Valid till:</span>
                        <span className="font-semibold text-amber-dark">{policy.validity}</span>
                    </div>
                    {policy.sumInsured && (
                        <div className="flex items-center gap-1.5 text-sm">
                            <span className="text-navy/40">|</span>
                            <span className="text-navy/60">Sum Insured:</span>
                            <span className="font-semibold text-navy">{policy.sumInsured}</span>
                        </div>
                    )}
                </div>

                {/* Enrollment Countdown */}
                {policy.enrollmentDaysLeft > 0 && (
                    <div className="flex items-center gap-2 bg-amber/8 border border-amber/15 rounded-xl px-3.5 py-2.5 mb-4">
                        <Clock className="w-4 h-4 text-amber shrink-0" />
                        <p className="text-sm text-navy/70">
                            Enrollment period ends in{' '}
                            <span className="font-bold text-amber-dark">{policy.enrollmentDaysLeft} days</span>
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mb-4">
                    <Button
                        size="sm"
                        onClick={() => onEnroll?.(policy.id)}
                        className="bg-navy hover:bg-navy-dark text-white shadow-md shadow-navy/15 hover:shadow-lg hover:shadow-navy/20 transition-all duration-300 rounded-xl px-5"
                    >
                        <UserPlus className="w-4 h-4 mr-1.5" />
                        Enroll
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails?.(policy.id)}
                        className="border-cream-dark text-navy/70 hover:bg-cream hover:text-navy hover:border-amber/30 transition-all duration-300 rounded-xl px-5"
                    >
                        <FileText className="w-4 h-4 mr-1.5" />
                        Policy Details
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-cream-dark bg-cream/30 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-navy/8 flex items-center justify-center">
                        <Building2 className="w-3.5 h-3.5 text-navy/60" />
                    </div>
                    <span className="text-xs text-navy/60 font-medium">{policy.insurerName}</span>
                </div>
                <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold uppercase tracking-wider border ${tagStyle.bg} rounded-full px-2.5 py-0.5`}
                >
                    {policy.tag}
                </Badge>
            </div>
        </motion.div>
    );
}

export function PolicyCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden shadow-sm animate-pulse">
            <div className="h-1 w-full bg-cream-dark" />
            <div className="p-5 space-y-4">
                <div className="space-y-2">
                    <div className="h-5 w-48 bg-cream-dark rounded" />
                    <div className="h-3 w-32 bg-cream-dark/60 rounded" />
                </div>
                <div className="flex gap-3">
                    <div className="h-4 w-28 bg-cream-dark rounded" />
                    <div className="h-4 w-28 bg-cream-dark rounded" />
                </div>
                <div className="h-10 w-full bg-cream-dark/40 rounded-xl" />
                <div className="flex gap-3">
                    <div className="h-9 w-24 bg-cream-dark rounded-xl" />
                    <div className="h-9 w-32 bg-cream-dark rounded-xl" />
                </div>
            </div>
            <div className="border-t border-cream-dark px-5 py-3 flex items-center justify-between">
                <div className="h-4 w-24 bg-cream-dark rounded" />
                <div className="h-5 w-16 bg-cream-dark rounded-full" />
            </div>
        </div>
    );
}
