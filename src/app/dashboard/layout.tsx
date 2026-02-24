'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/auth-store';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarFooter,
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Building2,
    Users,
    FileSpreadsheet,
    BarChart3,
    Heart,
    LogOut,
    Loader2,
    ClipboardList,
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tenants', href: '/dashboard/tenants', icon: Building2, roles: ['broker'] },
    { name: 'Employees', href: '/dashboard/employees', icon: Users },
    { name: 'TPA Forms', href: '/dashboard/tpa-forms', icon: ClipboardList },
    { name: 'Enrollments', href: '/dashboard/enrollments', icon: FileSpreadsheet },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, roles: ['broker'] },
    { name: 'Wellness', href: '/dashboard/wellness', icon: Heart },
];

const footerLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Help Center', href: '#' },
    { name: 'Software /Prolitics', href: '#' },
    { name: 'Terms of Service', href: '#' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading, isAuthenticated, checkAuth, logout } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 relative">
                        <Image src="/glaze-logo.svg" alt="Loading" width={48} height={48} className="animate-pulse" />
                    </div>
                    <Loader2 className="w-5 h-5 animate-spin text-amber" />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const filteredNav = navigation.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(user?.role || '');
    });

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-cream">
                {/* Navy Sidebar */}
                <Sidebar className="border-r-0">
                    <SidebarHeader className="border-b border-white/10 p-4 bg-navy">
                        <div className="flex flex-col gap-3">
                            <div className="w-full h-16 rounded-lg bg-white p-2 shadow-inner flex items-center justify-center">
                                <Image src="/glaze-logo.png" alt="Glaze" width={120} height={40} className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h1 className="font-bold text-white text-sm tracking-tight hidden">Glaze Insurance</h1>
                                <p className="text-[10px] text-amber-light/70 tracking-wider uppercase ml-1">Admin Portal</p>
                            </div>
                        </div>
                    </SidebarHeader>

                    <SidebarContent className="p-2 bg-navy sidebar-scroll">
                        <SidebarMenu>
                            {filteredNav.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
                                const isExactDashboard = item.href === '/dashboard' && pathname === '/dashboard';
                                const active = isExactDashboard || isActive;
                                return (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={active}
                                            className={`
                                                text-white/70 hover:text-white hover:bg-white/8
                                                transition-all duration-200 rounded-lg
                                                ${active
                                                    ? '!bg-amber !text-white font-semibold shadow-md shadow-amber-dark/30'
                                                    : ''
                                                }
                                            `}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="w-4 h-4" />
                                                <span className="text-sm">{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarContent>

                    <SidebarFooter className="border-t border-white/10 p-4 bg-navy">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-8 w-8 ring-2 ring-amber/30">
                                <AvatarFallback className="bg-amber/20 text-amber-light text-xs font-semibold">
                                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.first_name} {user?.last_name}
                                </p>
                                <p className="text-xs text-amber-light/60 capitalize">{user?.role}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </SidebarFooter>
                </Sidebar>

                {/* Main Content + Footer */}
                <SidebarInset className="flex-1 flex flex-col min-w-0">
                    {/* Mobile Header */}
                    <header className="flex md:hidden h-14 items-center gap-2 border-b border-cream-dark px-4 bg-cream sticky top-0 z-10 w-full">
                        <SidebarTrigger className="text-navy bg-white/50" />
                        <span className="text-sm font-bold text-navy ml-2 flex items-center gap-2">
                            <div className="h-8 rounded overflow-hidden">
                                <Image src="/glaze-logo.png" alt="Glaze" width={80} height={24} className="w-full h-full object-contain" />
                            </div>
                        </span>
                    </header>
                    <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
                        {children}
                    </main>

                    {/* Footer */}
                    <footer className="border-t border-cream-dark bg-cream-dark/50 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {footerLinks.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.href}
                                    className={`text-xs transition-colors ${i === footerLinks.length - 1 ? 'text-navy font-semibold' : 'text-navy/50 hover:text-amber'}`}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                        <p className="text-xs text-navy/40">
                            © Glaze Insurance. All rights reserved.
                        </p>
                    </footer>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
