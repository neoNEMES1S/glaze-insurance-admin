'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Building2, Plus, Search, Calendar, Users, MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';

interface Tenant {
    id: string; name: string; code: string; domain: string | null;
    is_active: boolean; enrollment_start_date: string | null;
    enrollment_end_date: string | null; employee_count?: number;
}

export default function TenantsPage() {
    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const { data: tenants, isLoading } = useQuery({
        queryKey: ['tenants'],
        queryFn: async () => {
            return [
                { id: '1', name: 'Acme Corporation', code: 'ACME', domain: 'acme.com', is_active: true, enrollment_start_date: '2024-01-01', enrollment_end_date: '2024-12-31', employee_count: 450 },
                { id: '2', name: 'TechStart Inc', code: 'TECH', domain: 'techstart.io', is_active: true, enrollment_start_date: '2024-02-01', enrollment_end_date: '2024-03-31', employee_count: 120 },
                { id: '3', name: 'Global Industries', code: 'GLOB', domain: 'global-ind.com', is_active: true, enrollment_start_date: null, enrollment_end_date: null, employee_count: 1250 },
                { id: '4', name: 'StartupXYZ', code: 'SXYZ', domain: 'startupxyz.co', is_active: false, enrollment_start_date: '2023-06-01', enrollment_end_date: '2023-07-31', employee_count: 35 },
            ] as Tenant[];
        },
    });

    const filteredTenants = tenants?.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.code.toLowerCase().includes(search.toLowerCase())
    );

    const isEnrollmentOpen = (tenant: Tenant) => {
        if (!tenant.enrollment_start_date || !tenant.enrollment_end_date) return false;
        const now = new Date();
        return now >= new Date(tenant.enrollment_start_date) && now <= new Date(tenant.enrollment_end_date);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-amber" />
                        Tenants
                    </h1>
                    <p className="text-navy/50 mt-1">Manage your client organizations</p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-navy hover:bg-navy-dark text-white shadow-md">
                            <Plus className="w-4 h-4 mr-2" /> Add Tenant
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-cream-dark">
                        <DialogHeader><DialogTitle className="text-navy">Create New Tenant</DialogTitle></DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label className="text-navy/70">Company Name</Label>
                                <Input placeholder="Acme Corporation" className="border-cream-dark" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-navy/70">Code</Label>
                                    <Input placeholder="ACME" className="border-cream-dark uppercase" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-navy/70">Domain</Label>
                                    <Input placeholder="acme.com" className="border-cream-dark" />
                                </div>
                            </div>
                            <Button className="w-full bg-navy hover:bg-navy-dark text-white">Create Tenant</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
                <Input placeholder="Search tenants..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 border-cream-dark" />
            </div>

            <Card className="bg-white border-cream-dark overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-cream-dark bg-cream/50 hover:bg-cream/50">
                            <TableHead className="text-navy/60 font-semibold">Company</TableHead>
                            <TableHead className="text-navy/60 font-semibold">Code</TableHead>
                            <TableHead className="text-navy/60 font-semibold">Employees</TableHead>
                            <TableHead className="text-navy/60 font-semibold">Enrollment Window</TableHead>
                            <TableHead className="text-navy/60 font-semibold">Status</TableHead>
                            <TableHead className="text-navy/60 font-semibold"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? Array.from({ length: 4 }).map((_, i) => (
                            <TableRow key={i} className="border-cream-dark">
                                <TableCell><Skeleton className="h-4 w-32 bg-cream-dark" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-16 bg-cream-dark" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-12 bg-cream-dark" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-40 bg-cream-dark" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-16 bg-cream-dark" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-8 bg-cream-dark" /></TableCell>
                            </TableRow>
                        )) : filteredTenants?.map((tenant) => (
                            <TableRow key={tenant.id} className="border-cream-dark hover:bg-cream/30 transition-colors">
                                <TableCell>
                                    <p className="font-medium text-navy">{tenant.name}</p>
                                    {tenant.domain && <p className="text-xs text-navy/40">{tenant.domain}</p>}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-navy border-navy/20 font-mono text-xs">{tenant.code}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-navy/70">
                                        <Users className="w-4 h-4 text-navy/40" />
                                        {tenant.employee_count?.toLocaleString()}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {tenant.enrollment_start_date ? (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-navy/40" />
                                            <span className="text-sm text-navy/70">
                                                {format(new Date(tenant.enrollment_start_date), 'MMM d')} - {format(new Date(tenant.enrollment_end_date!), 'MMM d, yyyy')}
                                            </span>
                                            {isEnrollmentOpen(tenant) && (
                                                <Badge className="bg-emerald-100 text-emerald-700 text-xs">Open</Badge>
                                            )}
                                        </div>
                                    ) : <span className="text-sm text-navy/30">Not configured</span>}
                                </TableCell>
                                <TableCell>
                                    <Badge className={tenant.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}>
                                        {tenant.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" className="text-navy/40 hover:text-navy">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
