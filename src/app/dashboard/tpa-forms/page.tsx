'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
    ClipboardList, UserPlus, ShieldCheck, ChevronRight, CheckCircle2,
    Send, Plus, Trash2, FileText, Download, Eye, Clock, ArrowRight,
    CheckCircle, AlertCircle, Loader2, Building2, Hash, Calendar,
    User, Copy, ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

// ── Types ────────────────────────────────────────────────────────
interface TPAProvider {
    id: string; name: string; logo: string;
    description: string; status: 'active' | 'coming_soon';
}

interface Beneficiary {
    id: string; name: string; relation: string; birthDate: string;
    age: number; gender: string; actionAllowed: boolean;
}
interface AddBeneficiaryForm { name: string; relation: string; birthDate: string; gender: string; }

type WorkflowStep = 'submitted' | 'under_review' | 'sent_to_tpa' | 'tpa_processing' | 'approved' | 'rejected';

interface Submission {
    id: string;
    referenceNumber: string;
    tpaName: string;
    tpaLogo: string;
    employeeName: string;
    employeeId: string;
    beneficiaryCount: number;
    submittedAt: string;
    currentStep: WorkflowStep;
    topUpPlan: string | null;
    opdOptIn: boolean;
    timeline: { step: WorkflowStep; label: string; timestamp: string | null; note?: string }[];
}

// ── TPA definitions ──────────────────────────────────────────────
const tpaProviders: TPAProvider[] = [
    { id: 'medi_assist', name: 'Medi Assist', logo: '🏥', description: 'India\'s leading health insurance TPA with 30+ years of experience', status: 'active' },
    { id: 'vidal_health', name: 'Vidal Health', logo: '💊', description: 'Comprehensive health insurance TPA services across India', status: 'coming_soon' },
    { id: 'paramount_health', name: 'Paramount Health', logo: '🩺', description: 'End-to-end health benefits administration', status: 'coming_soon' },
    { id: 'health_india', name: 'Health India TPA', logo: '🏨', description: 'Trusted health insurance administration services', status: 'coming_soon' },
];

// ── Mock previous submissions for demo ───────────────────────────
const mockSubmissions: Submission[] = [
    {
        id: 'sub_001',
        referenceNumber: 'GLZ-MA-2026-00142',
        tpaName: 'Medi Assist',
        tpaLogo: '🏥',
        employeeName: 'Rajesh Kumar',
        employeeId: 'EMP10201',
        beneficiaryCount: 4,
        submittedAt: '2026-02-20T10:30:00',
        currentStep: 'approved',
        topUpPlan: '₹5,00,000',
        opdOptIn: true,
        timeline: [
            { step: 'submitted', label: 'Form Submitted', timestamp: '2026-02-20T10:30:00' },
            { step: 'under_review', label: 'Under HR Review', timestamp: '2026-02-20T14:15:00', note: 'Verified by Sarah Admin' },
            { step: 'sent_to_tpa', label: 'Sent to Medi Assist', timestamp: '2026-02-21T09:00:00' },
            { step: 'tpa_processing', label: 'TPA Processing', timestamp: '2026-02-21T11:30:00', note: 'E-card generation in progress' },
            { step: 'approved', label: 'Enrollment Approved', timestamp: '2026-02-22T16:45:00', note: 'Policy ID: MA-GRP-2026-89421' },
        ],
    },
    {
        id: 'sub_002',
        referenceNumber: 'GLZ-MA-2026-00143',
        tpaName: 'Medi Assist',
        tpaLogo: '🏥',
        employeeName: 'Priya Sharma',
        employeeId: 'EMP10305',
        beneficiaryCount: 3,
        submittedAt: '2026-02-22T09:15:00',
        currentStep: 'sent_to_tpa',
        topUpPlan: null,
        opdOptIn: false,
        timeline: [
            { step: 'submitted', label: 'Form Submitted', timestamp: '2026-02-22T09:15:00' },
            { step: 'under_review', label: 'Under HR Review', timestamp: '2026-02-22T11:00:00', note: 'Verified by Sarah Admin' },
            { step: 'sent_to_tpa', label: 'Sent to Medi Assist', timestamp: '2026-02-23T10:30:00' },
            { step: 'tpa_processing', label: 'TPA Processing', timestamp: null },
            { step: 'approved', label: 'Enrollment Approved', timestamp: null },
        ],
    },
    {
        id: 'sub_003',
        referenceNumber: 'GLZ-MA-2026-00144',
        tpaName: 'Medi Assist',
        tpaLogo: '🏥',
        employeeName: 'Amit Patel',
        employeeId: 'EMP10402',
        beneficiaryCount: 2,
        submittedAt: '2026-02-23T16:45:00',
        currentStep: 'under_review',
        topUpPlan: '₹10,00,000',
        opdOptIn: true,
        timeline: [
            { step: 'submitted', label: 'Form Submitted', timestamp: '2026-02-23T16:45:00' },
            { step: 'under_review', label: 'Under HR Review', timestamp: '2026-02-24T09:00:00' },
            { step: 'sent_to_tpa', label: 'Sent to TPA', timestamp: null },
            { step: 'tpa_processing', label: 'TPA Processing', timestamp: null },
            { step: 'approved', label: 'Enrollment Approved', timestamp: null },
        ],
    },
];

