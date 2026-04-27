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
        <div className="space-y-6 sm:space-y-8">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-3xl font-semibold text-gray-900">
                        Messages
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                        Customer contact form submissions.
                    </p>
                </div>

                <div className="self-start sm:self-auto rounded-xl border bg-white px-4 py-2 text-sm shadow-sm">
                    <span className="font-semibold text-gray-900">Unread:</span>{" "}
                    <span className="text-blue-600">{unreadCount}</span>
                </div>
            </div>

            {/* FILTER */}
            <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                    <button
                        key={topic}
                        className={`rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium transition
                        ${
                            activeTopic === topic
                                ? "bg-blue-600 text-white"
                                : "bg-white border text-gray-600 hover:border-blue-300 hover:text-blue-600"
                        }`}
                        onClick={() => setActiveTopic(topic)}
                    >
                        {topic}
                    </button>
                ))}
            </div>

            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block overflow-hidden rounded-2xl border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Sender</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Topic</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Message</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Received</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {filtered.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-5 py-4">
                                        <div className="font-medium">{item.fullName}</div>
                                        <div className="text-sm text-gray-500">{item.email}</div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="bg-gray-100 px-2 py-1 text-xs rounded">
                                            {item.topic}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-sm">
                                        <p className="max-w-md whitespace-pre-line">
                                            {item.message}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-500">
                                        {formatDate(item.createdAt)}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs ${
                                            item.status === "read"
                                                ? "bg-green-100 text-green-600"
                                                : "bg-blue-100 text-blue-600"
                                        }`}>
                                            {item.status === "read" ? "Read" : "New"}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        {item.status !== "read" && (
                                            <button
                                                onClick={() => setRead(item.id)}
                                                className="text-blue-600 text-xs"
                                            >
                                                Mark as read
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="md:hidden space-y-4">

                {filtered.map((item) => (

                    <div key={item.id} className="bg-white border rounded-xl p-4 shadow-sm space-y-3">

                        {/* TOP */}
                        <div>
                            <p className="font-semibold text-gray-900">
                                {item.fullName}
                            </p>
                            <p className="text-xs text-gray-500 break-words">
                                {item.email}
                            </p>
                        </div>

                        {/* TOPIC + STATUS */}
                        <div className="flex justify-between items-center">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {item.topic}
                            </span>

                            <span className={`text-xs px-2 py-1 rounded-full ${
                                item.status === "read"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-blue-100 text-blue-600"
                            }`}>
                                {item.status === "read" ? "Read" : "New"}
                            </span>
                        </div>

                        {/* MESSAGE */}
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                            {item.message}
                        </p>

                        {/* FOOTER */}
                        <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2">

                            <span>{formatDate(item.createdAt)}</span>

                            {item.status !== "read" && (
                                <button
                                    onClick={() => setRead(item.id)}
                                    className="text-blue-600 font-medium"
                                >
                                    Mark as read
                                </button>
                            )}

                        </div>

                    </div>

                ))}

                {!loading && filtered.length === 0 && (
                    <p className="text-center text-sm text-gray-500">
                        No messages found.
                    </p>
                )}

            </div>

            {loading && <p className="text-sm text-gray-500">Loading messages...</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

        </div>
    );
}