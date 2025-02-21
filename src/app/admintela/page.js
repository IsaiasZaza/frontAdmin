"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MenuLateral from '../../components/MenuLateral';

export default function AdminTela() {
    const [data, setData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/');
            return;
        }

        fetch('https://admin-adam.vercel.app/admin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
            .then(async (res) => {
                if (!res.ok) {
                    router.push('/');
                } else {
                    const json = await res.json();
                    setData(json);
                }
            })
            .catch((err) => {
                console.error(err);
                router.push('/');
            });
    }, [router]);

    if (!data) return <p>Carregando...</p>;

    return (
        <>
            <MenuLateral />
        </>
    );
}
