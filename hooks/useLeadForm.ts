"use client";

import { useState, useCallback } from "react";
import { sendLead } from "@/lib/lead";

function isValidE164(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return phone.startsWith("+") && digits.length >= 10 && digits.length <= 15;
}

export interface UseLeadFormOptions {
  source: string;
  onSuccess?: () => void;
}

export type LeadFormStatus = "idle" | "loading" | "success" | "error";

export type ExtraLeadFields = {
  task?: string;
  need?: string;
  sphere?: string;
  niche?: string;
  timeline?: string;
  improve?: string;
  chaos?: string;
  _hp?: string;
  company?: string;
  sourcePage?: string;
};

export interface UseLeadFormReturn {
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  comment: string;
  setComment: (v: string) => void;
  status: LeadFormStatus;
  errorMessage: string;
  isValid: boolean;
  handleSubmit: (e: React.FormEvent, extra?: ExtraLeadFields) => Promise<void>;
  reset: () => void;
}

export function useLeadForm({
  source,
  onSuccess,
}: UseLeadFormOptions): UseLeadFormReturn {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<LeadFormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isValid =
    name.trim().length >= 2 &&
    phone.trim().length > 0 &&
    isValidE164(phone);

  const reset = useCallback(() => {
    setName("");
    setPhone("");
    setComment("");
    setStatus("idle");
    setErrorMessage("");
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent, extra?: ExtraLeadFields) => {
      e.preventDefault();
      if (!isValid || status === "loading") return;

      setStatus("loading");
      setErrorMessage("");

      const result = await sendLead({
        name: name.trim(),
        phone,
        source,
        sourcePage: extra?.sourcePage,
        comment: comment.trim() || undefined,
        ...extra,
      });

      if (result.ok) {
        setStatus("success");
        onSuccess?.();
      } else {
        setStatus("error");
        setErrorMessage(result.error);
      }
    },
    [name, phone, comment, source, isValid, status, onSuccess]
  );

  return {
    name,
    setName,
    phone,
    setPhone,
    comment,
    setComment,
    status,
    errorMessage,
    isValid,
    handleSubmit,
    reset,
  };
}
