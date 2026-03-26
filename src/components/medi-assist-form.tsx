'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
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
    UserPlus, ShieldCheck, CheckCircle2,
    Send, Plus, Trash2, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

// ── Types ────────────────────────────────────────────────────────
export interface Beneficiary {
    id: string; name: string; relation: string; birthDate: string;
    age: number; gender: string; actionAllowed: boolean;
}
interface AddBeneficiaryForm { name: string; relation: string; birthDate: string; gender: string; }

export type WorkflowStep = 'submitted' | 'under_review' | 'sent_to_tpa' | 'tpa_processing' | 'approved' | 'rejected';

export interface Submission {
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

// ── Helper ───────────────────────────────────────────────────────
function generateReferenceNumber() {
    const num = String(Math.floor(Math.random() * 90000) + 10000);
    return `GLZ-MA-2026-${num}`;
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

// ── Medi Assist Form (Shared Component) ──────────────────────────
export function MediAssistForm({ onBack, onSubmitted }: { onBack: () => void; onSubmitted: (sub: Submission) => void }) {
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
                <Button variant="outline" className="border-cream-dark text-navy/50 hover:text-navy w-full sm:w-auto" onClick={onBack} disabled={isSubmitting}>← Back</Button>
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
