'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    HelpCircle, Phone, Mail, MessageSquare, FileText,
    ChevronDown, ChevronUp, ExternalLink, Clock, ShieldCheck,
} from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: 'How do I enroll a new employee in the insurance plan?',
        answer: 'Navigate to "Enrollment Forms" in the sidebar, select your TPA provider (e.g., Medi Assist), and fill out the enrollment form with the employee\'s details and beneficiary information. Once submitted, the enrollment will go through the HR review → TPA processing → approval workflow.',
    },
    {
        question: 'What is the claim settlement process?',
        answer: 'For planned hospitalizations, always use the pre-authorization (cashless) route through the TPA. For reimbursement claims, submit the claim with all original bills within 30 days of discharge. The typical settlement timeline is 7-15 business days after document submission.',
    },
    {
        question: 'How do I add or remove a dependent from the policy?',
        answer: 'Go to "Enrollment Forms" and create a new enrollment for the employee with updated beneficiary details. For additions (marriage, newborn), submit within 30 days of the life event. For removals, contact your Glaze Insurance representative.',
    },
    {
        question: 'When is the enrollment window open?',
        answer: 'The annual enrollment window is typically open during January-March of each year. Mid-year enrollments are allowed for new joiners (within 30 days of their date of hire) and qualifying life events (marriage, childbirth, etc.).',
    },
    {
        question: 'What documents are needed for a reimbursement claim?',
        answer: 'You will need: (1) Duly signed claim form, (2) Original hospital discharge summary, (3) Original investigation reports, (4) Original pharmacy bills, (5) Original hospital bills, (6) Pre-authorization letter (if cashless was denied), and (7) FIR/MLC report (for accident cases).',
    },
    {
        question: 'How can I download E-cards for my team?',
        answer: 'E-cards are generated once the enrollment is approved by the TPA. You can download individual E-cards from the submission detail page under "Enrollment Forms → Submissions". Bulk E-card downloads will be available soon.',
    },
];

const contactCards = [
    {
        title: 'Glaze Insurance Support',
        description: 'Your dedicated insurance advisory team',
        icon: ShieldCheck,
        details: [
            { icon: Phone, label: 'Phone', value: '+91 11-4567-8900' },
            { icon: Mail, label: 'Email', value: 'support@glazeinsurance.in' },
            { icon: Clock, label: 'Hours', value: 'Mon-Fri, 9:00 AM – 6:00 PM IST' },
        ],
    },
    {
        title: 'Medi Assist Helpline',
        description: 'TPA partner — for claim & cashless queries',
        icon: HelpCircle,
        details: [
            { icon: Phone, label: 'Helpline', value: '1800-202-1800 (Toll Free)' },
            { icon: Mail, label: 'Email', value: 'corporate@mediassist.in' },
            { icon: Clock, label: 'Hours', value: '24/7 for emergencies' },
        ],
    },
];

export default function SupportPage() {
    const [openFAQ, setOpenFAQ] = useState<number | null>(0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-amber" />
                    Support & Help
                </h1>
                <p className="text-navy/50 mt-1">Get help with your insurance policies and claims</p>
            </div>

            {/* Quick Links */}
            <div className="grid gap-3 md:grid-cols-3">
                {[
                    { label: 'Policy Handbook', icon: FileText, desc: 'Coverage details & exclusions' },
                    { label: 'Claim Process Guide', icon: FileText, desc: 'Step-by-step claim process' },
                    { label: 'Network Hospitals', icon: ExternalLink, desc: 'Find cashless hospitals' },
                ].map((link) => (
                    <Card
                        key={link.label}
                        className="bg-white border-cream-dark hover:border-amber/30 hover:shadow-md hover:shadow-amber/5 transition-all duration-300 cursor-pointer group"
                    >
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber/10 group-hover:bg-amber/20 transition-colors">
                                <link.icon className="w-5 h-5 text-amber" />
                            </div>
                            <div>
                                <p className="font-medium text-navy text-sm">{link.label}</p>
                                <p className="text-xs text-navy/40">{link.desc}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* FAQs — takes 3 columns */}
                <div className="lg:col-span-3 space-y-4">
                    <h2 className="text-lg font-semibold text-navy">Frequently Asked Questions</h2>
                    <div className="space-y-2">
                        {faqs.map((faq, idx) => (
                            <Card
                                key={idx}
                                className={`bg-white border-cream-dark transition-all duration-200 ${openFAQ === idx ? 'border-amber/30 shadow-sm' : ''}`}
                            >
                                <button
                                    onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                                    className="w-full text-left p-4 flex items-center justify-between gap-3"
                                >
                                    <span className="font-medium text-navy text-sm">{faq.question}</span>
                                    {openFAQ === idx ? (
                                        <ChevronUp className="w-4 h-4 text-amber shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-navy/30 shrink-0" />
                                    )}
                                </button>
                                {openFAQ === idx && (
                                    <div className="px-4 pb-4 pt-0">
                                        <div className="border-t border-cream-dark pt-3">
                                            <p className="text-sm text-navy/60 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Contact Cards — takes 2 columns */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-navy">Contact</h2>
                    {contactCards.map((contact) => (
                        <Card key={contact.title} className="bg-white border-cream-dark">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-navy/8">
                                        <contact.icon className="w-5 h-5 text-navy" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-navy text-sm">{contact.title}</CardTitle>
                                        <CardDescription className="text-navy/40 text-xs">{contact.description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {contact.details.map((detail) => (
                                    <div key={detail.label} className="flex items-center gap-3">
                                        <detail.icon className="w-4 h-4 text-navy/30 shrink-0" />
                                        <div>
                                            <p className="text-xs text-navy/40">{detail.label}</p>
                                            <p className="text-sm text-navy">{detail.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}

                    {/* CTA */}
                    <Card className="bg-navy border-0">
                        <CardContent className="p-5 text-center space-y-3">
                            <MessageSquare className="w-8 h-8 text-amber mx-auto" />
                            <div>
                                <p className="text-white font-semibold text-sm">Need more help?</p>
                                <p className="text-white/50 text-xs mt-1">Our insurance advisors are here for you</p>
                            </div>
                            <Button className="bg-amber hover:bg-amber-dark text-white w-full">
                                <Mail className="w-4 h-4 mr-2" />
                                Contact Glaze Support
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
