import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { Locale, getLocale, setLocale, t } from "./i18n";

// ─── Types ────────────────────────────────────────────────────────────────────
type LocaleT = Locale;
const LOCALES: LocaleT[] = ["ru", "en", "uz"];

// ─── Hook: count-up анимация при появлении в viewport ────────────────────────
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const elRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutQuart
            const ease = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, elRef };
}

// ─── Hook: fade-in при появлении в viewport ──────────────────────────────────
function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({
  locale,
  onLocale,
}: {
  locale: LocaleT;
  onLocale: (l: LocaleT) => void;
}) {
  const loc = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Закрываем меню при смене роута
  useEffect(() => setMenuOpen(false), [loc.pathname]);

  const navLinks = [
    { to: "/", label: "Главная" },
    { to: "/services", label: "Услуги" },
    { to: "/portfolio", label: "Портфолио" },
    { to: "/about", label: "О нас" },
    { to: "/pricing", label: "Цены" },
    { to: "/contact", label: "Контакты" },
  ];

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>
      {/* Top bar */}
      <div className="header-top">
        <div className="container header-top-inner">
          <div className="header-top-left">
            <span>Пн–Пт 8:00–18:00 / Вс 8:00–14:00</span>
            <span>+7 (000) 458-0000</span>
            <span>ул. Оконная, 10</span>
          </div>
          <div className="header-top-right">
            {(["f", "tw", "in", "ig"] as const).map((s) => (
              <a key={s} href="#" aria-label={s}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="header-main">
        <div className="container header-inner">
          {/* Левая часть — только логотип */}
          <Link to="/" className="logo">W&amp;D</Link>

          {/* Правая часть — nav + lang + кнопка + бургер */}
          <div className="header-right">
            <nav className="nav">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} className={loc.pathname === to ? "active" : ""}>
                  {label}
                </Link>
              ))}
            </nav>
            <Link to="/request-quote" className="btn-quote">
              Оставить заявку
            </Link>
            <button
              className={`burger${menuOpen ? " burger--open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Меню"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <nav className={`mobile-nav${menuOpen ? " mobile-nav--open" : ""}`}>
        {navLinks.map(({ to, label }) => (
          <Link key={to} to={to} className={loc.pathname === to ? "active" : ""}>
            {label}
          </Link>
        ))}
        <Link to="/request-quote" className="btn-quote btn-quote--mobile">
          Оставить заявку
        </Link>
      </nav>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="hero-content container">
        <div className="hero-inner">
          <div className="hero-left animate-fade-up">
            <h1>
              Надёжность и Комфорт
              <br />
              для Вашего Дома
            </h1>
          </div>
          <div className="hero-right animate-fade-up animate-delay-1">
            <p>
              Профессиональная установка пластиковых и алюминиевых окон,
              дверей и балконного остекления. Замер, производство, монтаж под ключ.
            </p>
            <div className="hero-actions">
              <Link to="/services" className="btn btn-dark">Все окна</Link>
              <Link to="/portfolio" className="btn btn-outline-white">Все двери</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    cls: "doors",
    cat: "Лучший сервис",
    title: "Межкомнатные и входные двери",
    desc: "Профессиональная установка дверей с гарантией качества и надёжности.",
    icon: "🚪",
  },
  {
    cls: "windows",
    cat: "Лучший сервис",
    title: "Стильные и качественные окна",
    desc: "Энергоэффективные оконные конструкции для вашего дома и офиса.",
    icon: "🪟",
  },
  {
    cls: "parts",
    cat: "Лучший сервис",
    title: "Комплектующие и аксессуары",
    desc: "Широкий ассортимент фурнитуры и комплектующих для окон и дверей.",
    icon: "🔩",
  },
] as const;

function ServicesSection() {
  const { ref, visible } = useFadeIn();
  return (
    <section
      className={`section section-white${visible ? " in-view" : ""}`}
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="container">
        <div className="section-label centered">Премиум качество</div>
        <h2 className="section-title centered">
          Наши услуги делают вашу жизнь комфортнее
        </h2>
        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <div
              className="service-card"
              key={s.cls}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className={`service-card-img ${s.cls}`}>
                <span className="service-card-icon">{s.icon}</span>
              </div>
              <div className="service-card-info">
                <div className="service-card-cat">{s.cat}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <Link to="/services" className="arrow-btn" aria-label="Подробнее">
                  →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: 100, suffix: "+", label: "Офисов" },
  { value: 2548, suffix: "", label: "Довольных клиентов" },
  { value: 25, suffix: "+", label: "Лет опыта" },
  { value: 256, suffix: "", label: "Проектов" },
] as const;

function StatItem({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const { count, elRef } = useCountUp(value);
  return (
    <div className="stat-item" ref={elRef}>
      <div className="stat-value">
        {count}
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function StatsSection() {
  return (
    <div className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {STATS.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutSection() {
  const { ref, visible } = useFadeIn();
  return (
    <section
      className={`section section-bg${visible ? " in-view" : ""}`}
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="container">
        <div className="two-col">
          <div className="two-col-text">
            <div className="about-label">Деревянные двери</div>
            <h2 className="about-title">
              Производим и устанавливаем качественные двери
            </h2>
            <div className="about-subtitle">
              Работаем с деревянными и пластиковыми дверьми.
            </div>
            <p className="about-text">
              Более 25 лет мы занимаемся производством и установкой оконных и
              дверных конструкций. Работаем только с проверенными материалами,
              соблюдаем сроки и даём официальную гарантию на продукцию и монтаж.
            </p>
            <div className="about-actions">
              <Link to="/about" className="btn btn-accent">
                О нас
              </Link>
              <a href="tel:+78005554433" className="phone-link">
                <span className="phone-icon">📞</span>
                0 800 555 44 33
              </a>
            </div>
          </div>
          <div className="two-col-img">
            <div className="img-placeholder tall" />
            <div className="img-placeholder square" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CtaBanner() {
  return (
    <div className="cta-banner">
      <div className="container">
        <div className="cta-inner">
          <h2 className="cta-title">
            Запишитесь на бесплатную консультацию
            <br />
            по замене окон и дверей
          </h2>
          <div className="cta-actions">
            <Link to="/request-quote" className="btn btn-dark">
              Оставить заявку
            </Link>
            <Link to="/contact" className="btn btn-bordered-dark">
              Связаться с нами
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Portfolio ────────────────────────────────────────────────────────────────
const PORTFOLIO_ITEMS = [
  { cls: "p1", title: "Входная дверь", cat: "Качество" },
  { cls: "p2", title: "Застеклённая терраса", cat: "Качество" },
  { cls: "p3", title: "Офисные окна", cat: "Качество" },
  { cls: "p4", title: "Дверные ручки", cat: "Качество" },
] as const;

function PortfolioSection() {
  const { ref, visible } = useFadeIn();
  return (
    <section
      className={`section section-bg${visible ? " in-view" : ""}`}
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="container">
        <div className="portfolio-header">
          <div className="portfolio-header-text">
            <div className="section-label">Различные услуги</div>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Примеры работ
            </h2>
          </div>
          <p className="portfolio-header-desc">
            Выполняем проекты любой сложности — от стандартных квартирных окон
            до панорамного остекления коммерческих объектов.
          </p>
          <div className="portfolio-nav">
            <button className="portfolio-nav-btn" aria-label="Назад">
              ←
            </button>
            <button className="portfolio-nav-btn" aria-label="Вперёд">
              →
            </button>
          </div>
        </div>
        <div className="portfolio-grid">
          {PORTFOLIO_ITEMS.map((it, i) => (
            <div
              className="portfolio-card"
              key={it.cls}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`portfolio-card-img ${it.cls}`} />
              <div className="portfolio-card-info">
                <h4>{it.title}</h4>
                <p>{it.cat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Brands ───────────────────────────────────────────────────────────────────
const BRANDS = ["VEKA", "REHAU", "KBE", "Schüco"] as const;

function BrandsSection() {
  return (
    <section className="brands-section">
      <div className="container">
        <div className="brands-inner">
          <h3 className="brands-title">Работаем с лучшими брендами</h3>
          <div className="brands-list">
            {BRANDS.map((b) => (
              <a key={b} href="#" className="brand-item">
                {b}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
const BLOG_POSTS = [
  {
    cls: "b1",
    cat: "Ремонт",
    title: "Как выбрать правильную дверную ручку для входной двери?",
    date: "26 мар 2022",
  },
  {
    cls: "b2",
    cat: "Ремонт",
    title: "Как утеплить металлопластиковые окна и двери?",
    date: "25 мар 2022",
  },
  {
    cls: "b3",
    cat: "Ремонт",
    title: "Установка деревянных межкомнатных и входных дверей в доме",
    date: "24 мар 2022",
  },
] as const;

function BlogSection() {
  const { ref, visible } = useFadeIn();
  return (
    <section
      className={`section section-white${visible ? " in-view" : ""}`}
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="container">
        <div className="section-label centered">Наш блог</div>
        <h2 className="section-title centered">Последние статьи</h2>
        <div className="blog-grid">
          {BLOG_POSTS.map((p, i) => (
            <article
              className="blog-card"
              key={p.cls}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className={`blog-card-img ${p.cls}`} />
              <div className="blog-card-body">
                <div className="blog-card-cat">{p.cat}</div>
                <h3>
                  <a href="#">{p.title}</a>
                </h3>
                <div className="blog-card-meta">{p.date}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const REVIEWS = [
  {
    name: "Марина Хенслей",
    role: "Генеральный директор",
    text: "Отличная компания! Установили окна быстро и качественно. Очень довольна результатом.",
  },
  {
    name: "Мартин Флауэрс",
    role: "Бухгалтер",
    text: "Профессиональный подход, аккуратная работа. Рекомендую всем, кто ищет надёжного подрядчика.",
  },
  {
    name: "Барри Макбрайд",
    role: "Исполнительный директор",
    text: "Заменили все окна в офисе. Работа выполнена в срок, персонал вежливый и компетентный.",
  },
  {
    name: "Абнер Куинн",
    role: "Менеджер по продажам",
    text: "Очень доволен результатом. Цены разумные, всё сделали аккуратно и в срок.",
  },
  {
    name: "Флора Шепард",
    role: "Медицинский работник",
    text: "Быстро, качественно, без мусора после монтажа. Всем соседям уже порекомендовала!",
  },
] as const;

function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const visible = 3;
  const total = REVIEWS.length;

  const prev = () => setActive((v) => (v - 1 + total) % total);
  const next = () => setActive((v) => (v + 1) % total);

  // Показываем 3 карточки начиная с active (с wrap)
  const shown = Array.from({ length: visible }, (_, i) => REVIEWS[(active + i) % total]);

  return (
    <section className="testimonials-section section-bg">
      <div className="container">
        <div className="section-label centered">Отзывы клиентов</div>
        <h2 className="section-title centered">Что говорят о нас</h2>
        <div className="testimonials-grid">
          {shown.map((r) => (
            <div className="testimonial-card" key={r.name}>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">{r.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {r.name[0]}
                </div>
                <div>
                  <h4>{r.name}</h4>
                  <p>{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Dots + arrows */}
        <div className="testimonials-controls">
          <button className="portfolio-nav-btn" onClick={prev} aria-label="Назад">←</button>
          <div className="testimonials-dots">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                className={`dot${i === active ? " dot--active" : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Отзыв ${i + 1}`}
              />
            ))}
          </div>
          <button className="portfolio-nav-btn" onClick={next} aria-label="Вперёд">→</button>
        </div>
      </div>
    </section>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactSection() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-inner">
          <div className="contact-left">
            <div className="contact-label">Свяжитесь с нами</div>
            <h2 className="contact-title">
              Есть вопросы?
              <br />
              <span>Напишите нам!</span>
            </h2>
            <div className="contact-social">
              {["Facebook", "Twitter", "Instagram", "Dribbble"].map((s) => (
                <a key={s} href="#" aria-label={s}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          <div className="contact-right">
            {sent ? (
              <div className="form-success">
                ✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-field">
                    <input type="text" placeholder="Имя" required />
                  </div>
                  <div className="form-field">
                    <input type="text" placeholder="Фамилия" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <input type="email" placeholder="Email" required />
                  </div>
                  <div className="form-field">
                    <select defaultValue="">
                      <option value="" disabled>
                        Выберите регион
                      </option>
                      <option>Москва</option>
                      <option>Санкт-Петербург</option>
                      <option>Другой</option>
                    </select>
                  </div>
                </div>
                <div className="form-submit">
                  <button type="submit" className="btn-submit">
                    Отправить заявку
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const NAV = [
    { to: "/", label: "Главная" },
    { to: "/services", label: "Услуги" },
    { to: "/about", label: "О нас" },
    { to: "/portfolio", label: "Портфолио" },
    { to: "/contact", label: "Контакты" },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-col">
            <Link to="/" className="footer-logo">
              W&amp;D
            </Link>
            <p>Производим и устанавливаем окна и двери уже более 25 лет.</p>
          </div>
          <div className="footer-col">
            <h4>Офис</h4>
            <p>ул. Оконная, д. 10, г. Москва, 123456</p>
            <a href="mailto:info@wdcompany.ru">info@wdcompany.ru</a>
            <a href="tel:+78005554433">+7 (800) 555-44-33</a>
          </div>
          <div className="footer-col">
            <h4>Навигация</h4>
            {NAV.map(({ to, label }) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
          </div>
          <div className="footer-col">
            <h4>Подписка на новости</h4>
            <div className="footer-newsletter">
              <input type="email" placeholder="Ваш email" />
              <button type="button">Подписаться</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 W&amp;D. Все права защищены.</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────
function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <AboutSection />
      <CtaBanner />
      <PortfolioSection />
      <BrandsSection />
      <BlogSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export function App() {
  const [locale, setLocaleState] = useState<LocaleT>(getLocale());

  const handleLocale = (l: LocaleT) => {
    setLocale(l);
    setLocaleState(l);
  };

  return (
    <div className="page">
      <Header locale={locale} onLocale={handleLocale} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/services"
            element={
              <>
                <HeroSection />
                <ServicesSection />
              </>
            }
          />
          <Route
            path="/portfolio"
            element={
              <>
                <HeroSection />
                <PortfolioSection />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <HeroSection />
                <AboutSection />
                <StatsSection />
              </>
            }
          />
          <Route
            path="/pricing"
            element={
              <>
                <HeroSection />
                <CtaBanner />
              </>
            }
          />
          <Route path="/faq" element={<HeroSection />} />
          <Route
            path="/contact"
            element={
              <>
                <HeroSection />
                <ContactSection />
              </>
            }
          />
          <Route
            path="/request-quote"
            element={
              <>
                <HeroSection />
                <ContactSection />
              </>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}