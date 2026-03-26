'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { MediAssistForm } from '@/components/medi-assist-form';
import { toast } from 'sonner';
import { ChevronRight, ClipboardCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

// ── Loading Skeleton ──
function EnrollFormSkeleton() {
    return (
        <div className="space-y-0 animate-pulse">
            <div className="rounded-t-xl p-5 bg-cream-dark/60">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl bg-cream-dark" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-56 bg-cream-dark" />
                        <Skeleton className="h-3 w-40 bg-cream-dark" />
                    </div>
                </div>
            </div>
            <div className="bg-white border-x border-cream-dark p-5 space-y-4">
                <Skeleton className="h-6 w-32 bg-cream-dark" />
                <div className="border border-cream-dark rounded-lg p-4 space-y-3">
                    <Skeleton className="h-10 w-full bg-cream-dark" />
                    <Skeleton className="h-10 w-full bg-cream-dark" />
                </div>
            </div>
            <div className="bg-cream/50 border-x border-cream-dark p-5 space-y-4">
                <Skeleton className="h-5 w-40 bg-cream-dark" />
                <Skeleton className="h-32 w-full rounded-lg bg-cream-dark" />
            </div>
        </div>
    );
}

// ── Inner Content (uses useSearchParams) ──
function EnrollContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const policyName = searchParams.get('policy') || 'Insurance Policy';
    const policyNumber = searchParams.get('policyNumber') || '';

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
                <span className="text-navy font-medium">Enrollment</span>
            </motion.div>

            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber/15 rounded-xl">
                        <ClipboardCheck className="w-6 h-6 text-amber" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-navy">
                            Enrollment Form
                        </h1>
                        {policyName && (
                            <p className="text-sm text-navy/50 mt-0.5">
                                {policyName}
                                {policyNumber && (
                                    <span className="text-navy/30 mx-2">•</span>
                                )}
                                {policyNumber && (
                                    <span className="font-mono text-xs">{policyNumber}</span>
                                )}
                            </p>
                        )}
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

            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <MediAssistForm
                    onBack={() => router.push('/dashboard')}
                    onSubmitted={(submission) => {
                        toast.success(
                            `Enrollment submitted successfully! Reference: ${submission.referenceNumber}`,
                            { duration: 5000 }
                        );
                        router.push('/dashboard');
                    }}
                />
            </motion.div>
        </div>
    );
}

// ── Page Wrapper (Suspense boundary for useSearchParams) ──
export default function EnrollPage() {
    return (
        <Suspense fallback={<EnrollFormSkeleton />}>
            <EnrollContent />
        </Suspense>
    );
}
