import React from "react";
import { useLocation } from "react-router-dom";
import { TbMenu } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";

function Navbar() {
  const location = useLocation();
  return location.pathname === "/" ? (
    <div className="fixed bg-black opacity-95 top-0 left-0 right-0 z-50 flex items-center h-16 justify-between shadow px-4">
      <div className="flex items-center">
        <TbMenu className="menu" />

        <h1 className="text-white pl-4 font-bold text-lg cursor-pointer logo">
          Youtube Clone
        </h1>
      </div>

      <div className="relative search">
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded-full py-1.5 pl-4 pr-2 focus:outline-none focus:border-gray-500 text-sm input"
        />
        <CiSearch
          className="cursor-pointer absolute right-2 top-2 search-icon"
          size={20}
        />
      </div>

      <div className="flex gap-6 items-center w-32 justify-center bg-red-300"></div>
    </div>
  ) : null;
}

export default Navbar;
