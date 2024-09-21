"use client"
import { checkAuthApi } from '@/lib/api/auth/auth';
import  {  useCallback, useEffect, useState } from 'react'
import { toast } from './use-toast';

const useCheckAuth = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            setLoading(true);

            const res = await checkAuthApi();

            if (res.status === 200) {
                setIsAuthenticated(true);
            }

        } catch (error: any) {
            toast({
                variant: "destructive",
                description: error?.response?.data?.message || error?.message,
                duration: 1000,
            });
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth])

    return { isAuthenticated, loading }
}

export default useCheckAuth