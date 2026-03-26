'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Heart, Leaf, Activity, Apple, Moon } from 'lucide-react';

const wellnessResources = [
    { title: 'Managing Workplace Stress', category: 'Mental Health', icon: Leaf, description: 'Practical tips and techniques for managing stress in a corporate environment' },
    { title: 'Heart Health Essentials', category: 'Preventive Care', icon: Activity, description: 'Understanding cardiovascular health and when to get screenings' },
    { title: 'Nutrition at Your Desk', category: 'Nutrition', icon: Apple, description: 'Healthy eating habits for busy professionals' },
    { title: 'Better Sleep Guide', category: 'Sleep Health', icon: Moon, description: 'Improving sleep quality for better health and productivity' },
];

export default function WellnessPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
                    <Heart className="w-6 h-6 text-amber" /> Wellness
                </h1>
                <p className="text-navy/50 mt-1">Health & wellness resources for your team</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {wellnessResources.map((resource) => (
                    <Card key={resource.title} className="bg-white border-cream-dark hover:border-amber/30 hover:shadow-md hover:shadow-amber/5 transition-all duration-300 cursor-pointer group">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber/10 group-hover:bg-amber/20 transition-colors">
                                    <resource.icon className="w-5 h-5 text-amber" />
                                </div>
                                <div>
                                    <CardTitle className="text-navy text-sm">{resource.title}</CardTitle>
                                    <CardDescription className="text-xs text-navy/40 mt-0.5">{resource.category}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-navy/60 leading-relaxed">{resource.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
