"use client";

import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaUser, FaBook } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const MenuLateral = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="flex">
      {isMobile ? (
        <>
          {/* Botão do menu hambúrguer */}
          <button
            onClick={toggleMenu}
            className="fixed z-50 p-2 bg-gray-800 text-white rounded-br-3xl shadow-lg hover:bg-gray-700"
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Overlay para bloquear clique fora do menu */}
          {menuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={toggleMenu} // Fecha ao clicar fora
            ></div>
          )}

          {/* Menu lateral */}
          <nav
            className={`fixed top-0 left-0 h-full w-[300px] bg-gray-900 text-white shadow-2xl transform transition-transform duration-500 ease-in-out ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            } z-50`}
          >
            <MenuContent handleLogout={handleLogout} />
          </nav>
        </>
      ) : (
        <nav className="w-[350px] sticky top-0 h-screen bg-gray-900 text-white flex flex-col left-0 shadow-2xl">
          <MenuContent handleLogout={handleLogout} />
        </nav>
      )}

      <main className="flex-1 transition-all bg-gray-100 dark:bg-gray-800">
        {children}
      </main>
    </div>
  );
};

const MenuContent = ({ handleLogout }) => (
  <div className="flex flex-col h-full">
    <ul className="space-y-6 px-4 flex-1 pt-56">
      <MenuItem href="/admin" icon={<FaUser />} text="Lista de Alunos" />
      <MenuItem href="/cursosAdmin" icon={<FaBook />} text="Cursos Admin" />
    </ul>

    {/* Botão de logout */}
    <div className="p-4 border-t border-gray-700 mt-auto">
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 text-white px-4 py-2 rounded-lg transition-all duration-200 bg-red-600 hover:bg-red-700"
      >
        <FiLogOut className="text-xl" />
        Sair
      </button>
    </div>
  </div>
);

const MenuItem = ({ href, icon, text }) => (
  <li className="flex items-center gap-4 py-2 px-4 rounded-lg transition-all duration-200 hover:bg-gray-700">
    <span className="text-2xl">{icon}</span>
    <a href={href} className="text-white font-medium">
      {text}
    </a>
  </li>
);

export default MenuLateral;
