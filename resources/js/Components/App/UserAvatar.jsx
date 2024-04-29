import React from "react";

const UserAvatar = ({ user, online = null, profile = false }) => {
    let onlineClass =
        online === true ? "online" : online === false ? "offline" : "";

    const sizeClasses = profile ? "w-40" : "w-8";

    return (
        <div>
            {user.avatar_url && (
                <div className={`chat-image avatar ${onlineClass}`}>
                    <div className={`rounded-full ${sizeClasses}`}>
                        <img
                            src={user.avatar_url}
                            alt={user.name}
                            className="object-cover rounded-full"
                        />
                    </div>
                </div>
            )}

            {!user.avatar_url && (
                <div className={`chat-image avatar placeholder ${onlineClass}`}>
                    <div
                        className={`bg-gray-400 text-gray-800 rounded-full ${sizeClasses}`}
                    >
                        <span className="text-xl">
                            {user.name ? user.name.substring(0, 1) : "U"}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAvatar;
