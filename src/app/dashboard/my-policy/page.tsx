'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ShieldCheck, Calendar, Users, IndianRupee, Download,
    Building2, FileText, CheckCircle2, Clock,
} from 'lucide-react';

interface Policy {
    id: string;
    name: string;
    provider: string;
    providerLogo: string;
    type: string;
    sumInsured: string;
    premium: string;
    startDate: string;
    endDate: string;
    coveredMembers: number;
    status: 'active' | 'expiring_soon' | 'expired';
    policyNumber: string;
}

export default function MyPolicyPage() {
    const { data: policies, isLoading } = useQuery({
        queryKey: ['policies'],
        queryFn: async () => {
            return [
                {
                    id: '1',
                    name: 'Group Mediclaim Policy',
                    provider: 'Medi Assist (ICICI Lombard)',
                    providerLogo: '🏥',
                    type: 'Group Health Insurance',
                    sumInsured: '₹5,00,000',
                    premium: '₹12,450/employee/year',
                    startDate: '2026-01-01',
                    endDate: '2026-12-31',
                    coveredMembers: 423,
                    status: 'active' as const,
                    policyNumber: 'MA-GRP-2026-11042',
                },
                {
                    id: '2',
                    name: 'Group Personal Accident',
                    provider: 'Bajaj Allianz',
                    providerLogo: '🛡️',
                    type: 'Accidental Insurance',
                    sumInsured: '₹10,00,000',
                    premium: '₹1,200/employee/year',
                    startDate: '2026-01-01',
                    endDate: '2026-12-31',
                    coveredMembers: 450,
                    status: 'active' as const,
                    policyNumber: 'BA-GPA-2026-78215',
                },
                {
                    id: '3',
                    name: 'Group Term Life',
                    provider: 'HDFC Life',
                    providerLogo: '💚',
                    type: 'Life Insurance',
                    sumInsured: '₹25,00,000',
                    premium: '₹2,800/employee/year',
                    startDate: '2025-07-01',
                    endDate: '2026-06-30',
                    coveredMembers: 450,
                    status: 'expiring_soon' as const,
                    policyNumber: 'HL-GTL-2025-34201',
                },
            ] as Policy[];
        },
    });

    const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
        active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
        expiring_soon: { label: 'Expiring Soon', className: 'bg-amber/15 text-amber-dark', icon: Clock },
        expired: { label: 'Expired', className: 'bg-red-100 text-red-600', icon: Clock },
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-amber" />
                    My Policies
                </h1>
                <p className="text-navy/50 mt-1">View and manage your company&apos;s insurance policies</p>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-white border-cream-dark">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-navy">{policies?.filter(p => p.status === 'active').length ?? 0}</p>
                            <p className="text-xs text-navy/40">Active Policies</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-cream-dark">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber/10">
                            <Users className="w-5 h-5 text-amber" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-navy">450</p>
                            <p className="text-xs text-navy/40">Total Covered Members</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-cream-dark">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber/10">
                            <Clock className="w-5 h-5 text-amber" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-navy">{policies?.filter(p => p.status === 'expiring_soon').length ?? 0}</p>
                            <p className="text-xs text-navy/40">Expiring Soon</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Policy Cards */}
            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="bg-white border-cream-dark p-6">
                            <Skeleton className="h-6 w-48 bg-cream-dark mb-4" />
                            <Skeleton className="h-4 w-72 bg-cream-dark mb-2" />
                            <Skeleton className="h-4 w-56 bg-cream-dark" />
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {policies?.map((policy) => {
                        const status = statusConfig[policy.status] ?? { label: policy.status, className: 'bg-slate-100 text-slate-600', icon: Clock };
                        return (
                            <Card key={policy.id} className="bg-white border-cream-dark hover:border-amber/30 hover:shadow-md hover:shadow-amber/5 transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{policy.providerLogo}</span>
                                            <div>
                                                <CardTitle className="text-navy text-lg">{policy.name}</CardTitle>
                                                <CardDescription className="text-navy/40 mt-0.5">{policy.provider}</CardDescription>
                                            </div>
                                        </div>
                                        <Badge className={status.className}>
                                            <status.icon className="w-3 h-3 mr-1" />
                                            {status.label}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <DetailItem icon={FileText} label="Policy Number" value={policy.policyNumber} />
                                        <DetailItem icon={Building2} label="Coverage Type" value={policy.type} />
                                        <DetailItem icon={IndianRupee} label="Sum Insured" value={policy.sumInsured} />
                                        <DetailItem icon={Users} label="Covered Members" value={String(policy.coveredMembers)} />
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-cream-dark">
                                        <div className="flex items-center gap-2 text-sm text-navy/50">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {new Date(policy.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} — {new Date(policy.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <Button variant="outline" size="sm" className="border-cream-dark text-navy/60 hover:text-navy">
                                            <Download className="w-4 h-4 mr-1.5" />
                                            Download Policy
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
        <div className="flex items-start gap-2">
            <Icon className="w-4 h-4 text-navy/30 mt-0.5 shrink-0" />
            <div>
                <p className="text-xs text-navy/40">{label}</p>
                <p className="text-sm font-medium text-navy">{value}</p>
            </div>
        </div>
    );
}
