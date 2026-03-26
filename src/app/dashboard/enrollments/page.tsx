'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    FileSpreadsheet, Users, CheckCircle2, Clock, AlertCircle,
    TrendingUp, Calendar, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface EnrollmentSummary {
    totalEmployees: number;
    enrolled: number;
    pending: number;
    notStarted: number;
    enrollmentRate: number;
    windowStart: string;
    windowEnd: string;
    isWindowOpen: boolean;
}

export default function EnrollmentsPage() {
    const { data: summary, isLoading } = useQuery({
        queryKey: ['enrollment-summary'],
        queryFn: async () => {
            return {
                totalEmployees: 450,
                enrolled: 423,
                pending: 12,
                notStarted: 15,
                enrollmentRate: 94.0,
                windowStart: '2026-01-15',
                windowEnd: '2026-03-31',
                isWindowOpen: true,
            } as EnrollmentSummary;
        },
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
                        <FileSpreadsheet className="w-6 h-6 text-amber" />
                        My Enrollments
                    </h1>
                    <p className="text-navy/50 mt-1">Track enrollment progress for your company</p>
                </div>
                <Link href="/dashboard/tpa-forms">
                    <Button className="bg-navy hover:bg-navy-dark text-white shadow-md">
                        <ArrowRight className="w-4 h-4 mr-2" /> Start New Enrollment
                    </Button>
                </Link>
            </div>

            {/* Enrollment Window Banner */}
            {summary?.isWindowOpen && (
                <Card className="bg-gradient-to-r from-amber/10 to-amber/5 border-amber/25">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber/20">
                                <Calendar className="w-5 h-5 text-amber-dark" />
                            </div>
                            <div>
                                <p className="font-semibold text-navy text-sm">Enrollment Window is Open</p>
                                <p className="text-xs text-navy/50">
                                    {new Date(summary.windowStart).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} — {new Date(summary.windowEnd).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700 self-start sm:self-auto">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Open
                        </Badge>
                    </CardContent>
                </Card>
            )}

            {/* Stats Grid */}
            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="bg-white border-cream-dark p-4">
                            <Skeleton className="h-8 w-16 bg-cream-dark mb-2" />
                            <Skeleton className="h-4 w-24 bg-cream-dark" />
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-4">
                    {[
                        { label: 'Total Employees', value: summary?.totalEmployees ?? 0, icon: Users, color: 'text-navy', bg: 'bg-navy/10' },
                        { label: 'Enrolled', value: summary?.enrolled ?? 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                        { label: 'Pending', value: summary?.pending ?? 0, icon: Clock, color: 'text-amber', bg: 'bg-amber/10' },
                        { label: 'Not Started', value: summary?.notStarted ?? 0, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' },
                    ].map((stat) => (
                        <Card key={stat.label} className="bg-white border-cream-dark">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-navy">{stat.value.toLocaleString()}</p>
                                    <p className="text-xs text-navy/40">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Enrollment Progress */}
            <Card className="bg-white border-cream-dark">
                <CardHeader>
                    <CardTitle className="text-navy flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-amber" />
                        Enrollment Progress
                    </CardTitle>
                    <CardDescription className="text-navy/40">
                        Overall enrollment completion for your company
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end gap-4 mb-4">
                        <span className="text-5xl font-bold text-navy">
                            {summary?.enrollmentRate ?? 0}%
                        </span>
                        <span className="text-sm text-navy/50 mb-2">
                            {summary?.enrolled ?? 0} of {summary?.totalEmployees ?? 0} employees enrolled
                        </span>
                    </div>
                    <div className="h-4 rounded-full bg-cream-dark overflow-hidden">
                        <div
                            className="h-full glaze-gradient rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${summary?.enrollmentRate ?? 0}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between mt-3 text-xs text-navy/40">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white border-cream-dark hover:border-amber/30 hover:shadow-md hover:shadow-amber/5 transition-all duration-300 cursor-pointer">
                    <Link href="/dashboard/tpa-forms">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-amber/10">
                                <FileSpreadsheet className="w-6 h-6 text-amber" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-navy">Submit New Enrollment</p>
                                <p className="text-xs text-navy/40 mt-0.5">Fill out TPA enrollment forms for your team</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-navy/30" />
                        </CardContent>
                    </Link>
                </Card>
                <Card className="bg-white border-cream-dark hover:border-amber/30 hover:shadow-md hover:shadow-amber/5 transition-all duration-300 cursor-pointer">
                    <Link href="/dashboard/employees">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-navy/8">
                                <Users className="w-6 h-6 text-navy" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-navy">View Team Members</p>
                                <p className="text-xs text-navy/40 mt-0.5">Check individual enrollment statuses</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-navy/30" />
                        </CardContent>
                    </Link>
                </Card>
            </div>
        </div>
    );
}
