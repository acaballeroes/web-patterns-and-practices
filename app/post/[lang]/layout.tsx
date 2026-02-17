import { LanguageSwitcher } from "@/components/language-switcher";

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="fixed top-20 right-6 z-40">
        <LanguageSwitcher />
      </div>
      {children}
    </div>
  );
}
