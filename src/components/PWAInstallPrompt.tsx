
import React, { useEffect, useState, useCallback } from "react";
import { toast, useToast } from "@/hooks/use-toast";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const isStandalone = (): boolean => {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // @ts-expect-error apple
    window.navigator.standalone === true
  );
};

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [shown, setShown] = useState(false);
  const { dismiss } = useToast();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShown(true);
    };

    window.addEventListener("beforeinstallprompt", handler as any);

    if (isStandalone()) {
      setShown(false);
    }

    return () =>
      window.removeEventListener("beforeinstallprompt", handler as any);
  }, []);

  useEffect(() => {
    if (isStandalone()) {
      setShown(false);
    }
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    // @ts-ignore
    deferredPrompt.prompt();
    // @ts-ignore
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult && choiceResult.outcome === "accepted") {
      toast({
        title: "App installed!",
        description: "You can now launch AnyHire from your home screen.",
      });
      setShown(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  useEffect(() => {
    if (shown && deferredPrompt) {
      const { id } = toast({
        title: "Install AnyHire App",
        description: (
          <div className="flex flex-col gap-2">
            <span>
              Add AnyHire to your home screen for a faster experience.
            </span>
            <div className="flex gap-2">
              <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => {
                  handleInstall();
                  dismiss(id);
                }}>
                <Download className="w-4 h-4 mr-1" /> Install App
              </Button>
              <Button size="sm" variant="ghost" onClick={() => dismiss(id)}>
                <X className="w-4 h-4" /> Dismiss
              </Button>
            </div>
          </div>
        ),
        duration: 12000,
      });
    }
  }, [shown, deferredPrompt, handleInstall, dismiss]);

  useEffect(() => {
    const isIOS =
      /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
      !("MSStream" in window) &&
      !isStandalone();
    if (isIOS) {
      toast({
        title: "Add to Home Screen",
        description: (
          <div>
            <span>
              To install AnyHire, tap the <span className="font-bold">Share</span> icon
              <svg
                className="inline mx-1"
                height="16"
                width="16"
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <path d="M336 80c0-13.3-10.7-24-24-24H200c-13.3 0-24 10.7-24 24v72H112c-13.3 0-24 10.7-24 24v280c0 13.3 
                10.7 24 24 24h288c13.3 0 24-10.7 24-24V176c0-13.3-10.7-24-24-24h-64V80zM256 392c-35.3 0-64-28.7-64-64
                s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64zm120-160h-24V80c0-39.8-32.2-72-72-72H200c-39.8 0-72 32.2-72 72
                v152h-24c-13.3 0-24 10.7-24 24v280c0 13.3 10.7 24 24 24h288c13.3 0 24-10.7 24-24V216c0-13.3-10.7-24-24-24z"/>
              </svg>
              , then choose <span className="font-bold">Add to Home Screen</span>.
            </span>
          </div>
        ),
        duration: 12000,
      });
    }
  }, []);

  return null;
};

export default PWAInstallPrompt;
