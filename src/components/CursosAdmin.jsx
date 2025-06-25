"use client";

import { useState, useEffect, Fragment } from "react";
import { Plus } from "lucide-react";
import MenuLateral from "./MenuLateral";
import { FaBook } from "react-icons/fa";
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';

export default function CursosAdmin() {
    const [cursos, setCursos] = useState([]);
    const [data, setData] = useState(null);
    const router = useRouter();
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [formCurso, setFormCurso] = useState({
        title: "",
        description: "",
        price: "",
        videoUrl: "",
        coverImage: "",
        subCourses: [],
    });
    const [subCourseInput, setSubCourseInput] = useState({
        title: "",
        description: "",
        price: "",
        videoUrl: "",
        coverImage: "",
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddParentModalOpen, setIsAddParentModalOpen] = useState(false);
    const [parentCursos, setParentCursos] = useState([]);

    // Objeto para mapear os nomes dos campos para textos em português
    const labels = {
        title: "Título",
        description: "Descrição",
        price: "Preço",
        videoUrl: "URL do Vídeo",
        coverImage: "Imagem de Capa",
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/');
            return;
        }

        // Requisição para rota protegida com token
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
        async function fetchCursos() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    window.location.href = "/";
                    return;
                }
                const response = await fetch("https://api-only-mu.vercel.app/api/cursos");
                if (!response.ok) throw new Error("Erro ao buscar cursos");
                const data = await response.json();
                // Exibe somente cursos principais (sem parentCourseId)
                const cursosPrincipais = data.filter((curso) => !curso.parentCourseId);
                setCursos(cursosPrincipais);
            } catch (error) {
                console.error("Erro ao buscar cursos:", error);
            }
        }
        fetchCursos();
    }, []);

    const handleEditCurso = async () => {
        if (!selectedCurso) return;
        try {
            const response = await fetch(`https://api-only-mu.vercel.app/api/curso/${selectedCurso.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formCurso),
            });
            if (!response.ok) throw new Error("Erro ao editar curso");
            const updatedCurso = await response.json();
            setCursos((prevCursos) =>
                prevCursos.map((curso) => (curso.id === updatedCurso.id ? updatedCurso : curso))
            );
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erro ao editar curso:", error);
        }
    };

    const handleDeleteCurso = async (id) => {
        try {
            await fetch(`https://api-only-mu.vercel.app/api/curso/${id}`, { method: "DELETE" });
            setCursos((prevCursos) => prevCursos.filter((curso) => curso.id !== id));
        } catch (error) {
            console.error("Erro ao deletar curso:", error);
        }
    };

    // Função para adicionar curso com subcursos
    const handleAddCursoWithSubcourses = async () => {
        try {
            const response = await fetch("https://api-only-mu.vercel.app/api/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formCurso),
            });
            if (!response.ok) throw new Error("Erro ao adicionar curso com subcursos");
            const newCurso = await response.json();
            setCursos([...cursos, newCurso]);
            // Reseta os campos do formulário
            setFormCurso({
                title: "",
                description: "",
                price: "",
                videoUrl: "",
                coverImage: "",
                subCourses: [],
            });
            setSubCourseInput({
                title: "",
                description: "",
                price: "",
                videoUrl: "",
                coverImage: "",
            });
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("Erro ao adicionar curso com subcursos:", error);
        }
    };

    const handleAddParentCurso = async () => {
        try {
            const response = await fetch("https://admin-adam.vercel.app/api/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formCurso),
            });
            if (!response.ok) throw new Error("Erro ao adicionar curso parente");
            const newParentCurso = await response.json();
            setParentCursos((prevCursos) => [...prevCursos, newParentCurso]);
            setIsAddParentModalOpen(false);
            setFormCurso({
                title: "",
                description: "",
                price: "",
                videoUrl: "",
                coverImage: "",
                subCourses: [],
            });
        } catch (error) {
            console.error("Erro ao adicionar curso parente:", error);
        }
    };

    // Adiciona um subcurso ao formulário do curso atual
    const handleAddSubCourse = () => {
        if (!subCourseInput.title) return;
        setFormCurso({
            ...formCurso,
            subCourses: [...formCurso.subCourses, subCourseInput],
        });
        setSubCourseInput({
            title: "",
            description: "",
            price: "",
            videoUrl: "",
            coverImage: "",
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-900">
            <MenuLateral />
            <div className="flex-1 p-8">
                <h1 className="text-4xl font-semibold mb-6 text-center text-white flex items-center justify-center gap-2">
                    Cursos Disponíveis
                    <FaBook className="text-2xl text-blue-300 mr-2" />
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {cursos.map((curso, index) => (
                        <div
                            key={`${curso.id}-${index}`}
                            className="bg-gray-800 shadow-md hover:shadow-lg rounded-xl p-6 border border-gray-700 transition-all"
                        >
                            <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-700 mb-4 flex items-center justify-center">
                                {curso.coverImage ? (
                                    <img
                                        src={curso.coverImage}
                                        alt={curso.title}
                                        className="object-cover w-full h-full rounded-lg"
                                    />
                                ) : (
                                    <span className="text-gray-300 text-xl">Sem imagem</span>
                                )}
                            </div>
                            <p className="font-extrabold text-white">{curso.id}</p>
                            <h2 className="text-lg font-semibold text-white mb-2 truncate">{curso.title}</h2>
                            <p className="text-gray-300 text-sm mb-2">
                                {curso.description || "Sem descrição disponível"}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-green-400">R$ {curso.price}</span>
                                {curso.oldPrice && (
                                    <span className="text-gray-500 line-through text-sm">R$ {curso.oldPrice}</span>
                                )}
                            </div>
                            <div className="flex space-x-2 mt-4">
                                <button
                                    onClick={() => {
                                        setSelectedCurso(curso);
                                        setFormCurso(curso);
                                        setIsModalOpen(true);
                                    }}
                                    className="w-1/2 bg-blue-600 text-white font-medium py-2 rounded-lg transition-all hover:bg-blue-700"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteCurso(curso.id)}
                                    className="w-1/2 bg-red-500 text-white font-medium py-2 rounded-lg transition-all hover:bg-red-600"
                                >
                                    Deletar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="fixed bottom-4 right-4 flex flex-col items-center justify-center border-none rounded-xl border border-gray-700 transition-all"
            >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full text-white mb-3">
                    <Plus size={30} />
                </div>
            </button>

            {/* Modal de Edição */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-5 text-white text-center">Editar Curso</h2>
                        <div className="space-y-4">
                            {Object.keys(labels).map((field) => (
                                <div key={field}>
                                    <label className="block text-gray-200 font-medium mb-1">
                                        {labels[field]}
                                    </label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formCurso[field] || ""}
                                        onChange={(e) =>
                                            setFormCurso({ ...formCurso, [field]: e.target.value })
                                        }
                                        className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                        placeholder={`Digite ${labels[field]}`}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEditCurso}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Adicionar Curso com Subcursos */}
            {isAddModalOpen && (
                <Transition appear show={isAddModalOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={() => setIsAddModalOpen(false)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-50" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-gray-800 p-8 text-left shadow-xl transition-all">
                                        <Dialog.Title as="h3" className="text-2xl font-bold text-white text-center">
                                            Adicionar Curso
                                        </Dialog.Title>

                                        {/* Dados do curso principal */}
                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {Object.keys(labels).map((field) => (
                                                <div key={field}>
                                                    <input
                                                        id={field}
                                                        type="text"
                                                        name={field}
                                                        value={formCurso[field] || ""}
                                                        onChange={(e) => setFormCurso({ ...formCurso, [field]: e.target.value })}
                                                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-white px-2 py-2"
                                                        placeholder={`Digite ${labels[field]}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Seção para adicionar subcursos */}
                                        <div className="mt-8">
                                            <h4 className="text-xl font-semibold text-white mb-4 px-2 py-2">Subcursos</h4>
                                            {formCurso.subCourses && formCurso.subCourses.length > 0 && (
                                                <ul className="mb-4 space-y-3">
                                                    {formCurso.subCourses.map((sub, index) => (
                                                        <li key={index} className="flex flex-col p-4 border rounded-md shadow-sm bg-gray-700">
                                                            <span className="font-bold text-gray-200">{sub.title}</span>
                                                            <span className="text-gray-300 text-sm">{sub.description}</span>
                                                            <span className="text-gray-300 text-sm">Preço: R$ {sub.price}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {Object.keys(labels).map((field) => (
                                                    <div key={field}>
                                                        <input
                                                            id={`sub-${field}`}
                                                            type="text"
                                                            name={field}
                                                            value={subCourseInput[field] || ""}
                                                            onChange={(e) =>
                                                                setSubCourseInput({ ...subCourseInput, [field]: e.target.value })
                                                            }
                                                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-white px-2 py-2"
                                                            placeholder={`Digite ${labels[field]}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-4">
                                                <button
                                                    onClick={handleAddSubCourse}
                                                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                                                >
                                                    Adicionar Subcurso
                                                </button>
                                            </div>
                                        </div>

                                        {/* Botões de ação */}
                                        <div className="mt-8 flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsAddModalOpen(false)}
                                                className="inline-flex justify-center rounded-md border border-gray-600 bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleAddCursoWithSubcourses}
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            >
                                                Adicionar Curso
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            )}

            {/* Modal de Adicionar Curso Parente */}
            {isAddParentModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-5 text-white text-center">
                            Adicionar Curso Parente
                        </h2>
                        <div className="space-y-4">
                            {Object.keys(labels).map((field) => (
                                <div key={field}>
                                    <label className="block text-gray-200 font-medium mb-1">
                                        {labels[field]}
                                    </label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formCurso[field] || ""}
                                        onChange={(e) => setFormCurso({ ...formCurso, [field]: e.target.value })}
                                        className="w-full bg-gray-700 border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                        placeholder={`Digite ${labels[field]}`}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={() => setIsAddParentModalOpen(false)}
                                className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddParentCurso}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Adicionar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
