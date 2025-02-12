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
            router.push('/login');
            return;
        }

        // Faz a requisição para a rota protegida enviando o token no header Authorization
        fetch('http://localhost:3000/admin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
            .then(async (res) => {
                if (!res.ok) {
                    // Se o token for inválido ou estiver expirado, redireciona para login
                    router.push('/login');
                } else {
                    const json = await res.json();
                    setData(json);
                }
            })
            .catch((err) => {
                console.error(err);
                router.push('/login');
            });
    }, [router]);

    if (!data) return <p>Carregando...</p>;

    return (
        <>
            <MenuLateral />
        </>
    );
}
