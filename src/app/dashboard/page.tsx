'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
    Building2,
    Users,
    CheckCircle2,
    Clock,
    TrendingUp,
    AlertCircle,
    ShieldCheck,
} from 'lucide-react';

interface DashboardStats {
    total_tenants: number;
    total_employees: number;
    pending_enrollments: number;
    approved_enrollments: number;
    enrollment_rate: number;
}

export default function DashboardPage() {
    const user = useAuthStore((s) => s.user);

    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            return {
                total_tenants: 12,
                total_employees: 2847,
                pending_enrollments: 143,
                approved_enrollments: 2584,
                enrollment_rate: 90.8,
            } as DashboardStats;
        },
    });

    const statCards = [
        {
            title: 'Total Tenants',
            value: stats?.total_tenants ?? 0,
            icon: Building2,
            color: 'text-amber',
            bgColor: 'bg-amber/10',
            show: user?.role === 'broker',
        },
        {
            title: 'Total Employees',
            value: stats?.total_employees?.toLocaleString() ?? '0',
            icon: Users,
            color: 'text-amber',
            bgColor: 'bg-amber/10',
            show: true,
        },
        {
            title: 'Pending Enrollments',
            value: stats?.pending_enrollments ?? 0,
            icon: Clock,
            color: 'text-amber',
            bgColor: 'bg-amber/10',
            show: true,
        },
        {
            title: 'Approved',
            value: stats?.approved_enrollments?.toLocaleString() ?? '0',
            icon: CheckCircle2,
            color: 'text-amber',
            bgColor: 'bg-amber/10',
            show: true,
        },
    ].filter(card => card.show);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-amber" />
                    Welcome back, {user?.first_name}!
                </h1>
                <p className="text-navy/50 mt-1">
                    Here&apos;s an overview of your insurance portfolio
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="bg-white border-cream-dark">
                            <CardHeader className="pb-2">
                                <Skeleton className="h-4 w-24 bg-cream-dark" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16 bg-cream-dark" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    statCards.map((stat, i) => (
                        <Card
                            key={i}
                            className="bg-white border-cream-dark hover:border-amber/30 hover:shadow-md hover:shadow-amber/5 transition-all duration-300 group cursor-default"
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-navy/50">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-navy">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Enrollment Rate & Pending Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white border-cream-dark">
                    <CardHeader>
                        <CardTitle className="text-navy flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-amber" />
                            Enrollment Rate
                        </CardTitle>
                        <CardDescription className="text-navy/40">
                            Overall portfolio enrollment completion
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-4">
                            <span className="text-5xl font-bold text-navy">
                                {stats?.enrollment_rate ?? 0}%
                            </span>
                            <Badge className="bg-amber/15 text-amber-dark border-amber/25 mb-2">
                                +2.5% from last month
                            </Badge>
                        </div>
                        <div className="mt-4 h-3 rounded-full bg-cream-dark overflow-hidden">
                            <div
                                className="h-full glaze-gradient rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${stats?.enrollment_rate ?? 0}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-cream-dark">
                    <CardHeader>
                        <CardTitle className="text-navy flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber" />
                            Pending Actions
                        </CardTitle>
                        <CardDescription className="text-navy/40">
                            Items requiring your attention
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-amber/8 border border-amber/15 hover:bg-amber/12 transition-colors cursor-pointer">
                            <span className="text-navy text-sm">Enrollments to review</span>
                            <Badge className="bg-amber text-white font-semibold">{stats?.pending_enrollments ?? 0}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-cream-dark/50 border border-cream-dark hover:bg-cream-dark transition-colors cursor-pointer">
                            <span className="text-navy text-sm">Documents pending</span>
                            <Badge variant="secondary" className="bg-navy/10 text-navy/60">23</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-cream-dark/50 border border-cream-dark hover:bg-cream-dark transition-colors cursor-pointer">
                            <span className="text-navy text-sm">TPA sync issues</span>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">0</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
