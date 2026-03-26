'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    FileText, Search, CheckCircle2, Clock, XCircle,
    AlertCircle, IndianRupee, Eye, Loader2, Plus,
} from 'lucide-react';
import { toast } from 'sonner';

interface Claim {
    id: string;
    claimNumber: string;
    employeeName: string;
    employeeId: string;
    claimType: string;
    amount: string;
    submittedDate: string;
    status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'settled';
    hospital?: string;
}

const statusConfig: Record<string, { label: string; className: string; icon: React.ElementType }> = {
    submitted: { label: 'Submitted', className: 'bg-blue-100 text-blue-700', icon: FileText },
    under_review: { label: 'Under Review', className: 'bg-amber/15 text-amber-dark', icon: Clock },
    approved: { label: 'Approved', className: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-600', icon: XCircle },
    settled: { label: 'Settled', className: 'bg-purple-100 text-purple-700', icon: CheckCircle2 },
};

export default function ClaimsPage() {
    const [search, setSearch] = useState('');

    const { data: claims, isLoading } = useQuery({
        queryKey: ['claims'],
        queryFn: async () => {
            return [
                { id: '1', claimNumber: 'CLM-2026-00891', employeeName: 'Rajesh Kumar', employeeId: 'EMP10201', claimType: 'Hospitalization', amount: '₹1,45,000', submittedDate: '2026-03-10', status: 'under_review' as const, hospital: 'Apollo Hospital, Delhi' },
                { id: '2', claimNumber: 'CLM-2026-00887', employeeName: 'Priya Sharma', employeeId: 'EMP10305', claimType: 'OPD Reimbursement', amount: '₹3,200', submittedDate: '2026-03-08', status: 'approved' as const },
                { id: '3', claimNumber: 'CLM-2026-00879', employeeName: 'Amit Patel', employeeId: 'EMP10402', claimType: 'Hospitalization', amount: '₹2,80,000', submittedDate: '2026-03-05', status: 'settled' as const, hospital: 'Fortis Hospital, Mumbai' },
                { id: '4', claimNumber: 'CLM-2026-00865', employeeName: 'Sneha Gupta', employeeId: 'EMP10187', claimType: 'Pre-auth', amount: '₹75,000', submittedDate: '2026-03-01', status: 'approved' as const, hospital: 'Max Hospital, Gurugram' },
                { id: '5', claimNumber: 'CLM-2026-00852', employeeName: 'Vikram Singh', employeeId: 'EMP10098', claimType: 'OPD Reimbursement', amount: '₹5,800', submittedDate: '2026-02-25', status: 'rejected' as const },
                { id: '6', claimNumber: 'CLM-2026-00840', employeeName: 'Ananya Das', employeeId: 'EMP10456', claimType: 'Hospitalization', amount: '₹1,90,000', submittedDate: '2026-02-20', status: 'settled' as const, hospital: 'Narayana Health, Bangalore' },
            ] as Claim[];
        },
    });

    const filteredClaims = claims?.filter(c =>
        c.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        c.claimNumber.toLowerCase().includes(search.toLowerCase()) ||
        c.employeeId.toLowerCase().includes(search.toLowerCase())
    );

    const statItems = [
        { label: 'Total Claims', count: claims?.length ?? 0, icon: FileText, color: 'text-navy' },
        { label: 'Approved', count: claims?.filter(c => c.status === 'approved').length ?? 0, icon: CheckCircle2, color: 'text-emerald-600' },
        { label: 'Under Review', count: claims?.filter(c => c.status === 'under_review').length ?? 0, icon: Loader2, color: 'text-amber' },
        { label: 'Settled', count: claims?.filter(c => c.status === 'settled').length ?? 0, icon: CheckCircle2, color: 'text-purple-600' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
                        <FileText className="w-6 h-6 text-amber" />
                        Claims
                    </h1>
                    <p className="text-navy/50 mt-1">Track and manage insurance claims for your team</p>
                </div>
                <Button className="bg-navy hover:bg-navy-dark text-white shadow-md" onClick={() => toast.info('Claim submission portal opening soon')}>
                    <Plus className="w-4 h-4 mr-2" /> New Claim
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statItems.map((stat) => (
                    <Card key={stat.label} className="bg-white border-cream-dark">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-cream/60 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-navy">{stat.count}</p>
                                <p className="text-xs text-navy/40">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
                <Input
                    placeholder="Search claims..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 border-cream-dark"
                />
            </div>

            {/* Claims Table */}
            <Card className="bg-white border-cream-dark overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-cream-dark bg-cream/50 hover:bg-cream/50">
                            <TableHead className="text-navy/60 font-semibold">Claim #</TableHead>
                            <TableHead className="text-navy/60 font-semibold">Employee</TableHead>
                            <TableHead className="text-navy/60 font-semibold">Type</TableHead>
                            <TableHead className="text-navy/60 font-semibold">Amount</TableHead>
                            <TableHead className="text-navy/60 font-semibold">Submitted</TableHead>
                            <TableHead className="text-navy/60 font-semibold">Status</TableHead>
                            <TableHead className="text-navy/60 font-semibold"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i} className="border-cream-dark">
                                <TableCell><Skeleton className="h-4 w-28 bg-cream-dark" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32 bg-cream-dark" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24 bg-cream-dark" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20 bg-cream-dark" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24 bg-cream-dark" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20 bg-cream-dark" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-8 bg-cream-dark" /></TableCell>
                            </TableRow>
                        )) : filteredClaims?.length === 0 ? (
                            <TableRow className="border-cream-dark">
                                <TableCell colSpan={7} className="text-center py-8 text-navy/30">No claims found</TableCell>
                            </TableRow>
                        ) : filteredClaims?.map((claim) => {
                            const config = statusConfig[claim.status];
                            return (
                                <TableRow key={claim.id} className="border-cream-dark hover:bg-cream/30 transition-colors">
                                    <TableCell>
                                        <span className="font-mono text-sm font-medium text-navy">{claim.claimNumber}</span>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium text-navy">{claim.employeeName}</p>
                                        <p className="text-xs text-navy/40">{claim.employeeId}</p>
                                    </TableCell>
                                    <TableCell className="text-navy/70 text-sm">{claim.claimType}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-navy font-medium text-sm">
                                            <IndianRupee className="w-3.5 h-3.5 text-navy/40" />
                                            {claim.amount.replace('₹', '')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-navy/60 text-sm">
                                        {new Date(claim.submittedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={config.className}>
                                            <config.icon className="w-3 h-3 mr-1" />{config.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" className="text-navy/40 hover:text-navy">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
