import ChatLayout from "@/Layouts/ChatLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageInput from "@/Components/App/MessageInput";
import MessageItem from "@/Components/App/MessageItem";

function Dashboard({ selectedConversation = null, messages }) {
    const [localMessages, setLocalMessages] = useState([]);
    const messageCtnRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            messageCtnRef.current.scrollTop =
                messageCtnRef.current.scrollHeight;
        }, 1000);
    }, [selectedConversation]);

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);
    return (
        <>
            <Head title="Dashboard" />

            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center h-full opacity-35">
                    <div className="text-2xl md:text-4xl p-16 text-state-200">
                        Please select conversation to see messages
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block" />
                </div>
            )}

            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />
                    <div
                        className="flex-1 overflow-auto p-5"
                        ref={messageCtnRef}
                    >
                        {/* Messages */}
                        {localMessages.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-slate-200">
                                    No messages found
                                </div>
                            </div>
                        )}

                        {localMessages.length > 0 && (
                            <div className="flex-1 flex flex-col">
                                {localMessages.map((message, index) => (
                                    <MessageItem
                                        key={index}
                                        message={message}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <MessageInput conversation={selectedConversation} />
                </>
            )}
        </>
    );
}

Dashboard.layout = (page) => (
    <AuthenticatedLayout children={page.props.auth.user}>
        <ChatLayout children={page} />
    </AuthenticatedLayout>
);

export default Dashboard;
