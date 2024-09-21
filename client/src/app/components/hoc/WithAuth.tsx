"use client"
import useCheckAuth from '@/hooks/useCheckAuth';
import React from 'react'
import Loader from '../Loader';
import { useRouter } from 'next/navigation';

const WithAuth = <P extends object>(Component: React.ComponentType<P>) => {

    const WithAuth: React.FC<P> = (props: any) => {
        const { isAuthenticated, loading } = useCheckAuth();
        const router = useRouter();
        if (loading) {
            return <Loader />
        }

        if (!isAuthenticated) {
            router.push("/");
            return null;
        }


        return <Component {...props} />
    }

    return WithAuth;
}

export default WithAuth