'use client';

import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useLocale } from 'next-intl';

import { ActiveLink } from '@/components/ActiveLink';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { ToggleMenuButton } from '@/components/ToggleMenuButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/templates/Logo';
import { getI18nPath } from '@/utils/Helpers';

export const DashboardHeader = (props: {
  menu: {
    href: string;
    label: string;
  }[];
}) => {
  const locale = useLocale();

  // Split menu into primary (always visible) and secondary (in dropdown)
  const primaryMenu = props.menu.slice(0, 6); // First 6 items
  const secondaryMenu = props.menu.slice(6); // Rest in dropdown

  return (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Link href="/dashboard" className="shrink-0">
          <Logo />
        </Link>

        <svg
          className="hidden shrink-0 size-8 stroke-muted-foreground sm:block"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M17 5 7 19" />
        </svg>

        <OrganizationSwitcher
          organizationProfileMode="navigation"
          organizationProfileUrl={getI18nPath(
            '/dashboard/organization-profile',
            locale,
          )}
          afterCreateOrganizationUrl="/dashboard"
          hidePersonal
          skipInvitationScreen
          appearance={{
            elements: {
              organizationSwitcherTrigger: 'max-w-28 sm:max-w-52',
            },
          }}
        />

        {/* Primary Navigation - Hidden on mobile, visible on tablet+ */}
        <nav className="hidden min-w-0 flex-1 md:block">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            <ul className="flex items-center gap-1 text-sm font-medium [&_a:hover]:opacity-100 [&_a]:opacity-75">
              {primaryMenu.map((item) => (
                <li key={item.href} className="shrink-0">
                  <ActiveLink href={item.href}>{item.label}</ActiveLink>
                </li>
              ))}
              {secondaryMenu.length > 0 && (
                <li className="shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="px-3 py-2 opacity-75 hover:opacity-100">
                        More
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {secondaryMenu.map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link href={item.href}>{item.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-x-1.5">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ToggleMenuButton />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {props.menu.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <ul className="flex items-center gap-x-1.5 [&_li[data-fade]:hover]:opacity-100 [&_li[data-fade]]:opacity-60">
          <li data-fade>
            <LocaleSwitcher />
          </li>

          <li>
            <Separator orientation="vertical" className="h-4" />
          </li>

          <li>
            <UserButton
              userProfileMode="navigation"
              userProfileUrl="/dashboard/user-profile"
              appearance={{
                elements: {
                  rootBox: 'px-2 py-1.5',
                },
              }}
            />
          </li>
        </ul>
      </div>
    </>
  );
};
