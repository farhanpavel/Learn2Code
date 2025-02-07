"use client";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Page() {
    const router = useRouter();
    return (
        <div>
        <h1>Study</h1>
        <Button onClick={()=>{router.push('/userdashboard/study/watch')}}
        >Watch video</Button>
        </div>
    );
}