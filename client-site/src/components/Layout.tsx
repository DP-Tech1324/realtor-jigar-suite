// src/components/Layout.tsx
import TaglineBar from "./TaglineBar";
import AgentBar from "./AgentBar";
import ClassicNavbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TaglineBar />
      <AgentBar />
      <ClassicNavbar />
     <main>{children}</main>
      {/* ^^^ adjusts top padding for tagline+agentbar+navbar heights */}
    </div>
  );
}
