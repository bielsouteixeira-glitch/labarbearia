import Image from "next/image";
import { SiteHeader } from "../components/site-header";

const BOOKING_URL = "https://agendeonline.salonsoft.com.br/labarbear";
const INSTAGRAM_URL = "https://www.instagram.com/Labarbeariabarber/";
const WHATSAPP_URL =
  "https://wa.me/5511966428423?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20um%20hor%C3%A1rio%20na%20La%20Barbearia.";
const SALONSOFT_DATA_URL =
  "https://www.salonsoftware.com.br/api/agendamentoonline/get_inicial_online/labarbear";

const LOGO_URL = "/images/la-barbearia/logo-la-barbearia.png";

const PROFESSIONAL_PHOTOS: Record<string, string> = {
  "285938": "/images/la-barbearia/profissional-1.jpg",
  "327290": "/images/la-barbearia/profissional-2.jpg",
};

type SalonSoftService = {
  id_service: string;
  name: string;
  price: string;
  duration: string;
};

type SalonSoftProvider = {
  id_provider: string;
  name: string;
  foto_perfil?: string;
  habilitado_agendamento_online?: string;
};

type SalonSoftResponse = {
  logo?: string;
  services?: SalonSoftService[];
  providers?: SalonSoftProvider[];
};

async function getOfficialSalonData(): Promise<SalonSoftResponse | null> {
  try {
    const response = await fetch(SALONSOFT_DATA_URL, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(6500),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as SalonSoftResponse;
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}

const SERVICE_LABELS: Record<string, string> = {
  corte: "Corte",
  barba: "Barba",
  botox: "Botox",
  luzes: "Luzes",
  pezinho: "Pezinho",
  relaxamento: "Relaxamento",
  "corte/barba": "Corte + barba",
  "corte+penteado": "Corte + penteado",
  "corte+sobrancelha": "Corte + sobrancelha",
  "corte/botox": "Corte + botox",
  "corte/luzes": "Corte + luzes",
};

const SERVICE_ORDER = [
  "corte",
  "barba",
  "corte/barba",
  "corte+penteado",
  "corte+sobrancelha",
  "pezinho",
  "luzes",
  "botox",
  "corte/botox",
  "corte/luzes",
  "relaxamento",
];

function serviceKey(name: string) {
  return name.toLocaleLowerCase("pt-BR").replace(/\s/g, "");
}

function serviceLabel(name: string) {
  const key = serviceKey(name);
  return (
    SERVICE_LABELS[key] ??
    `${name.trim().charAt(0).toLocaleUpperCase("pt-BR")}${name.trim().slice(1)}`
  );
}

function formatPrice(price: string) {
  const amount = Number(price);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

function formatName(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => `${part.charAt(0).toLocaleUpperCase("pt-BR")}${part.slice(1)}`)
    .join(" ");
}

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`icon ${className}`}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M5 15 15 5M6 5h9v9" />
    </svg>
  );
}

function ArrowDown({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`icon ${className}`}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M10 3v13m0 0 5-5m-5 5-5-5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.25" />
      <path d="M10 5.8v4.6l3.1 1.8" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="none">
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle className="icon-dot" cx="17.5" cy="6.8" r="1.1" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="none">
      <path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2l-4.2 1.1 1.1-4.1a8.2 8.2 0 1 1 15.2-4.2Z" />
      <path d="M8.6 8.1c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.5.6c-.2.2-.2.4 0 .7.4.7 1.1 1.4 1.9 1.9.3.2.5.2.7-.1l.7-.8c.2-.2.4-.3.6-.2l1.7.8c.3.1.4.3.4.5 0 .3-.1 1.3-.7 1.8-.5.5-1.1.7-1.8.7-.5 0-1.2-.2-2-.6a9.7 9.7 0 0 1-3.7-3.2c-.7-.9-1.1-1.9-1.1-2.7 0-.8.4-1.4.7-1.7Z" />
    </svg>
  );
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: "La Barbearia",
  telephone: "+5511966428423",
  foundingDate: "2021",
  sameAs: [INSTAGRAM_URL],
  description:
    "Barbearia com serviços e agendamento online pela plataforma oficial Salonsoft.",
};

