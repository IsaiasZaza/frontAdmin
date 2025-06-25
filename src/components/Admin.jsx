"use client";
import { useState, useEffect, useRef } from "react";
import MenuLateral from "./MenuLateral";
import { HiOutlineDotsVertical } from "react-icons/hi"; // Ícone de três pontos
import { useRouter } from 'next/navigation';

const Admin = () => {
    const [alunos, setAlunos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [courseId, setCourseId] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [userId, setUserId] = useState("");
    const dropdownRef = useRef(null);
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


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchAlunos = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                window.location.href = "/";
                return;
            }

            try {
                const response = await fetch(`https://api-only-mu.vercel.app/api/users`, {
                    method: "GET",
                });

                if (!response.ok) throw new Error("Erro ao buscar a lista de alunos");

                const data = await response.json();
                setAlunos(data || []);
            } catch (error) {
                console.error("Erro ao buscar a lista de alunos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAlunos();
    }, []);

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            <MenuLateral />
            <main className="flex-grow p-6 relative">
                <section>
                    <h2 className="text-3xl font-bold mb-6">Lista de Alunos</h2>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            {alunos.length > 0 ? (
                                <table className="min-w-full bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-700">
                                    <thead>
                                        <tr className="bg-gray-700 text-white">
                                            <th className="px-6 py-3 text-left font-semibold">Id</th>
                                            <th className="px-6 py-3 text-left font-semibold">Nome</th>
                                            <th className="px-6 py-3 text-left font-semibold">Email</th>
                                            <th className="px-6 py-3 text-left font-semibold">Localização</th>
                                            <th className="px-6 py-3 text-left font-semibold">Profissão</th>
                                            <th className="px-6 py-3 text-left font-semibold">Data de Cadastro</th>
                                            <th className="px-6 py-3 text-left font-semibold">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alunos.map((data, index) => (
                                            <tr
                                                key={data.id || index}
                                                className={`${index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"} hover:bg-gray-600`}
                                            >
                                                <td className="px-6 py-3 border-b border-gray-700">{data.id}</td>
                                                <td className="px-6 py-3 border-b border-gray-700">{data.nome}</td>
                                                <td className="px-6 py-3 border-b border-gray-700">{data.email}</td>
                                                <td className="px-6 py-3 border-b border-gray-700">{data.estado}</td>
                                                <td className="px-6 py-3 border-b border-gray-700">{data.profissao}</td>
                                                <td className="px-6 py-3 border-b border-gray-700">
                                                    {new Date(data.createdAt).toLocaleDateString("pt-BR")}
                                                </td>
                                                <td className="px-6 py-3 border-b relative">
                                                    <button
                                                        onClick={() => setIsDropdownOpen(isDropdownOpen === data.id ? null : data.id)}
                                                        className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
                                                    >
                                                        <HiOutlineDotsVertical className="text-white text-lg" />
                                                    </button>

                                                    {isDropdownOpen === data.id && (
                                                        <div
                                                            ref={dropdownRef}
                                                            className="absolute right-0 mt-2 w-44 bg-gray-800 text-white shadow-lg rounded-lg z-50 dropdown-menu"
                                                        >
                                                            <button
                                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                                                                onClick={() => {
                                                                    setSelectedUser(data);
                                                                    setIsAddModalOpen(true);
                                                                    setIsDropdownOpen(null);
                                                                    setFeedback("");
                                                                }}
                                                            >
                                                                ➕ Adicionar Curso
                                                            </button>
                                                            <button
                                                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                                                                onClick={() => {
                                                                    setSelectedUser(data);
                                                                    setIsRemoveModalOpen(true);
                                                                    setIsDropdownOpen(null);
                                                                    setFeedback("");
                                                                }}
                                                            >
                                                                ❌ Remover Curso
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-400 text-center mt-10">Nenhum aluno encontrado.</p>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Admin;
