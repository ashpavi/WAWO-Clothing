import { useMemo, useState } from "react";

import { useContactMessages } from "../../hooks/useContactMessages";

const formatDate = (dateValue) => {
    if (!dateValue) return "Just now";

    return dateValue.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

export default function AdminMessages() {
    const { messages, loading, error, setRead } = useContactMessages();
    const [activeTopic, setActiveTopic] = useState("All");

    const topics = useMemo(() => {
        const unique = new Set(messages.map((item) => item.topic).filter(Boolean));
        return ["All", ...Array.from(unique)];
    }, [messages]);

    const filtered = useMemo(() => {
        if (activeTopic === "All") return messages;
        return messages.filter((item) => item.topic === activeTopic);
    }, [messages, activeTopic]);

    const unreadCount = useMemo(
        () => messages.filter((item) => item.status !== "read").length,
        [messages]
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Messages</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Customer contact form submissions from the website.
                    </p>
                </div>

                <div className="rounded-xl border bg-white px-4 py-3 text-sm shadow-sm">
                    <span className="font-semibold text-gray-900">Unread:</span>{" "}
                    <span className="text-blue-600">{unreadCount}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                    <button
                        key={topic}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                            activeTopic === topic
                                ? "border-blue-600 bg-blue-50 text-blue-600"
                                : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
                        }`}
                        onClick={() => setActiveTopic(topic)}
                    >
                        {topic}
                    </button>
                ))}
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Sender</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Topic</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Message</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Received</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((item) => (
                                <tr key={item.id} className="align-top">
                                    <td className="px-5 py-4">
                                        <div className="font-medium text-gray-900">{item.fullName}</div>
                                        <div className="text-sm text-gray-500">{item.email}</div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                                            {item.topic}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-700">
                                        <p className="max-w-md whitespace-pre-line leading-relaxed">{item.message}</p>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-500">{formatDate(item.createdAt)}</td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                item.status === "read"
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-blue-50 text-blue-600"
                                            }`}
                                        >
                                            {item.status === "read" ? "Read" : "New"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        {item.status === "read" ? (
                                            <span className="text-xs text-gray-400">No action</span>
                                        ) : (
                                            <button
                                                onClick={() => setRead(item.id)}
                                                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:border-blue-300 hover:bg-blue-100"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {!loading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-500">
                                        No messages found for this filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {loading && <div className="px-5 py-4 text-sm text-gray-500">Loading messages...</div>}
                {error && <div className="px-5 py-4 text-sm text-red-600">{error}</div>}
            </div>
        </div>
    );
}