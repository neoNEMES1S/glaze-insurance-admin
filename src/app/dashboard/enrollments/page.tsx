'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet } from 'lucide-react';

export default function EnrollmentsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
                    <FileSpreadsheet className="w-6 h-6 text-amber" /> Enrollments
                </h1>
                <p className="text-navy/50 mt-1">Track enrollment progress across clients</p>
            </div>
            <Card className="bg-white border-cream-dark">
                <CardHeader><CardTitle className="text-navy">Enrollment Overview</CardTitle></CardHeader>
                <CardContent className="text-navy/40"><p>Detailed enrollment tracking coming soon...</p></CardContent>
            </Card>
        </div>
    );
}
