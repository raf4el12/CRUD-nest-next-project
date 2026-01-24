export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-8">
            <div className="w-full max-w-5xl">
                {children}
            </div>
        </div>
    );
}
