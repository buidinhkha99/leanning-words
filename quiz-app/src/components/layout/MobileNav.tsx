'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, FileText, Play, History } from 'lucide-react';

const tabs = [
  { href: '/dashboard', label: 'Trang chủ', icon: Home },
  { href: '/questions', label: 'Ngân hàng', icon: BookOpen },
  { href: '/exams', label: 'Đề thi', icon: FileText },
  { href: '/practice', label: 'Ôn tập', icon: Play },
  { href: '/history', label: 'Lịch sử', icon: History },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
