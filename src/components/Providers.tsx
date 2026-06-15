"use client";

import { FloatingControls } from "@/components/FloatingControls";
import { LanguageGate } from "@/components/LanguageGate";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LanguageGate>
          {children}
          <FloatingControls />
        </LanguageGate>
      </LanguageProvider>
    </ThemeProvider>
  );
}
