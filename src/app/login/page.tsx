'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, KeyRound, Mail } from 'lucide-react';
import Image from 'next/image';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((s) => s.login);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            await login(data.email, data.password);
            toast.success('Welcome back!');
            router.push('/dashboard');
        } catch (error) {
            toast.error('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cream">
            {/* Subtle pattern background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(12,35,64,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(12,35,64,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber/10 to-transparent blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-navy/8 to-transparent blur-3xl" />
            </div>

            {/* Login Card */}
            <Card className="w-full max-w-md mx-4 relative bg-white border-cream-dark shadow-xl shadow-navy/5">
                <CardHeader className="space-y-5 text-center pb-2">
                    <div className="mx-auto flex flex-col items-center gap-4">
                        <div className="w-20 h-20 relative rounded-2xl p-3 bg-navy flex items-center justify-center shadow-lg shadow-navy/20">
                            <Image
                                src="/glaze-logo.svg"
                                alt="Glaze Insurance Brokers"
                                width={56}
                                height={56}
                                className="w-full h-full object-contain brightness-200"
                            />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight text-navy">
                                Glaze Insurance
                            </CardTitle>
                            <CardDescription className="text-navy-light/60 text-sm mt-1 tracking-wide">
                                Trusted Risk Advisors — Admin Portal
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-navy/70 flex items-center gap-2 text-sm">
                                <Mail className="w-3.5 h-3.5 text-amber" />
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@glazeinsurance.in"
                                {...register('email')}
                                className="bg-cream/50 border-cream-dark text-navy placeholder:text-navy/30 focus:border-amber/50 focus:ring-amber/20 h-11"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-navy/70 flex items-center gap-2 text-sm">
                                <KeyRound className="w-3.5 h-3.5 text-amber" />
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                className="bg-cream/50 border-cream-dark text-navy placeholder:text-navy/30 focus:border-amber/50 focus:ring-amber/20 h-11"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-navy hover:bg-navy-dark text-white font-semibold shadow-lg shadow-navy/15 transition-all duration-300 tracking-wide"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Sign In
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-cream-dark text-center">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-navy/25">
                            glazeinsurance.in
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
