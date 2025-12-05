'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/Helpers';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ToggleMenuButton } from '@/components/ToggleMenuButton';

interface MenuItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  menu: MenuItem[];
}

export function Sidebar({ menu }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = menu.map((item) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return { ...item, isActive };
  });

  return (
    <>
      {/* Mobile: Sheet/Sidebar */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <ToggleMenuButton />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col">
              <div className="border-b p-4">
                <h2 className="text-lg font-semibold">Menu</h2>
              </div>
              <nav className="flex-1 space-y-1 p-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      item.isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

    </>
  );
}

