import React, { useState, useEffect } from "react";
import Link from "next/link";

const UserCards = ({
  users = [],
  adminRoute = "",
  handleWhereChange,
  handleSortChange,
}) => {
  const [search, setSearch] = useState("");
  const [verification, setVerification] = useState("all");
  const [role, setRole] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const andConditions = [];

    if (search.trim()) {
      const terms = search.trim().split(/\s+/);

      if (terms.length === 1) {
        andConditions.push({
          or: [
            { firstName: { contains: terms[0] } },
            { lastName: { contains: terms[0] } },
            { email: { contains: terms[0] } },
          ],
        });
      } else {
        const firstTerm = terms[0];
        const restTerms = terms.slice(1).join(" ");

        andConditions.push({
          or: [
            {
              and: [
                { firstName: { contains: firstTerm } },
                { lastName: { contains: restTerms } },
              ],
            },
            {
              and: [
                { firstName: { contains: restTerms } },
                { lastName: { contains: firstTerm } },
              ],
            },
            { email: { contains: search.trim() } },
          ],
        });
      }
    }

    if (verification !== "all") {
      andConditions.push({
        _verified: {
          equals: verification === "verified",
        },
      });
    }

    if (role !== "all") {
      andConditions.push({
        role: {
          equals: role,
        },
      });
    }

    handleWhereChange(
      andConditions.length
        ? {
            AND: andConditions,
          }
        : {},
    );
  }, [search, verification, role]);

  return (
    <div>
      <div className="flex p-4 flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#fff9f0]">
            Users Management Dashboard
          </h1>
          <p className="text-sm text-[#e2cca6]/70">
            Manage, search, and filter user accounts
          </p>
        </div>
        <Link
          href={`${adminRoute}/collections/users/create`}
          className="px-4 py-2 bg-[#8c5a3c] hover:bg-[#a36a46] text-[#fff9f0] font-medium rounded-lg shadow transition-colors text-sm border border-[#6b4a37]"
        >
          + Add New User
        </Link>
      </div>
      <div className="mt-2 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#1A120D]/80 p-5 backdrop-blur-md lg:flex-row lg:items-center">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:h-11 lg:py-0 py-4 flex-1 rounded-xl border border-white/10 bg-[#2A1B12] px-4 text-white placeholder:text-gray-500 focus:border-[#C07A3B] focus:outline-none"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
          <select
            value={verification}
            onChange={(e) => setVerification(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-[#2A1B12] px-3 text-white"
          >
            <option value="all">All Users</option>
            <option value="verified">Verified</option>
            <option value="unverified">Not Verified</option>
          </select>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-[#2A1B12] px-3 text-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>

          <select
            value={sort}
            onChange={(e) => {
              const value = e.target.value;
              setSort(value);
              handleSortChange(value === "newest" ? "-createdAt" : "createdAt");
            }}
            className="h-11 rounded-xl border border-white/10 bg-[#2A1B12] px-3 text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => {
          const editUrl = `${adminRoute}/collections/users/${user.id}`;

          return (
            <div
              key={user.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-[#C07A3B]/50 hover:bg-white/10 hover:shadow-xl hover:shadow-[#6F3F1C]/20 p-6"
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#C07A3B]/10 blur-2xl transition-all duration-300 group-hover:bg-[#C07A3B]/20" />

              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white transition-colors group-hover:text-[#D8A46B]">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-base text-gray-400">{user.email}</p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                      user.role === "admin"
                        ? "border border-[#C07A3B]/40 bg-[#C07A3B]/20 text-[#E8C6A7]"
                        : "border border-white/10 bg-white/5 text-gray-300"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-base text-gray-300">
                  {user.phoneNumber && (
                    <div className="flex items-center justify-between border-t border-white/5 pt-2">
                      <span className="text-gray-400">Phone:</span>
                      <span className="font-medium text-gray-200">
                        {user.phoneNumber}
                      </span>
                    </div>
                  )}
                  {user.gender && (
                    <div className="flex items-center justify-between border-t border-white/5 pt-2">
                      <span className="text-gray-400">Gender:</span>
                      <span className="font-medium capitalize text-gray-200">
                        {user.gender}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
                <Link
                  href={editUrl}
                  className="inline-flex items-center justify-center rounded-xl border border-[#C07A3B]/30 bg-[#6F3F1C]/40 px-4 py-2 text-sm font-medium text-[#E8C6A7] shadow-sm transition-all hover:bg-[#C07A3B] hover:text-white"
                >
                  Edit User
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {users.length === 0 && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#1A120D]/60 p-12 text-center text-gray-400">
          No users found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default UserCards;
