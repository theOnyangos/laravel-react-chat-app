import ChatLayout from "@/Layouts/ChatLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

function Dashboard({ auth }) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="">Messages</div>
        </>
    );
}

Dashboard.layout = (page) => (
    <AuthenticatedLayout children={page.props.auth.user}>
        <ChatLayout children={page} />
    </AuthenticatedLayout>
);

export default Dashboard;