export default async function HomePage() {
  const salonData = await getOfficialSalonData();
  const logo = LOGO_URL;

  const servicePriority = new Map(
    SERVICE_ORDER.map((key, index) => [key, index]),
  );
  const services = (salonData?.services ?? [])
    .filter((service) => {
      const price = Number(service.price);
      const duration = Number(service.duration);
      return (
        Boolean(service.name?.trim()) &&
        serviceKey(service.name) !== "alfredo" &&
        Number.isFinite(price) &&
        price > 0 &&
        Number.isFinite(duration) &&
        duration > 0 &&
        duration <= 240
      );
    })
    .sort((first, second) => {
      const firstRank = servicePriority.get(serviceKey(first.name)) ?? 99;
      const secondRank = servicePriority.get(serviceKey(second.name)) ?? 99;
      return firstRank - secondRank;
    });
  const professionals = (salonData?.providers ?? []).filter(
    (provider) => provider.habilitado_agendamento_online === "sim",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader logo={logo ?? null} />

      <main id="inicio">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-glow hero-glow-blue" aria-hidden="true" />
          <div className="hero-glow hero-glow-red" aria-hidden="true" />

          <div className="container hero-layout">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">
                <span className="eyebrow-dot" />
                LA BARBEARIA
                <span className="eyebrow-divider" />
                EST. 2021
              </p>
              <h1 id="hero-title" className="hero-title">
                Seu corte.
                <br />
                <span>Sua assinatura.</span>
              </h1>
              <p className="hero-description">
                Corte, barba e cuidado no seu ritmo. Escolha o serviço e
                consulte a agenda oficial da La Barbearia.
              </p>

              <div className="hero-actions">
                <a
                  className="button button-primary"
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Agendar meu horário
                  <ArrowUpRight />
                </a>
                <a
                  className="button button-whatsapp"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  Falar pelo WhatsApp
                </a>
              </div>
              <a className="hero-text-link hero-services-link" href="#servicos">
                Conheça os serviços
                <ArrowDown />
              </a>

              <div className="hero-note">
                <span className="hero-note-index">01</span>
                <span className="hero-note-rule" />
                <span className="hero-note-copy">
                  <strong>Agenda oficial</strong>
                  <small>Horários e valores no Salonsoft</small>
                </span>
              </div>
            </div>

            <div className="hero-visual" aria-label="Identidade visual da La Barbearia">
              <div className="hero-orbit hero-orbit-outer" aria-hidden="true" />
              <div className="hero-orbit hero-orbit-inner" aria-hidden="true" />
              <span className="hero-visual-marker marker-top" aria-hidden="true">
                LB / 21
              </span>
              <div className="hero-seal">
                {logo ? (
                  <Image
                    src={logo}
                    alt="Emblema oficial da La Barbearia"
                    fill
                    priority
                    sizes="(max-width: 760px) 72vw, 40vw"
                    className="hero-seal-image"
                  />
                ) : (
                  <div className="seal-fallback" aria-label="La Barbearia">
                    <span>LA</span>
                    <small>BARBEARIA</small>
                    <i>EST. 2021</i>
                  </div>
                )}
              </div>
              <span className="hero-visual-marker marker-bottom" aria-hidden="true">
                BARBER SHOP · DESDE 2021
              </span>
              <div className="hero-stamp" aria-hidden="true">
                <span className="hero-stamp-small">UMA MARCA</span>
                <strong>COM<br />PRESENÇA</strong>
                <span className="hero-stamp-line" />
              </div>
              <span className="hero-side-caption" aria-hidden="true">
                ESTD. MMXXI
              </span>
            </div>
          </div>

          <div className="container hero-bottomline" aria-label="Navegação da página">
            <span>IDENTIDADE · CORTE · CUIDADO</span>
            <a href="#a-casa">
              Explore a La Barbearia
              <ArrowDown />
            </a>
          </div>
        </section>

        <section className="story-section" id="a-casa" aria-labelledby="story-title">
          <div className="container story-layout">
            <div className="story-art">
              <Image
                src="/images/la-barbearia/interior-la-barbearia.jpeg"
                alt="Interior real da La Barbearia, visto através da fachada envidraçada."
                fill
                sizes="(max-width: 760px) 92vw, 43vw"
                className="story-photo-image"
              />
              <div className="story-photo-shade" aria-hidden="true" />
              <p className="story-art-topline">LA BARBEARIA <span>—</span> POR DENTRO</p>
              <div className="story-art-bottom">
                <span>EST. 2021</span>
                <strong>ESPAÇO, LUZ<br />E IDENTIDADE.</strong>
              </div>
            </div>

            <div className="story-copy">
              <p className="section-kicker">
                <span>01</span> A CASA
              </p>
              <h2 id="story-title">
                Preto por fora.
                <br />
                <em>Luz por dentro.</em>
              </h2>
              <p className="story-description">
                A fachada preta e envidraçada se abre para um salão claro, com
                cadeiras de corte, iluminação e detalhes que dão personalidade
                à casa. A identidade da La Barbearia vive nesse contraste:
                presença urbana do lado de fora, cuidado no espaço de dentro.
              </p>
              <a
                className="inline-link"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Veja o perfil oficial
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>

        <section className="facade-section" id="unidade" aria-labelledby="facade-title">
          <div className="container facade-layout">
            <div className="facade-composition">
              <figure className="facade-photo-main">
                <Image
                  src="/images/la-barbearia/fachada-la-barbearia.jpeg"
                  alt="Fachada real da La Barbearia, fotografada durante o dia."
                  fill
                  sizes="(max-width: 760px) 92vw, (max-width: 1100px) 46vw, 38vw"
                  className="facade-photo-image"
                />
                <span className="facade-photo-index">LB / 21</span>
                <span className="facade-photo-caption">A FACHADA DA LA</span>
              </figure>
              <figure className="facade-photo-detail">
                <Image
                  src="/images/la-barbearia/fachada-detalhe.jpeg"
                  alt="Outra fotografia original enviada para apresentar a La Barbearia."
                  fill
                  sizes="(max-width: 760px) 38vw, 18vw"
                  className="facade-photo-image"
                />
              </figure>
              <span className="facade-photo-note">FOTOGRAFIAS ORIGINAIS · LA BARBEARIA</span>
            </div>

            <div className="facade-copy">
              <p className="section-kicker">
                <span>02</span> A UNIDADE
              </p>
              <h2 id="facade-title">
                A fachada dá o tom.
                <br />
                <em>O espaço recebe.</em>
              </h2>
              <p className="facade-description">
                A identidade escura da fachada, a entrada envidraçada e o salão
                iluminado fazem parte da La Barbearia real — o espaço onde
                começa cada experiência.
              </p>
              <div className="facade-contact">
                <span>FALE DIRETO COM A CASA</span>
                <a href="tel:+5511966428423">(11) 96642-8423</a>
              </div>
              <div className="facade-actions">
                <a
                  className="button button-primary"
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Agendar horário
                  <ArrowUpRight />
                </a>
                <a
                  className="button button-whatsapp"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  Falar pelo WhatsApp
                </a>
              </div>
              <p className="facade-location-note">
                Para confirmar como chegar, fale com a equipe pelo WhatsApp.
              </p>
            </div>
          </div>
        </section>

        <section className="services-section" id="servicos" aria-labelledby="services-title">
          <div className="container">
            <div className="section-heading section-heading-dark">
              <div>
                <p className="section-kicker section-kicker-light">
                  <span>03</span> SERVIÇOS
                </p>
                <h2 id="services-title">
                  Escolha o seu
                  <br />
                  <em>próximo cuidado.</em>
                </h2>
              </div>
              <p className="section-heading-note">
                Serviços, valores e duração consultados na agenda oficial. Cada
                agendamento continua no Salonsoft.
              </p>
            </div>

            {services.length > 0 ? (
              <div className="services-grid">
                {services.map((service, index) => {
                  const duration = Number(service.duration);
                  const label = serviceLabel(service.name);
                  return (
                    <article
                      className={`service-card${index < 3 ? " service-card-featured" : ""}`}
                      key={service.id_service}
                    >
                      <div className="service-card-top">
                        <span className="service-index">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="service-index-line" />
                        <span className="service-index-dot" />
                      </div>
                      <h3>{label}</h3>
                      <div className="service-details">
                        <span className="service-duration">
                          <ClockIcon />
                          {duration} min
                        </span>
                        <strong>{formatPrice(service.price)}</strong>
                      </div>
                      <a
                        className="service-select"
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Agendar ${label} na agenda oficial`}
                      >
                        <span>Agendar serviço</span>
                        <ArrowUpRight />
                      </a>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="services-unavailable">
                <span className="service-index">AGENDA ONLINE</span>
                <p>
                  Consulte os serviços e valores atualizados diretamente na
                  agenda oficial da La Barbearia.
                </p>
                <a
                  className="button button-primary"
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir agendamento
                  <ArrowUpRight />
                </a>
              </div>
            )}

            {services.length > 0 && (
              <p className="service-disclaimer">
                Valores e durações conforme a agenda oficial consultada. Confirme
                os detalhes e a disponibilidade no momento de agendar.
              </p>
            )}

            <div className="services-footer-cta">
              <span>Pronto para escolher seu horário?</span>
              <a
                className="inline-link inline-link-light"
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver agenda completa
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>

        <section className="portfolio-section" id="galeria" aria-labelledby="portfolio-title">
          <div className="container">
            <div className="portfolio-heading">
              <div>
                <p className="section-kicker">
                  <span>04</span> REGISTROS DA CASA
                </p>
                <h2 id="portfolio-title">
                  A La, em
                  <br />
                  <em>detalhes reais.</em>
                </h2>
              </div>
              <div className="portfolio-heading-side">
                <p>
                  Fotos e vídeo do acervo enviado pela La Barbearia, em
                  diferentes enquadramentos — sem substituir a casa por imagens
                  genéricas.
                </p>
                <a
                  className="inline-link"
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Acompanhar no Instagram
                  <ArrowUpRight />
                </a>
              </div>
            </div>

            <div className="portfolio-grid">
              <figure className="portfolio-card portfolio-card-main">
                <Image
                  src="/images/la-barbearia/registro-01.jpg"
                  alt="Registro fotográfico do acervo oficial da La Barbearia, imagem 01."
                  fill
                  sizes="(max-width: 760px) 92vw, 40vw"
                  className="portfolio-image"
                />
                <figcaption>
                  <span>01</span>
                  <strong>LA BARBEARIA</strong>
                </figcaption>
              </figure>
              <figure className="portfolio-card portfolio-card-square">
                <Image
                  src="/images/la-barbearia/registro-02.webp"
                  alt="Registro fotográfico do acervo oficial da La Barbearia, imagem 02."
                  fill
                  sizes="(max-width: 760px) 46vw, 24vw"
                  className="portfolio-image"
                />
                <figcaption>
                  <span>02</span>
                  <strong>IDENTIDADE</strong>
                </figcaption>
              </figure>
              <figure className="portfolio-card portfolio-card-wide">
                <Image
                  src="/images/la-barbearia/registro-03.jpg"
                  alt="Registro fotográfico do acervo oficial da La Barbearia, imagem 03."
                  fill
                  sizes="(max-width: 760px) 46vw, 31vw"
                  className="portfolio-image"
                />
                <figcaption>
                  <span>03</span>
                  <strong>ACERVO DA CASA</strong>
                </figcaption>
              </figure>
              <figure className="portfolio-card portfolio-card-detail">
                <Image
                  src="/images/la-barbearia/registro-04.webp"
                  alt="Registro fotográfico do acervo oficial da La Barbearia, imagem 04."
                  fill
                  sizes="(max-width: 760px) 46vw, 24vw"
                  className="portfolio-image"
                />
                <figcaption>
                  <span>04</span>
                  <strong>DETALHES</strong>
                </figcaption>
              </figure>
              <figure className="portfolio-card portfolio-card-video">
                <video
                  className="portfolio-video"
                  controls
                  playsInline
                  preload="none"
                  poster="/images/la-barbearia/video-experiencia-poster.jpg"
                  aria-label="Vídeo oficial da La Barbearia enviado pelo usuário"
                >
                  <source
                    src="/images/la-barbearia/experiencia-la-barbearia.mp4"
                    type="video/mp4"
                  />
                  Seu navegador não conseguiu reproduzir este vídeo.
                </video>
                <figcaption>
                  <span>05</span>
                  <strong>EM MOVIMENTO</strong>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="team-section" id="profissionais" aria-labelledby="team-title">
          <div className="container">
            <div className="team-heading">
              <div>
                <p className="section-kicker">
                  <span>05</span> PROFISSIONAIS
                </p>
                <h2 id="team-title">
                  Quem faz parte
                  <br />
                  <em>da sua experiência.</em>
                </h2>
              </div>
              <p>
                Perfis cadastrados na agenda oficial. Consulte a disponibilidade
                de cada profissional ao agendar.
              </p>
            </div>

            {professionals.length > 0 ? (
              <div className="team-grid">
                {professionals.map((professional, index) => {
                  const professionalPhoto =
                    PROFESSIONAL_PHOTOS[professional.id_provider];
                  return (
                    <article className="team-card" key={professional.id_provider}>
                    <div className="team-photo">
                      {professionalPhoto ? (
                        <Image
                          src={professionalPhoto}
                          alt={`Foto de ${formatName(professional.name)}, profissional da La Barbearia`}
                          fill
                          sizes="(max-width: 700px) 90vw, 42vw"
                          className="team-photo-image"
                        />
                      ) : (
                        <div className="team-photo-fallback" aria-hidden="true">
                          {formatName(professional.name)
                            .split(" ")
                            .map((part) => part.charAt(0))
                            .slice(0, 2)
                            .join("")}
                        </div>
                      )}
                      <span className="team-photo-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="team-photo-tag">NA AGENDA OFICIAL</span>
                    </div>
                    <div className="team-card-info">
                      <div>
                        <span className="team-role">PROFISSIONAL</span>
                        <h3>{formatName(professional.name)}</h3>
                      </div>
                      <a
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Consultar horários com ${formatName(professional.name)} no Salonsoft`}
                      >
                        <ArrowUpRight />
                      </a>
                    </div>
                    </article>
                  );
                  })}
              </div>
            ) : (
              <div className="team-empty">
                <p>Confira os profissionais e horários disponíveis na agenda oficial.</p>
                <a
                  className="inline-link"
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consultar agenda
                  <ArrowUpRight />
                </a>
              </div>
            )}
          </div>
        </section>

        <section className="instagram-section" id="instagram" aria-labelledby="instagram-title">
          <div className="container">
            <div className="instagram-panel">
              <div className="instagram-orbit" aria-hidden="true" />
              <div className="instagram-icon-wrap">
                <InstagramIcon />
              </div>
              <div className="instagram-copy">
                <p className="section-kicker section-kicker-light">
                  <span>06</span> ACOMPANHE
                </p>
                <h2 id="instagram-title">
                  A La, no seu
                  <br />
                  <em>dia a dia.</em>
                </h2>
              </div>
              <div className="instagram-action">
                <p>
                  Acompanhe o perfil oficial e veja as publicações direto na
                  origem.
                </p>
                <a
                  className="button button-outline"
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @Labarbeariabarber
                  <ArrowUpRight />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="booking-section" id="agendar" aria-labelledby="booking-title">
          <div className="container">
            <div className="booking-panel">
              <div className="booking-panel-orbit" aria-hidden="true" />
              <div className="booking-panel-content">
                <p className="section-kicker section-kicker-light">
                  <span>07</span> SEU PRÓXIMO HORÁRIO
                </p>
                <h2 id="booking-title">
                  Na hora certa.
                  <br />
                  <em>No seu estilo.</em>
                </h2>
              </div>
              <div className="booking-panel-action">
                <p>
                  Consulte serviços, valores e horários disponíveis no sistema
                  oficial de agendamento.
                </p>
                <a
                  className="button button-primary"
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Agendar agora
                  <ArrowUpRight />
                </a>
                <a
                  className="booking-whatsapp-link"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  Prefiro falar pelo WhatsApp
                  <ArrowUpRight />
                </a>
                <span className="booking-platform-note">AGENDAMENTO PELO SALONSOFT</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contato">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand-block">
              <a className="footer-brand" href="#inicio" aria-label="La Barbearia — início">
                {logo ? (
                  <Image
                    src={logo}
                    alt=""
                    width={58}
                    height={58}
                    sizes="58px"
                    className="footer-logo"
                  />
                ) : (
                  <span className="footer-monogram" aria-hidden="true">LB</span>
                )}
                <span className="footer-wordmark">
                  <strong>LA</strong>
                  <small>BARBEARIA</small>
                </span>
              </a>
              <p>
                Corte, barba e outros cuidados. Consulte a agenda oficial e
                escolha seu próximo horário.
              </p>
            </div>

            <div className="footer-column">
              <h2>Explore</h2>
              <a href="#a-casa">A casa</a>
              <a href="#servicos">Serviços</a>
              <a href="#profissionais">Profissionais</a>
            </div>

            <div className="footer-column">
              <h2>Conecte-se</h2>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                Instagram <ArrowUpRight />
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                Falar pelo WhatsApp <WhatsAppIcon />
              </a>
              <a href="tel:+5511966428423">(11) 96642-8423</a>
            </div>

            <div className="footer-column footer-booking-column">
              <h2>Agendamento</h2>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                Abrir agenda oficial <ArrowUpRight />
              </a>
              <span>Plataforma Salonsoft</span>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} La Barbearia</span>
            <span>EST. 2021</span>
            <a href="#inicio">
              Voltar ao topo
              <ArrowDown className="arrow-up" />
            </a>
          </div>
        </div>
      </footer>

      <nav className="mobile-action-bar" aria-label="Ações rápidas">
        <a
          className="mobile-booking-button"
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="mobile-booking-dot" />
          Agendar horário
          <ArrowUpRight />
        </a>
        <a
          className="mobile-whatsapp-button"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar pelo WhatsApp"
        >
          <WhatsAppIcon />
          <span>WhatsApp</span>
        </a>
      </nav>
    </>
  );
}
