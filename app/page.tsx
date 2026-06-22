'use client';
import dynamic from 'next/dynamic';
import React from 'react';

const MainLayout = dynamic(() => import('../web/src/layouts/MainLayout').then(m => m.MainLayout), { ssr: false });

export default function Home() {
  return (
    <MainLayout />
  );
}
