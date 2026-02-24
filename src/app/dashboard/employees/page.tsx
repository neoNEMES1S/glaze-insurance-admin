'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Users, Search, CheckCircle2, XCircle, Clock, FileText, Upload, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Employee {
    id: string; employee_id: string; first_name: string; last_name: string;
    email: string; state: 'draft' | 'submitted' | 'approved' | 'rejected'; submitted_at: string | null;
}

const stateConfig = {
    draft: { label: 'Draft', icon: FileText, className: 'bg-gray-100 text-gray-500' },
    submitted: { label: 'Pending Review', icon: Clock, className: 'bg-amber/15 text-amber-dark' },
    approved: { label: 'Approved', icon: CheckCircle2, className: 'bg-emerald-100 text-emerald-700' },
    rejected: { label: 'Rejected', icon: XCircle, className: 'bg-red-100 text-red-600' },
};

export default function EmployeesPage() {
    const [search, setSearch] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

    const { data: employees, isLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: async () => {
            return [
                { id: '1', employee_id: 'EMP001', first_name: 'John', last_name: 'Doe', email: 'john.doe@acme.com', state: 'submitted', submitted_at: '2024-02-08T10:30:00Z' },
                { id: '2', employee_id: 'EMP002', first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@acme.com', state: 'approved', submitted_at: '2024-02-05T14:20:00Z' },
                { id: '3', employee_id: 'EMP003', first_name: 'Bob', last_name: 'Wilson', email: 'bob.wilson@acme.com', state: 'submitted', submitted_at: '2024-02-09T09:15:00Z' },
                { id: '4', employee_id: 'EMP004', first_name: 'Alice', last_name: 'Johnson', email: 'alice.j@acme.com', state: 'draft', submitted_at: null },
                { id: '5', employee_id: 'EMP005', first_name: 'Charlie', last_name: 'Brown', email: 'charlie.b@acme.com', state: 'rejected', submitted_at: '2024-02-01T11:45:00Z' },
                { id: '6', employee_id: 'EMP006', first_name: 'Diana', last_name: 'Ross', email: 'diana.r@acme.com', state: 'submitted', submitted_at: '2024-02-09T16:00:00Z' },
            ] as Employee[];
        },
    });

    const handleAction = (employee: Employee, action: 'approve' | 'reject') => { setSelectedEmployee(employee); setActionType(action); };
    const confirmAction = () => {
        if (actionType === 'approve') toast.success(`Approved ${selectedEmployee?.first_name} ${selectedEmployee?.last_name}'s enrollment`);
        else toast.error(`Rejected ${selectedEmployee?.first_name} ${selectedEmployee?.last_name}'s enrollment`);
        setSelectedEmployee(null); setActionType(null);
    };

    const filterByState = (state: string | null) => {
        let filtered = employees || [];
        if (state) filtered = filtered.filter(e => e.state === state);
        if (search) filtered = filtered.filter(e => e.first_name.toLowerCase().includes(search.toLowerCase()) || e.last_name.toLowerCase().includes(search.toLowerCase()) || e.employee_id.toLowerCase().includes(search.toLowerCase()));
        return filtered;
    };

    const pendingCount = employees?.filter(e => e.state === 'submitted').length ?? 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
                        <Users className="w-6 h-6 text-amber" /> Employees
                    </h1>
                    <p className="text-navy/50 mt-1">Manage employee enrollments</p>
                </div>
                <Button className="bg-navy hover:bg-navy-dark text-white shadow-md">
                    <Upload className="w-4 h-4 mr-2" /> Import CSV
                </Button>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
                <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 border-cream-dark" />
            </div>

            <Tabs defaultValue="pending" className="space-y-4">
                <TabsList className="bg-white border border-cream-dark">
                    <TabsTrigger value="pending" className="data-[state=active]:bg-navy data-[state=active]:text-white">
                        Pending Review
                        {pendingCount > 0 && <Badge className="ml-2 bg-amber text-white">{pendingCount}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="all" className="data-[state=active]:bg-navy data-[state=active]:text-white">All Employees</TabsTrigger>
                    <TabsTrigger value="approved" className="data-[state=active]:bg-navy data-[state=active]:text-white">Approved</TabsTrigger>
                </TabsList>
                <TabsContent value="pending"><EmployeeTable employees={filterByState('submitted')} isLoading={isLoading} showActions onAction={handleAction} /></TabsContent>
                <TabsContent value="all"><EmployeeTable employees={filterByState(null)} isLoading={isLoading} showActions={false} onAction={handleAction} /></TabsContent>
                <TabsContent value="approved"><EmployeeTable employees={filterByState('approved')} isLoading={isLoading} showActions={false} onAction={handleAction} /></TabsContent>
            </Tabs>

            <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
                <DialogContent className="bg-white border-cream-dark">
                    <DialogHeader>
                        <DialogTitle className="text-navy">{actionType === 'approve' ? 'Approve Enrollment' : 'Reject Enrollment'}</DialogTitle>
                        <DialogDescription className="text-navy/50">
                            {actionType === 'approve'
                                ? `Are you sure you want to approve ${selectedEmployee?.first_name} ${selectedEmployee?.last_name}'s enrollment?`
                                : `Are you sure you want to reject ${selectedEmployee?.first_name} ${selectedEmployee?.last_name}'s enrollment?`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setSelectedEmployee(null)} className="border-cream-dark">Cancel</Button>
                        <Button onClick={confirmAction} className={actionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}>
                            {actionType === 'approve' ? 'Approve' : 'Reject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function EmployeeTable({ employees, isLoading, showActions, onAction }: { employees: Employee[]; isLoading: boolean; showActions: boolean; onAction: (e: Employee, action: 'approve' | 'reject') => void; }) {
    return (
        <Card className="bg-white border-cream-dark overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="border-cream-dark bg-cream/50 hover:bg-cream/50">
                        <TableHead className="text-navy/60 font-semibold">Employee</TableHead>
                        <TableHead className="text-navy/60 font-semibold">ID</TableHead>
                        <TableHead className="text-navy/60 font-semibold">Email</TableHead>
                        <TableHead className="text-navy/60 font-semibold">Status</TableHead>
                        <TableHead className="text-navy/60 font-semibold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i} className="border-cream-dark">
                            <TableCell><Skeleton className="h-4 w-32 bg-cream-dark" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20 bg-cream-dark" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-40 bg-cream-dark" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24 bg-cream-dark" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20 bg-cream-dark" /></TableCell>
                        </TableRow>
                    )) : employees.length === 0 ? (
                        <TableRow className="border-cream-dark">
                            <TableCell colSpan={5} className="text-center py-8 text-navy/30">No employees found</TableCell>
                        </TableRow>
                    ) : employees.map((employee) => {
                        const config = stateConfig[employee.state];
                        return (
                            <TableRow key={employee.id} className="border-cream-dark hover:bg-cream/30 transition-colors">
                                <TableCell><p className="font-medium text-navy">{employee.first_name} {employee.last_name}</p></TableCell>
                                <TableCell><Badge variant="outline" className="text-navy border-navy/20 font-mono text-xs">{employee.employee_id}</Badge></TableCell>
                                <TableCell className="text-navy/60">{employee.email}</TableCell>
                                <TableCell><Badge className={config.className}><config.icon className="w-3 h-3 mr-1" />{config.label}</Badge></TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="text-navy/40 hover:text-navy"><Eye className="w-4 h-4" /></Button>
                                        {showActions && (
                                            <>
                                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => onAction(employee, 'approve')}><CheckCircle2 className="w-4 h-4" /></Button>
                                                <Button size="sm" variant="destructive" onClick={() => onAction(employee, 'reject')}><XCircle className="w-4 h-4" /></Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Card>
    );
}
