'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-amber" /> Analytics
                </h1>
                <p className="text-navy/50 mt-1">Portfolio-wide insights and reports</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white border-cream-dark">
                    <CardHeader><CardTitle className="text-navy">Enrollment Trends</CardTitle></CardHeader>
                    <CardContent className="h-64 flex items-center justify-center text-navy/30"><p>Charts coming soon...</p></CardContent>
                </Card>
                <Card className="bg-white border-cream-dark">
                    <CardHeader><CardTitle className="text-navy">Tenant Comparison</CardTitle></CardHeader>
                    <CardContent className="h-64 flex items-center justify-center text-navy/30"><p>Charts coming soon...</p></CardContent>
                </Card>
            </div>
        </div>
    );
}
