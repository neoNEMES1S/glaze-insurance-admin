'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Plus } from 'lucide-react';

export default function WellnessPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
                        <Heart className="w-6 h-6 text-amber" /> Wellness CMS
                    </h1>
                    <p className="text-navy/50 mt-1">Manage health content for employees</p>
                </div>
                <Button className="bg-navy hover:bg-navy-dark text-white shadow-md">
                    <Plus className="w-4 h-4 mr-2" /> New Article
                </Button>
            </div>
            <Card className="bg-white border-cream-dark">
                <CardHeader><CardTitle className="text-navy">Content Management</CardTitle></CardHeader>
                <CardContent className="text-navy/40"><p>Article management coming soon...</p></CardContent>
            </Card>
        </div>
    );
}
