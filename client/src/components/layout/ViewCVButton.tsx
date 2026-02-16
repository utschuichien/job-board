import { Download, Eye } from "lucide-react";
const ViewCVButton = ({ cvUrl }: { cvUrl: string }) => {
    const isPdf = cvUrl.toLowerCase().endsWith('.pdf');

    if (isPdf) {
        return (
            <a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
            >
                <Eye size={16} /> Xem CV (PDF)
            </a>
        );
    }

    // Nếu là file Word (doc, docx), dùng Google Docs Viewer để xem online
    return (
        <div className="flex gap-2 items-center">
            <a
                href={`https://docs.google.com/gview?url=${cvUrl}&embedded=true`}
                target="_blank"
                rel="noreferrer"
                className="text-green-600 hover:underline flex items-center gap-1"
            >
                <Eye size={16} /> Xem Online
            </a>
            <a href={cvUrl} download className="text-gray-500 hover:text-gray-700" title="Tải về">
                <Download size={16} />
            </a>
        </div>
    );
};

export default ViewCVButton;