// ── Helper functions ─────────────────────────────────────────────
function generateReferenceNumber() {
    const num = String(Math.floor(Math.random() * 90000) + 10000);
    return `GLZ-MA-2026-${num}`;
}

function formatDateTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        + ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function getStepStatus(step: WorkflowStep, currentStep: WorkflowStep) {
    const order: WorkflowStep[] = ['submitted', 'under_review', 'sent_to_tpa', 'tpa_processing', 'approved'];
    const stepIdx = order.indexOf(step);
    const currentIdx = order.indexOf(currentStep);
    if (currentStep === 'rejected') return step === 'submitted' ? 'completed' : step === 'under_review' ? 'rejected' : 'pending';
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'pending';
}

function getStatusBadge(step: WorkflowStep) {
    const map: Record<WorkflowStep, { label: string; className: string }> = {
        submitted: { label: 'Submitted', className: 'bg-blue-100 text-blue-700' },
        under_review: { label: 'Under Review', className: 'bg-amber/15 text-amber-dark' },
        sent_to_tpa: { label: 'Sent to TPA', className: 'bg-purple-100 text-purple-700' },
        tpa_processing: { label: 'Processing', className: 'bg-indigo-100 text-indigo-700' },
        approved: { label: 'Approved', className: 'bg-emerald-100 text-emerald-700' },
        rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
    };
    return map[step];
}

// ── Main Page ────────────────────────────────────────────────────
export default function TPAFormsPage() {
    const [selectedTPA, setSelectedTPA] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'new' | 'submissions'>('new');
    const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
    const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null);
    const [confirmationData, setConfirmationData] = useState<Submission | null>(null);

    const handleFormSubmitted = (newSub: Submission) => {
        setSubmissions(prev => [newSub, ...prev]);
        setSelectedTPA(null);
        setConfirmationData(newSub);
    };

    const tabs = [
        { id: 'new' as const, label: 'New Enrollment', icon: Plus, count: null },
        { id: 'submissions' as const, label: 'Submissions', icon: FileText, count: submissions.length },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
                        <ClipboardList className="w-6 h-6 text-amber" /> TPA Enrollment Forms
                    </h1>
                    <p className="text-navy/50 mt-1">Submit employee enrollments with TPA providers</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-cream-dark/50 p-1 rounded-lg w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setConfirmationData(null); setViewingSubmission(null); setSelectedTPA(null); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-white text-navy shadow-sm'
                            : 'text-navy/50 hover:text-navy/70'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {tab.count !== null && (
                            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-amber/15 text-amber-dark' : 'bg-navy/10 text-navy/40'}`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'new' && !confirmationData && (
                <>
                    {!selectedTPA ? (
                        <TPASelector onSelect={setSelectedTPA} />
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm">
                                <button onClick={() => setSelectedTPA(null)} className="text-amber hover:text-amber-dark transition-colors">TPA Providers</button>
                                <ChevronRight className="w-4 h-4 text-navy/30" />
                                <span className="text-navy/60">{tpaProviders.find(t => t.id === selectedTPA)?.name}</span>
                                <ChevronRight className="w-4 h-4 text-navy/30" />
                                <span className="text-navy font-medium">Enrollment Form</span>
                            </div>
                            {selectedTPA === 'medi_assist' && <MediAssistForm onBack={() => setSelectedTPA(null)} onSubmitted={handleFormSubmitted} />}
                        </div>
                    )}
                </>
            )}

            {activeTab === 'new' && confirmationData && (
                <SubmissionConfirmation
                    submission={confirmationData}
                    onViewTracker={() => { setActiveTab('submissions'); setViewingSubmission(confirmationData); setConfirmationData(null); }}
                    onNewEnrollment={() => setConfirmationData(null)}
                />
            )}

            {activeTab === 'submissions' && !viewingSubmission && (
                <SubmissionsList
                    submissions={submissions}
                    onView={setViewingSubmission}
                />
            )}

            {activeTab === 'submissions' && viewingSubmission && (
                <SubmissionDetail
                    submission={viewingSubmission}
                    onBack={() => setViewingSubmission(null)}
                />
            )}
        </div>
    );
}

