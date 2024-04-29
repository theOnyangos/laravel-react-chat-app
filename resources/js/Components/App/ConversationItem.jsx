import React from "react";
import { Link, usePage } from "@inertiajs/react";
import UseAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import UserOptionsDropdown from "./UserOptionsDropdown";

const ConversationItem = ({
    conversation,
    selectedConversation = null,
    online = null,
}) => {
    const page = usePage();
    const currentUser = page.props.auth.user;
    let classes = "border-transparent";

    if (selectedConversation) {
        // Check if the user is the owner of the conversation
        if (
            !selectedConversation.is_group &&
            !conversation.is_group &&
            selectedConversation.id == conversation.id
        ) {
            classes = "border-blue-500 bg-black/20";
        }

        // Check if the user is the owner of the group
        if (
            selectedConversation.is_group &&
            conversation.is_group &&
            selectedConversation.id == conversation.id
        ) {
            classes = "border-blue-500 bg-black/20";
        }
    }

    return (
        <Link
            href={
                conversation.is_group
                    ? route("chat.group", conversation)
                    : route("chat.user", conversation)
            }
            preserveState
            className={`conversation-item flex items-center gap-2 p-2 text-gray-300 transition-all border-l-4 cursor-pointer hover:bg-black/20 hover:text-white ${classes} ${
                conversation.is_user && currentUser.is_admin ? "pr-2" : "pr-4"
            }`}
        >
            {conversation.is_user && (
                <UseAvatar
                    user={conversation}
                    online={online}
                    className="w-10 h-10 rounded-full"
                />
            )}

            {conversation.is_group && (
                <GroupAvatar
                    group={conversation}
                    className="w-10 h-10 rounded-full"
                />
            )}

            <div
                className={`flex-1 text-xs max-w-full overflow-hidden ${
                    conversation.is_user && conversation.blocked_at
                        ? "opacity-50"
                        : ""
                }`}
            >
                <div className="flex justify-between items-center gap-1">
                    <span className="font-semibold text-sm overflow-hidden text-nowrap text-ellipsis">
                        {conversation.name}
                    </span>

                    {conversation.last_message_date && (
                        <span className="text-nowrap">
                            {conversation.last_message_date}
                        </span>
                    )}
                </div>
                {conversation.last_message && (
                    <p className="text-xs text-nowrap overflow-hidden text-ellipsis">
                        {conversation.last_message}
                    </p>
                )}
            </div>
            {currentUser.is_admin && conversation.is_user && (
                <UserOptionsDropdown conversation={conversation} />
            )}
        </Link>
    );
};

export default ConversationItem;
