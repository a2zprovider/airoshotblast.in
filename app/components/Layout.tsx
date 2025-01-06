interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div>
            <main className="min-h-screen">{children}</main>
        </div>
    );
}
