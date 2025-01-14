interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div>
            <main className="min-h-screen bg-[#E9F1F799]">{children}</main>
        </div>
    );
}
