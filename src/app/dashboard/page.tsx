'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    CheckCircle2,
    Clock,
    TrendingUp,
    AlertCircle,
    ShieldCheck,
    FileText,
    Heart,
    CalendarClock,
} from 'lucide-react';

interface ClientDashboardStats {
    covered_employees: number;
    active_policies: number;
    pending_enrollments: number;
    claims_this_month: number;
    enrollment_rate: number;
}

export default function DashboardPage() {
    const user = useAuthStore((s) => s.user);

    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            return {
                covered_employees: 423,
                active_policies: 3,
                pending_enrollments: 27,
                claims_this_month: 8,
                enrollment_rate: 94.2,
            } as ClientDashboardStats;
        },
    });

    const statCards = [
        {
            title: 'Covered Employees',
            value: stats?.covered_employees?.toLocaleString() ?? '0',
            icon: Users,
            color: 'text-amber',
            bgColor: 'bg-amber/10',
        },
        {
            title: 'Active Policies',
            value: stats?.active_policies ?? 0,
            icon: ShieldCheck,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-100',
        },
        {
            title: 'Pending Enrollments',
            value: stats?.pending_enrollments ?? 0,
            icon: Clock,
            color: 'text-amber',
            bgColor: 'bg-amber/10',
        },
        {
            title: 'Claims This Month',
            value: stats?.claims_this_month ?? 0,
            icon: FileText,
            color: 'text-navy',
            bgColor: 'bg-navy/10',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
                    <Heart className="w-6 h-6 text-amber" />
                    Welcome back, {user?.first_name}!
                </h1>
                <p className="text-navy/50 mt-1">
                    Here&apos;s a snapshot of your company&apos;s insurance coverage
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
                            Employee enrollment completion for your company
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-4">
                            <span className="text-5xl font-bold text-navy">
                                {stats?.enrollment_rate ?? 0}%
                            </span>
                            <Badge className="bg-amber/15 text-amber-dark border-amber/25 mb-2">
                                +1.8% from last month
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
                            Action Items
                        </CardTitle>
                        <CardDescription className="text-navy/40">
                            Items requiring your attention
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-amber/8 border border-amber/15 hover:bg-amber/12 transition-colors cursor-pointer">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber" />
                                <span className="text-navy text-sm">Employees pending enrollment</span>
                            </div>
                            <Badge className="bg-amber text-white font-semibold">{stats?.pending_enrollments ?? 0}</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-cream-dark/50 border border-cream-dark hover:bg-cream-dark transition-colors cursor-pointer">
                            <div className="flex items-center gap-2">
                                <CalendarClock className="w-4 h-4 text-navy/40" />
                                <span className="text-navy text-sm">Policy renewal due</span>
                            </div>
                            <Badge variant="secondary" className="bg-navy/10 text-navy/60">45 days</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-cream-dark/50 border border-cream-dark hover:bg-cream-dark transition-colors cursor-pointer">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span className="text-navy text-sm">Outstanding claims</span>
                            </div>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">{stats?.claims_this_month ?? 0}</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
