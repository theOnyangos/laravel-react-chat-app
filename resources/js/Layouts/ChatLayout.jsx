import ConversationItem from "@/Components/App/ConversationItem";
import TextInput from "@/Components/TextInput";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [onlineUsers, setOnlineUsers] = useState({});
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState(
        []
    ); /* sortedConversations */

    // console.log(conversations);
    // console.log(selectedConversation);

    const isOnlineUser = (userId) => onlineUsers[userId];

    const onSearch = (event) => {
        const search = event.target.value.toLowerCase();
        if (search) {
            setLocalConversations(
                conversations.filter((conversation) =>
                    conversation.name.toLowerCase().includes(search)
                )
            );
        } else {
            setLocalConversations(conversations);
        }
    };

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                }

                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else {
                    return 0;
                }
            })
        );
    }, [sortedConversations]);

    useEffect(() => {
        Echo.join("online")
            .here((users) => {
                // console.log("Here", users);
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );
                setOnlineUsers((prevOnlineUsers) => ({
                    ...prevOnlineUsers,
                    ...onlineUsersObj,
                }));
            })
            .joining((user) => {
                // console.log("Joining", user);
                setOnlineUsers((prevOnlineUsers) => {
                    return { ...prevOnlineUsers, [user.id]: user };
                });
            })
            .leaving((user) => {
                // console.log("Leaving", user);
                setOnlineUsers((prevOnlineUsers) => {
                    const newOnlineUsers = { ...prevOnlineUsers };
                    delete newOnlineUsers[user.id];
                    return newOnlineUsers;
                });
            })
            .error((error) => {
                console.error(error);
            });

        return () => {
            Echo.leave("online");
        };
    }, []);

    return (
        <div className="flex-1 w-full flex overflow-hidden">
            <div
                className={`transition-all w-full sm:w-[220px] md:w-[350px] bg-slate-500 flex flex-col overflow-hidden ${
                    selectedConversation ? "-ml-[100%] sm:ml-0" : ""
                }`}
            >
                {/* Title Section */}
                <div className="flex items-center justify-between py-2 px-3 text-xl font-medium">
                    <h5 className="text-white">My Conversations</h5>
                    <div
                        className="tooltip tooltip-left"
                        data-tip="Create new Group"
                    >
                        <button className="p-1 rounded-full bg-slate-400 hover:text-slate-200 text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Search section */}
                <div className="p-3">
                    <TextInput
                        onKeyUp={onSearch}
                        placeholder="Filter Users and Groups"
                        className="w-full dark:bg-gray-700 dark:text-slate-200"
                    />
                </div>

                {/* Conversations Section */}
                <div className="flex-1 overflow-y-auto">
                    {sortedConversations.map((conversation) => (
                        <ConversationItem
                            key={`${
                                conversation.is_group ? "group_" : "user_"
                            }${conversation.id}`}
                            conversation={conversation}
                            online={!!isOnlineUser(conversation.id)}
                            selectedConversation={selectedConversation}
                        />
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default ChatLayout;