// ── Post-Submission Confirmation Screen ──────────────────────────
function SubmissionConfirmation({ submission, onViewTracker, onNewEnrollment }: {
    submission: Submission;
    onViewTracker: () => void;
    onNewEnrollment: () => void;
}) {
    const copyRef = () => {
        navigator.clipboard.writeText(submission.referenceNumber);
        toast.success('Reference number copied!');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Success Animation */}
            <Card className="bg-white border-cream-dark overflow-hidden">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-b border-emerald-200/50 p-8 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500 flex items-center justify-center mb-4 animate-[scale-in_0.5s_ease-out]">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-navy">Enrollment Submitted Successfully!</h2>
                    <p className="text-navy/50 mt-2">Your form has been received and is now being processed</p>
                </div>

                <CardContent className="p-6 space-y-5">
                    {/* Reference Number */}
                    <div className="bg-cream/50 border border-cream-dark rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-navy/40 uppercase tracking-wider font-medium">Reference Number</p>
                                <p className="text-xl font-bold text-navy font-mono mt-1">{submission.referenceNumber}</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={copyRef} className="border-cream-dark text-navy/50 hover:text-navy">
                                <Copy className="w-4 h-4 mr-1.5" /> Copy
                            </Button>
                        </div>
                    </div>

                    {/* Summary Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-cream/30 rounded-lg">
                            <Building2 className="w-5 h-5 text-amber" />
                            <div>
                                <p className="text-xs text-navy/40">TPA Provider</p>
                                <p className="text-sm font-semibold text-navy">{submission.tpaName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-cream/30 rounded-lg">
                            <User className="w-5 h-5 text-amber" />
                            <div>
                                <p className="text-xs text-navy/40">Employee</p>
                                <p className="text-sm font-semibold text-navy">{submission.employeeName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-cream/30 rounded-lg">
                            <Hash className="w-5 h-5 text-amber" />
                            <div>
                                <p className="text-xs text-navy/40">Employee ID</p>
                                <p className="text-sm font-semibold text-navy">{submission.employeeId}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-cream/30 rounded-lg">
                            <Calendar className="w-5 h-5 text-amber" />
                            <div>
                                <p className="text-xs text-navy/40">Submitted</p>
                                <p className="text-sm font-semibold text-navy">{formatDateTime(submission.submittedAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="border border-amber/20 rounded-lg overflow-hidden">
                        <div className="px-4 py-3 bg-amber/10 border-b border-amber/20">
                            <p className="text-xs font-semibold text-amber-dark uppercase tracking-wider">What Happens Next</p>
                        </div>
                        <div className="p-4 space-y-3">
                            {[
                                { step: 1, text: 'Your HR team will review the enrollment details', time: 'Within 24 hours' },
                                { step: 2, text: 'Verified data will be forwarded to Medi Assist', time: '1-2 business days' },
                                { step: 3, text: 'TPA processes enrollment and generates E-cards', time: '3-5 business days' },
                                { step: 4, text: 'Employee receives confirmation and policy details', time: 'Via email' },
                            ].map((item) => (
                                <div key={item.step} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-navy">{item.step}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-navy">{item.text}</p>
                                        <p className="text-xs text-navy/40 mt-0.5">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <Button onClick={onViewTracker} className="flex-1 bg-navy hover:bg-navy-dark text-white">
                            <Eye className="w-4 h-4 mr-2" /> Track Submission
                        </Button>
                        <Button variant="outline" onClick={() => toast.success('PDF download will be available soon')} className="border-cream-dark text-navy/60 hover:text-navy">
                            <Download className="w-4 h-4 mr-2" /> Download PDF
                        </Button>
                        <Button variant="outline" onClick={onNewEnrollment} className="border-cream-dark text-navy/60 hover:text-navy">
                            <Plus className="w-4 h-4 mr-2" /> New
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// ── Submissions List ─────────────────────────────────────────────
function SubmissionsList({ submissions, onView }: {
    submissions: Submission[];
    onView: (sub: Submission) => void;
}) {
    return (
        <div className="space-y-4">
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total', count: submissions.length, icon: FileText, color: 'text-navy' },
                    { label: 'Approved', count: submissions.filter(s => s.currentStep === 'approved').length, icon: CheckCircle, color: 'text-emerald-600' },
                    { label: 'In Progress', count: submissions.filter(s => !['approved', 'rejected'].includes(s.currentStep)).length, icon: Loader2, color: 'text-amber' },
                    { label: 'Rejected', count: submissions.filter(s => s.currentStep === 'rejected').length, icon: AlertCircle, color: 'text-red-500' },
                ].map((stat) => (
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

            {/* Submissions Table */}
            <Card className="bg-white border-cream-dark">
                <div className="p-4 border-b border-cream-dark flex items-center justify-between">
                    <h3 className="font-semibold text-navy text-sm">All Submissions</h3>
                    <div className="flex items-center gap-2">
                        <Input placeholder="Search by reference..." className="h-8 w-56 border-cream-dark text-sm" />
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="border-cream-dark bg-cream/40 hover:bg-cream/40">
                            <TableHead className="text-navy/70 font-semibold text-xs">Reference</TableHead>
                            <TableHead className="text-navy/70 font-semibold text-xs">Employee</TableHead>
                            <TableHead className="text-navy/70 font-semibold text-xs">TPA</TableHead>
                            <TableHead className="text-navy/70 font-semibold text-xs">Beneficiaries</TableHead>
                            <TableHead className="text-navy/70 font-semibold text-xs">Submitted</TableHead>
                            <TableHead className="text-navy/70 font-semibold text-xs">Status</TableHead>
                            <TableHead className="text-navy/70 font-semibold text-xs text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submissions.map((sub) => {
                            const badge = getStatusBadge(sub.currentStep);
                            return (
                                <TableRow key={sub.id} className="border-cream-dark hover:bg-cream/20 cursor-pointer" onClick={() => onView(sub)}>
                                    <TableCell className="font-mono text-sm text-navy font-medium">{sub.referenceNumber}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="text-sm text-navy font-medium">{sub.employeeName}</p>
                                            <p className="text-xs text-navy/40">{sub.employeeId}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-1.5 text-sm text-navy">
                                            <span>{sub.tpaLogo}</span> {sub.tpaName}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-sm text-navy">{sub.beneficiaryCount}</TableCell>
                                    <TableCell className="text-sm text-navy/60">{formatDateTime(sub.submittedAt)}</TableCell>
                                    <TableCell>
                                        <Badge className={badge.className}>{badge.label}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="text-amber hover:text-amber-dark hover:bg-amber/10 h-7 px-2">
                                            <Eye className="w-3.5 h-3.5 mr-1" /> View
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

// ── Submission Detail with Timeline ──────────────────────────────
function SubmissionDetail({ submission, onBack }: {
    submission: Submission;
    onBack: () => void;
}) {
    const badge = getStatusBadge(submission.currentStep);

    return (
        <div className="space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                <button onClick={onBack} className="text-amber hover:text-amber-dark transition-colors">Submissions</button>
                <ChevronRight className="w-4 h-4 text-navy/30" />
                <span className="text-navy font-medium">{submission.referenceNumber}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left — Info + Actions */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Submission Info Card */}
                    <Card className="bg-white border-cream-dark">
                        <CardContent className="p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <Badge className={badge.className}>{badge.label}</Badge>
                                <span className="text-xs text-navy/30">{submission.id}</span>
                            </div>

                            <div className="space-y-3">
                                <InfoRow icon={Hash} label="Reference" value={submission.referenceNumber} mono />
                                <InfoRow icon={User} label="Employee" value={`${submission.employeeName} (${submission.employeeId})`} />
                                <InfoRow icon={Building2} label="TPA Provider" value={`${submission.tpaLogo} ${submission.tpaName}`} />
                                <InfoRow icon={Calendar} label="Submitted" value={formatDateTime(submission.submittedAt)} />
                                <InfoRow icon={UserPlus} label="Beneficiaries" value={String(submission.beneficiaryCount)} />
                                {submission.topUpPlan && <InfoRow icon={ShieldCheck} label="Top-up Plan" value={submission.topUpPlan} />}
                                <InfoRow icon={ClipboardList} label="OPD Cover" value={submission.opdOptIn ? 'Opted In' : 'Not Opted'} />
                            </div>

                            {/* Actions */}
                            <div className="pt-3 border-t border-cream-dark space-y-2">
                                <Button variant="outline" className="w-full justify-start border-cream-dark text-navy/60 hover:text-navy h-9" onClick={() => toast.success('PDF download will be available soon')}>
                                    <Download className="w-4 h-4 mr-2" /> Download Submission PDF
                                </Button>
                                <Button variant="outline" className="w-full justify-start border-cream-dark text-navy/60 hover:text-navy h-9" onClick={() => toast.success('E-card download will be available once approved')}>
                                    <ExternalLink className="w-4 h-4 mr-2" /> View E-Card
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right — Timeline */}
                <div className="lg:col-span-2">
                    <Card className="bg-white border-cream-dark">
                        <div className="p-5 border-b border-cream-dark">
                            <h3 className="font-semibold text-navy text-sm flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber" /> Enrollment Workflow
                            </h3>
                            <p className="text-xs text-navy/40 mt-1">Track the progress of this enrollment through each stage</p>
                        </div>
                        <CardContent className="p-5">
                            <div className="space-y-0">
                                {submission.timeline.map((item, idx) => {
                                    const status = getStepStatus(item.step, submission.currentStep);
                                    const isLast = idx === submission.timeline.length - 1;

                                    return (
                                        <div key={item.step} className="flex gap-4">
                                            {/* Vertical line + dot */}
                                            <div className="flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${status === 'completed'
                                                    ? 'bg-emerald-500 text-white'
                                                    : status === 'current'
                                                        ? 'bg-amber text-white ring-4 ring-amber/20'
                                                        : status === 'rejected'
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-cream-dark/60 text-navy/30'
                                                    }`}>
                                                    {status === 'completed' ? (
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    ) : status === 'current' ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : status === 'rejected' ? (
                                                        <AlertCircle className="w-5 h-5" />
                                                    ) : (
                                                        <Clock className="w-5 h-5" />
                                                    )}
                                                </div>
                                                {!isLast && (
                                                    <div className={`w-0.5 h-16 ${status === 'completed' ? 'bg-emerald-300' : 'bg-cream-dark'}`} />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className={`flex-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
                                                <div className="flex items-center gap-2">
                                                    <h4 className={`font-semibold text-sm ${status === 'pending' ? 'text-navy/30' : 'text-navy'}`}>{item.label}</h4>
                                                    {status === 'current' && (
                                                        <Badge className="bg-amber/15 text-amber-dark text-[10px] px-1.5 py-0">In Progress</Badge>
                                                    )}
                                                </div>
                                                {item.timestamp ? (
                                                    <p className="text-xs text-navy/40 mt-0.5">{formatDateTime(item.timestamp)}</p>
                                                ) : (
                                                    <p className="text-xs text-navy/20 mt-0.5 italic">Pending</p>
                                                )}
                                                {item.note && (
                                                    <div className="mt-2 px-3 py-2 bg-cream/50 border border-cream-dark rounded-md">
                                                        <p className="text-xs text-navy/60">{item.note}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Estimated completion */}
                            {submission.currentStep !== 'approved' && submission.currentStep !== 'rejected' && (
                                <div className="mt-6 p-4 bg-amber/5 border border-amber/20 rounded-lg flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-amber" />
                                    <div>
                                        <p className="text-sm font-medium text-navy">Estimated Completion</p>
                                        <p className="text-xs text-navy/50">5-7 business days from submission date</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// ── Info Row Component ───────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, mono }: { icon: React.ElementType; label: string; value: string; mono?: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-navy/30 shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-xs text-navy/40">{label}</p>
                <p className={`text-sm text-navy ${mono ? 'font-mono' : ''} truncate`}>{value}</p>
            </div>
        </div>
    );
}

// ── TPA Selector ─────────────────────────────────────────────────
function TPASelector({ onSelect }: { onSelect: (id: string) => void }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tpaProviders.map((tpa) => (
                <Card key={tpa.id}
                    className={`bg-white border-cream-dark transition-all duration-300 group ${tpa.status === 'active' ? 'cursor-pointer hover:border-amber/40 hover:shadow-lg hover:shadow-amber/10' : 'opacity-60 cursor-not-allowed'}`}
                    onClick={() => tpa.status === 'active' && onSelect(tpa.id)}>
                    <CardContent className="pt-6 text-center space-y-3">
                        <div className="text-4xl">{tpa.logo}</div>
                        <div>
                            <h3 className="font-semibold text-navy">{tpa.name}</h3>
                            <p className="text-xs text-navy/40 mt-1 leading-relaxed">{tpa.description}</p>
                        </div>
                        {tpa.status === 'active' ? (
                            <Badge className="bg-emerald-100 text-emerald-700"><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>
                        ) : (
                            <Badge className="bg-gray-100 text-gray-500">Coming Soon</Badge>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// ── Medi Assist Form ─────────────────────────────────────────────
function MediAssistForm({ onBack, onSubmitted }: { onBack: () => void; onSubmitted: (sub: Submission) => void }) {
    const [employeeId] = useState('TEST10341');
    const [dateOfHire] = useState('25 Jan 2022');
    const [gender, setGender] = useState('Male');
    const [email] = useState('TEST10341@DT.com');
    const [maritalStatus, setMaritalStatus] = useState('Married');
    const [marriageDate, setMarriageDate] = useState('');
    const [employeeName] = useState('Self Test');

    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
        { id: '1', name: 'Self Test', relation: 'Self', birthDate: '01 Aug 1992', age: 33, gender: 'Male', actionAllowed: false },
    ]);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newBeneficiary, setNewBeneficiary] = useState<AddBeneficiaryForm>({ name: '', relation: '', birthDate: '', gender: '' });
    const [voluntaryTopUp, setVoluntaryTopUp] = useState<'yes' | 'no'>('no');
    const topUpPlans = [
        { sumInsured: '₹3,00,000', premium: '₹3,540' },
        { sumInsured: '₹5,00,000', premium: '₹5,310' },
        { sumInsured: '₹10,00,000', premium: '₹8,260' },
    ];
    const [selectedTopUpPlan, setSelectedTopUpPlan] = useState<number | null>(null);
    const [opdOptIn, setOpdOptIn] = useState(false);
    const [declared, setDeclared] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const sumInsured = '300000';

    const handleAddBeneficiary = () => {
        if (!newBeneficiary.name || !newBeneficiary.relation || !newBeneficiary.birthDate || !newBeneficiary.gender) { toast.error('Please fill all beneficiary fields'); return; }
        const birthDate = new Date(newBeneficiary.birthDate);
        const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        const formatted = birthDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        setBeneficiaries(prev => [...prev, { id: String(Date.now()), name: newBeneficiary.name, relation: newBeneficiary.relation, birthDate: formatted, age, gender: newBeneficiary.gender, actionAllowed: true }]);
        setNewBeneficiary({ name: '', relation: '', birthDate: '', gender: '' });
        setIsAddDialogOpen(false);
        toast.success('Beneficiary added successfully');
    };

    const handleRemoveBeneficiary = (id: string) => { setBeneficiaries(prev => prev.filter(b => b.id !== id)); toast.success('Beneficiary removed'); };

    const handleSubmit = () => {
        if (!declared) { toast.error('Please accept the declaration before submitting'); return; }

        setIsSubmitting(true);

        // Simulate a 2-second submission delay
        setTimeout(() => {
            const now = new Date().toISOString();
            const refNum = generateReferenceNumber();
            const newSubmission: Submission = {
                id: `sub_${Date.now()}`,
                referenceNumber: refNum,
                tpaName: 'Medi Assist',
                tpaLogo: '🏥',
                employeeName,
                employeeId,
                beneficiaryCount: beneficiaries.length,
                submittedAt: now,
                currentStep: 'submitted',
                topUpPlan: voluntaryTopUp === 'yes' && selectedTopUpPlan !== null ? topUpPlans[selectedTopUpPlan].sumInsured : null,
                opdOptIn,
                timeline: [
                    { step: 'submitted', label: 'Form Submitted', timestamp: now },
                    { step: 'under_review', label: 'Under HR Review', timestamp: null },
                    { step: 'sent_to_tpa', label: 'Sent to Medi Assist', timestamp: null },
                    { step: 'tpa_processing', label: 'TPA Processing', timestamp: null },
                    { step: 'approved', label: 'Enrollment Approved', timestamp: null },
                ],
            };

            setIsSubmitting(false);
            onSubmitted(newSubmission);
        }, 2000);
    };

    return (
        <div className="space-y-0">
            {/* TPA Header Banner */}
            <div className="bg-navy border border-cream-dark rounded-t-xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl">🏥</div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Medi Assist — Enrollment Form</h2>
                        <p className="text-xs text-white/60">Health Insurance Enrollment • Group Policy</p>
                    </div>
                </div>
                <Badge className="bg-amber/20 text-amber-light border-amber/30 text-xs tracking-wide">
                    <ShieldCheck className="w-3 h-3 mr-1" /> LIVE FORM
                </Badge>
            </div>

            {/* Employee Name */}
            <div className="bg-white border-x border-cream-dark px-5 pt-5 pb-3">
                <h3 className="text-lg font-bold text-navy">{employeeName}</h3>
            </div>

            {/* Employee Details Grid */}
            <div className="bg-white border-x border-cream-dark px-5 pb-5">
                <div className="border border-cream-dark rounded-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-cream-dark">
                        <FormField label="Employee ID" value={employeeId} readOnly />
                        <FormField label="Date of Hire" value={dateOfHire} readOnly />
                        <FormFieldSelect label="Gender" value={gender} onChange={setGender} options={['Male', 'Female', 'Other']} />
                    </div>
                    <div className="border-t border-cream-dark" />
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-cream-dark">
                        <FormField label="Email" value={email} readOnly />
                        <FormFieldSelect label="Marital Status" value={maritalStatus} onChange={setMaritalStatus} options={['Single', 'Married', 'Divorced', 'Widowed']} />
                        <FormField label="Marriage Date" value={marriageDate} onChange={setMarriageDate} placeholder="date of marriage" type="date" />
                    </div>
                </div>
            </div>

            {/* Beneficiary Details */}
            <div className="bg-cream/50 border-x border-cream-dark px-2 sm:px-5 py-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <h4 className="font-bold text-navy text-sm">Beneficiary Details</h4>
                        <span className="text-sm text-navy/50">(Floater Sum Insured (INR): {Number(sumInsured).toLocaleString('en-IN')})</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-amber/40 text-amber hover:bg-amber/10 self-start sm:self-auto" onClick={() => setIsAddDialogOpen(true)}>
                        <UserPlus className="w-4 h-4 mr-1.5" /> Add
                    </Button>
                </div>
                <div className="border border-cream-dark rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-cream-dark bg-cream/80 hover:bg-cream/80">
                                <TableHead className="text-navy/70 font-semibold text-xs">Name</TableHead>
                                <TableHead className="text-navy/70 font-semibold text-xs">Relation</TableHead>
                                <TableHead className="text-navy/70 font-semibold text-xs">Birth Date</TableHead>
                                <TableHead className="text-navy/70 font-semibold text-xs">Age</TableHead>
                                <TableHead className="text-navy/70 font-semibold text-xs">Gender</TableHead>
                                <TableHead className="text-navy/70 font-semibold text-xs">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {beneficiaries.map((b) => (
                                <TableRow key={b.id} className="border-cream-dark bg-white hover:bg-cream/30">
                                    <TableCell className="text-navy text-sm">{b.name}</TableCell>
                                    <TableCell className="text-navy text-sm">{b.relation}</TableCell>
                                    <TableCell className="text-navy text-sm">{b.birthDate}</TableCell>
                                    <TableCell className="text-navy text-sm">{b.age}</TableCell>
                                    <TableCell className="text-navy text-sm">{b.gender}</TableCell>
                                    <TableCell>
                                        {b.actionAllowed ? (
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 h-7 px-2" onClick={() => handleRemoveBeneficiary(b.id)}>
                                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-navy/30 italic">No Action Allowed</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {beneficiaries.length === 0 && (
                                <TableRow className="border-cream-dark"><TableCell colSpan={6} className="text-center py-6 text-navy/30">No beneficiaries added yet</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Voluntary Top-up Cover */}
            <div className="bg-white border-x border-cream-dark px-5 py-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-bold text-navy text-sm">Voluntary Top-up Cover</h4>
                    <span className="text-xs text-navy/40">(Premium is inclusive of 18% GST)</span>
                </div>
                <div className="border border-cream-dark rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    <span className="text-sm text-navy/70">Do you want to enroll for the Voluntary Top Up Policy ?</span>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" name="topup" checked={voluntaryTopUp === 'yes'} onChange={() => setVoluntaryTopUp('yes')} className="w-4 h-4 accent-amber" />
                            <span className="text-sm text-navy/70 group-hover:text-navy transition-colors">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" name="topup" checked={voluntaryTopUp === 'no'} onChange={() => setVoluntaryTopUp('no')} className="w-4 h-4 accent-amber" />
                            <span className="text-sm text-navy/70 group-hover:text-navy transition-colors">No</span>
                        </label>
                    </div>
                </div>

                {voluntaryTopUp === 'yes' && (
                    <div className="border border-amber/20 rounded-lg overflow-hidden bg-amber/5">
                        <div className="px-4 py-2.5 bg-amber/10 border-b border-amber/20">
                            <span className="text-xs font-semibold text-amber-dark uppercase tracking-wider">Select Top-up Plan</span>
                        </div>
                        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {topUpPlans.map((plan, idx) => (
                                <label key={idx} className={`relative flex flex-col items-center gap-1 p-4 rounded-lg border cursor-pointer transition-all ${selectedTopUpPlan === idx ? 'border-amber bg-amber/10 shadow-md shadow-amber/10' : 'border-cream-dark bg-white hover:border-cream-dark/80'}`}>
                                    <input type="radio" name="topup_plan" checked={selectedTopUpPlan === idx} onChange={() => setSelectedTopUpPlan(idx)} className="sr-only" />
                                    <span className="text-lg font-bold text-navy">{plan.sumInsured}</span>
                                    <span className="text-xs text-navy/40">Sum Insured</span>
                                    <div className="mt-1 px-3 py-1 rounded-full bg-amber/15 text-amber-dark text-xs font-semibold">Premium: {plan.premium}</div>
                                    {selectedTopUpPlan === idx && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-amber" />}
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Voluntary OPD Cover */}
            <div className="bg-cream/50 border-x border-cream-dark px-5 py-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-bold text-navy text-sm">Voluntary OPD Cover</h4>
                    <span className="text-xs text-navy/40">(Premium is inclusive of 18% GST)</span>
                </div>
                <div className="border border-cream-dark rounded-lg p-4 bg-white">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" checked={opdOptIn} onChange={(e) => setOpdOptIn(e.target.checked)} className="w-4 h-4 mt-0.5 accent-amber rounded" />
                        <span className="text-sm text-navy/70 group-hover:text-navy transition-colors leading-relaxed">
                            I want to opt for OPD benefit for 10000 flat for all employees with premium of INR 2360.
                        </span>
                    </label>
                </div>
                <div className="px-1">
                    <p className="text-sm text-navy/50"><span className="font-semibold text-navy/70">Note : </span>OPD benefit coverage for all (self &amp; all dependent)</p>
                </div>
            </div>

            {/* Declaration */}
            <div className="bg-white border-x border-cream-dark px-5 py-5">
                <div className="border border-cream-dark rounded-lg p-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" checked={declared} onChange={(e) => setDeclared(e.target.checked)} className="w-4 h-4 mt-0.5 accent-amber rounded" />
                        <span className="text-sm text-navy/70 group-hover:text-navy transition-colors">I agree and declare that the information provided above is correct.</span>
                    </label>
                </div>
            </div>

            {/* Submit */}
            <div className="bg-cream/50 border border-t-0 border-cream-dark rounded-b-xl px-5 py-4 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
                <Button variant="outline" className="border-cream-dark text-navy/50 hover:text-navy w-full sm:w-auto" onClick={onBack} disabled={isSubmitting}>← Back to TPA List</Button>
                <Button
                    className={`px-6 font-semibold transition-all duration-300 w-full sm:w-auto ${declared && !isSubmitting ? 'bg-navy hover:bg-navy-dark text-white shadow-lg shadow-navy/15' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    disabled={!declared || isSubmitting}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                    ) : (
                        <><Send className="w-4 h-4 mr-2" /> Submit Enrollment</>
                    )}
                </Button>
            </div>

            {/* Add Beneficiary Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="bg-white border-cream-dark max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-navy flex items-center gap-2"><UserPlus className="w-5 h-5 text-amber" /> Add Beneficiary</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        <div className="space-y-2">
                            <Label className="text-navy/70 text-sm">Full Name</Label>
                            <Input placeholder="Enter full name" value={newBeneficiary.name} onChange={(e) => setNewBeneficiary(prev => ({ ...prev, name: e.target.value }))} className="border-cream-dark" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-navy/70 text-sm">Relation</Label>
                                <Select value={newBeneficiary.relation} onValueChange={(val: string) => setNewBeneficiary(prev => ({ ...prev, relation: val }))}>
                                    <SelectTrigger className="border-cream-dark"><SelectValue placeholder="Select relation" /></SelectTrigger>
                                    <SelectContent className="bg-white border-cream-dark">
                                        <SelectItem value="Spouse">Spouse</SelectItem><SelectItem value="Son">Son</SelectItem><SelectItem value="Daughter">Daughter</SelectItem>
                                        <SelectItem value="Father">Father</SelectItem><SelectItem value="Mother">Mother</SelectItem>
                                        <SelectItem value="Father-in-law">Father-in-law</SelectItem><SelectItem value="Mother-in-law">Mother-in-law</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-navy/70 text-sm">Gender</Label>
                                <Select value={newBeneficiary.gender} onValueChange={(val: string) => setNewBeneficiary(prev => ({ ...prev, gender: val }))}>
                                    <SelectTrigger className="border-cream-dark"><SelectValue placeholder="Select gender" /></SelectTrigger>
                                    <SelectContent className="bg-white border-cream-dark">
                                        <SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-navy/70 text-sm">Date of Birth</Label>
                            <Input type="date" value={newBeneficiary.birthDate} onChange={(e) => setNewBeneficiary(prev => ({ ...prev, birthDate: e.target.value }))} className="border-cream-dark" />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-cream-dark">Cancel</Button>
                        <Button onClick={handleAddBeneficiary} className="bg-navy hover:bg-navy-dark text-white"><Plus className="w-4 h-4 mr-1" /> Add Beneficiary</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ── Form Field Components ────────────────────────────────────────

function FormField({ label, value, readOnly = false, placeholder, type = 'text', onChange }: {
    label: string; value: string; readOnly?: boolean; placeholder?: string; type?: string; onChange?: (val: string) => void;
}) {
    return (
        <div className="flex items-center">
            <div className="w-[130px] shrink-0 px-4 py-3 bg-cream/60">
                <span className="text-xs text-navy/50 font-medium">{label}</span>
            </div>
            <div className="flex-1 px-3 py-3">
                {readOnly ? (
                    <span className="text-sm text-navy">{value}</span>
                ) : (
                    <Input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange?.(e.target.value)}
                        className="h-8 bg-transparent border-0 border-b border-cream-dark rounded-none text-sm text-navy placeholder:text-navy/30 focus:border-amber/50 focus:ring-0 px-0" />
                )}
            </div>
        </div>
    );
}

function FormFieldSelect({ label, value, onChange, options }: {
    label: string; value: string; onChange: (val: string) => void; options: string[];
}) {
    return (
        <div className="flex items-center">
            <div className="w-[130px] shrink-0 px-4 py-3 bg-cream/60">
                <span className="text-xs text-navy/50 font-medium">{label}</span>
            </div>
            <div className="flex-1 px-3 py-2">
                <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="h-8 bg-transparent border-0 border-b border-cream-dark rounded-none text-sm text-navy focus:ring-0 shadow-none px-0">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-cream-dark">
                        {options.map((opt) => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
