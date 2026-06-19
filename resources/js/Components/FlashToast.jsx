import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useToast } from '@/Hooks/useToast';

export default function FlashToast() {
    const { flash } = usePage().props;
    const toast = useToast();

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return null;
}
