import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="app-shell">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </>
  );
}
