"use client";

import Image from "next/image";
import { useState } from "react";

const BOOKING_URL = "https://agendeonline.salonsoft.com.br/labarbear";
const WHATSAPP_URL =
  "https://wa.me/5511966428423?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20um%20hor%C3%A1rio%20na%20La%20Barbearia.";

const navigation = [
  { label: "A casa", href: "#a-casa" },
  { label: "A fachada", href: "#unidade" },
  { label: "Serviços", href: "#servicos" },
  { label: "Profissionais", href: "#profissionais" },
  { label: "Instagram", href: "#instagram" },
];

function HeaderArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M5 15 15 5M6 5h9v9" />
    </svg>
  );
}

export function SiteHeader({ logo }: { logo?: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a
          className="header-brand"
          href="#inicio"
          aria-label="La Barbearia — página inicial"
          onClick={() => setMenuOpen(false)}
        >
          <span className="header-emblem">
            {logo ? (
              <Image
                src={logo}
                alt="Emblema da La Barbearia"
                width={48}
                height={48}
                sizes="48px"
                className="header-logo"
              />
            ) : (
              <span className="header-monogram" aria-hidden="true">LB</span>
            )}
          </span>
          <span className="header-wordmark">
            <strong>LA</strong>
            <small>BARBEARIA</small>
          </span>
        </a>

        <nav
          className={`main-nav${menuOpen ? " main-nav-open" : ""}`}
          aria-label="Navegação principal"
          id="main-navigation"
        >
          {navigation.map((item) => (
            <a
              href={item.href}
              key={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a
            className="header-booking"
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Agendar horário
            <HeaderArrow />
          </a>
          <a
            className="header-whatsapp"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar com a La Barbearia pelo WhatsApp"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2l-4.2 1.1 1.1-4.1a8.2 8.2 0 1 1 15.2-4.2Z" />
              <path d="M8.6 8.1c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.5.6c-.2.2-.2.4 0 .7.4.7 1.1 1.4 1.9 1.9.3.2.5.2.7-.1l.7-.8c.2-.2.4-.3.6-.2l1.7.8c.3.1.4.3.4.5 0 .3-.1 1.3-.7 1.8-.5.5-1.1.7-1.8.7-.5 0-1.2-.2-2-.6a9.7 9.7 0 0 1-3.7-3.2c-.7-.9-1.1-1.9-1.1-2.7 0-.8.4-1.4.7-1.7Z" />
            </svg>
          </a>
          <button
            className={`menu-toggle${menuOpen ? " menu-toggle-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
