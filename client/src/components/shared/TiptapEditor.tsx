import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Undo, Redo } from 'lucide-react';

interface TiptapProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}


const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;
    const Button = ({ onClick, isActive, icon: Icon, title }: any) => (
        <button
            type="button" 
            onClick={onClick}
            className={`p-2 rounded hover:bg-gray-100 transition-colors ${
                isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
            title={title}
        >
            <Icon size={18} />
        </button>
    );

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                icon={Bold}
                title="Bôi đậm"
            />
            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                icon={Italic}
                title="In nghiêng"
            />
            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div> {/* Dải ngăn cách */}
            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                icon={Heading2}
                title="Tiêu đề"
            />
            <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                icon={List}
                title="Danh sách"
            />
            <Button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                icon={ListOrdered}
                title="Danh sách số"
            />
            <Button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                icon={Quote}
                title="Trích dẫn"
            />
            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
            <Button
                onClick={() => editor.chain().focus().undo().run()}
                icon={Undo}
                title="Hoàn tác"
            />
            <Button
                onClick={() => editor.chain().focus().redo().run()}
                icon={Redo}
                title="Làm lại"
            />
        </div>
    );
};

// 2. Component chính
const TiptapEditor = ({ value, onChange, error }: TiptapProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Mô tả chi tiết công việc (Yêu cầu, quyền lợi...)...',
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                // Class của Tailwind cho vùng nhập liệu
                class: 'prose prose-sm sm:prose max-w-none focus:outline-none min-h-[200px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            // Khi gõ, trả HTML về cho form
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="mb-4">
            <div
                className={`border rounded-lg bg-white overflow-hidden ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
            >
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default TiptapEditor;
