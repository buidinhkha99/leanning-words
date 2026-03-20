'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FileText, Play, History, BarChart3, Menu, LogOut, User } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/contexts/AuthContext';
import { signOut } from '@/lib/firebase/auth';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Trang chủ', icon: BarChart3 },
  { href: '/questions', label: 'Ngân hàng', icon: BookOpen },
  { href: '/exams', label: 'Đề thi', icon: FileText },
  { href: '/practice', label: 'Ôn tập', icon: Play },
  { href: '/history', label: 'Lịch sử', icon: History },
  { href: '/stats', label: 'Thống kê', icon: BarChart3 },
];

export function Header({ timerElement }: { timerElement?: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
      <div className="max-w-4xl mx-auto flex items-center h-14 px-4 gap-2">
        <Link href="/dashboard" className="font-bold text-lg mr-4 shrink-0">
          Quiz App
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                pathname.startsWith(item.href)
                  ? 'bg-white/25 text-white'
                  : 'text-white/80 hover:bg-white/15 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {timerElement}

        <div className="ml-auto flex items-center gap-2">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'text-white/80 hover:text-white hover:bg-white/15'
                )}
              >
                <User className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline max-w-24 truncate">
                  {user.displayName || user.email}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'md:hidden text-white/80 hover:text-white hover:bg-white/15'
              )}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetTitle className="font-bold text-lg mb-4">Quiz App</SheetTitle>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        pathname.startsWith(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
