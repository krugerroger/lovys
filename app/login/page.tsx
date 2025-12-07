"use client";
import RegistrationPopup from "@/components/RegistrationPopup";
import { useState } from "react";


export default function LoginPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <RegistrationPopup isOpen={isOpen} setIsOpen={setIsOpen} />
  );
}