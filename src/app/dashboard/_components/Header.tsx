"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Header: React.FC = () => {
    const path = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/dashboard/questions', label: 'Questions' },
        { href: '/upgrade', label: 'Upgrade' },
        { href: '/how', label: 'How it Works?' },
    ];

    const NavLinks = () => (
        <>
            {navItems.map((item) => (
                <Link href={item.href} key={item.href}>
                    <li className={`text-lg hover:text-orange-300 hover:font-bold transition-all cursor-pointer
                        ${path === item.href && 'text-orange-400 font-bold underline'}`}>
                        {item.label}
                    </li>
                </Link>
            ))}
        </>
    );

    return (
        <div className='bg-secondary shadow-sm'>
            <div className='max-w-7xl mx-auto flex p-4 items-center justify-between'>
                <Link href={'/'} className='flex items-center justify-center'>
                    <Image src='/logo.png' width={200} height={120} alt='logo' className='object-contain' />
                </Link>
                <ul className='hidden md:flex gap-8'>
                    <NavLinks />
                </ul>
                <div className='flex items-center gap-4'>
                    <UserButton/>
                    <button 
                        className='md:hidden'
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-64 bg-secondary shadow-lg transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
                <div className='p-4'>
                    <button 
                        className='mb-4'
                        onClick={() => setSidebarOpen(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <ul className='flex flex-col gap-4'>
                        <NavLinks />
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;