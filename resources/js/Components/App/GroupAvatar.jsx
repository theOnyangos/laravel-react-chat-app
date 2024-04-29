import React from "react";
import { UsersIcon } from "@heroicons/react/24/solid";

const GroupAvatar = () => {
    return (
        <div>
            <div className={`avatar placeholder`}>
                <div className={`bg-gray-400 text-gray-800 rounded-full w-8`}>
                    <span className="text-xl">
                        <UsersIcon className="h-6 w-6" />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default GroupAvatar;
