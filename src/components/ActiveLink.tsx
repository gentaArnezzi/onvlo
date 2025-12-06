'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/utils/Helpers';

type ActiveLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
};

export const ActiveLink = ({
  href,
  children,
  className,
  activeClassName,
  inactiveClassName,
}: ActiveLinkProps) => {
  const pathname = usePathname();

  // Special handling for "/dashboard" - only active on exact match
  // For other routes, check if pathname starts with href
  let isActive: boolean;
  if (href === '/dashboard') {
    // Only active on exact "/dashboard" or "/dashboard/"
    isActive = pathname === '/dashboard' || pathname === '/dashboard/';
  } else {
    // For other routes, check if pathname starts with href
    isActive = pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <Link
      href={href}
      className={cn(
        'px-3 py-2 rounded-md transition-colors',
        className,
        isActive
          ? activeClassName || 'bg-primary text-primary-foreground'
          : inactiveClassName || 'text-muted-foreground hover:text-foreground hover:bg-muted',
      )}
    >
      {children}
    </Link>
  );
};
