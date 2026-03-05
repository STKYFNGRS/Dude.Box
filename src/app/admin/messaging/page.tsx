import { prisma } from "@/lib/prisma";

export default async function MessagingPage() {
  const [totalConversations, totalMessages, usersWithKeys] = await Promise.all([
    prisma.conversation.count(),
    prisma.directMessage.count(),
    prisma.userKeyPair.count(),
  ]);

  const stats = [
    {
      label: "Total Conversations",
      value: totalConversations,
      color: "text-blue-400",
    },
    {
      label: "Total Messages",
      value: totalMessages,
      color: "text-green-400",
    },
    {
      label: "Users with Key Pairs",
      value: usersWithKeys,
      color: "text-purple-400",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Messaging</h1>
        <p className="text-gray-400 text-sm mt-1">
          Encrypted messaging monitoring dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#111827] border border-[#374151] rounded-lg p-6"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#111827] border border-[#374151] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Encryption Status
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-400">
              End-to-End Encryption
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-[#374151]">
            <span className="text-sm text-gray-400">
              Key Exchange Protocol
            </span>
            <span className="text-xs text-gray-500 font-mono">
              RSA-OAEP + AES-GCM
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-[#374151]">
            <span className="text-sm text-gray-400">
              Users with Active Key Pairs
            </span>
            <span className="text-xs text-gray-500">
              {usersWithKeys} users
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-6 border-t border-[#374151] pt-4">
          Messages are encrypted client-side. The server stores only ciphertext
          and cannot read message contents.
        </p>
      </div>
    </div>
  );
}
