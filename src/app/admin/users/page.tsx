import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      image: true,
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-gray-400 text-sm mt-1">
          {users.length} registered {users.length === 1 ? "user" : "users"}
        </p>
      </div>

      <div className="bg-[#111827] border border-[#374151] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#374151]">
              <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">
                User
              </th>
              <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">
                Email
              </th>
              <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">
                Role
              </th>
              <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#374151]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1f2937] flex items-center justify-center text-gray-400 text-xs font-bold uppercase">
                      {user.name?.charAt(0) ?? "?"}
                    </div>
                    <span className="text-sm text-white">
                      {user.name ?? "\u2014"}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-gray-400">
                  {user.email}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      user.role === "ADMIN"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
