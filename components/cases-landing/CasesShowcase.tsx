"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { CaseImage } from "@/components/ui/CaseImage";
import Link from "next/link";
import s from "@/app/cases/cases-landing.module.css";
import { FILTERS, getDisplayImages, type CaseItem } from "./cases-data";
import { GalleryLightbox } from "./GalleryLightbox";
import { TelegramLeadButton } from "@/components/cta/TelegramLeadButton";
import { FormStatus } from "@/components/forms/FormStatus";

const CONTACT_URL = "https://t.me/nikmorus";

function casesWithPhotos(cases: CaseItem[]) {
  return cases.filter((c) => c.images && c.images.length > 0);
}

/* ── KPI badge ── */
function KpiBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className={s.kpi}>
      <div className={s.kpiLabel}>{label}</div>
      <div className={s.kpiValue}>{value}</div>
    </div>
  );
}

/* ── Case actions (2 buttons) ── */
function CaseActions({ item, isDetail }: { item: CaseItem; isDetail?: boolean }) {
  const projectUrl = item.projectUrl || item.caseUrl || "";
  const hasProjectLink = /^https?:\/\//i.test(projectUrl);

  return (
    <div className={s.caseActions} role="group" aria-label="Действия по кейсу">
      {isDetail ? (
        <Link className={s.btn} href="/cases">
          К списку кейсов
        </Link>
      ) : (
        <Link className={`${s.btn} ${s.btnPrimary}`} href={`/cases/${item.slug}`} aria-label="Подробнее о кейсе">
          Подробнее о кейсе
        </Link>
      )}
      {hasProjectLink ? (
        <a className={s.btn} href={projectUrl} target="_blank" rel="noopener noreferrer" aria-label="Ссылка на проект">
          Ссылка на проект
        </a>
      ) : (
        <span className={`${s.btn} ${s.btnDisabled}`} aria-disabled="true" title="Скоро">
          Ссылка на проект <span className={s.caseSoon}>скоро</span>
        </span>
      )}
    </div>
  );
}

/* ── Single case card ── */
function CaseCard({
  item,
  index,
  onOpenGallery,
  onOpenDetail,
}: {
  item: CaseItem;
  index: number;
  onOpenGallery: (slug: string, idx: number) => void;
  onOpenDetail: (slug: string) => void;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const hasKpis = (item.kpis || []).length > 0;
  const displayImages = getDisplayImages(item);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add(s.caseCardVisible);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.14 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      el.style.setProperty("--rx", `${(0.5 - py) * 6}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * 7}deg`);
      el.style.setProperty("--mx", `${Math.round(px * 100)}%`);
      el.style.setProperty("--my", `${Math.round(py * 100)}%`);
    };
    const handleLeave = () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "50%");
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button") || target.closest(`.${s.caseActions}`)) return;
    if (target.closest("[data-gallery-shot]")) return;
    onOpenDetail(item.slug);
  };

  return (
    <article
      ref={cardRef}
      className={s.caseCard}
      style={{ "--stagger": index } as React.CSSProperties}
      data-category={item.filter}
      onClick={handleCardClick}
    >
      <div className={s.caseContent}>
        <div className={s.row}>
          <span className={s.badge}>{item.category}</span>
        </div>
        <h3 className={s.caseTitle}>{item.title}</h3>
        <p className={s.desc}>{item.summary}</p>

        <div className={s.meta}>
          <div className={s.metaItem}>
            <div className={s.metaLabel}>Цель</div>
            <div className={s.metaValue}>{item.goal}</div>
          </div>
          <div className={s.metaItem}>
            <div className={s.metaLabel}>Срок</div>
            <div className={s.metaValue}>{item.timeline}</div>
          </div>
        </div>

        {displayImages[0] && (
          <div
            className={s.shot}
            data-gallery-shot
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onOpenGallery(item.slug, 0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenGallery(item.slug, 0);
              }
            }}
            aria-label="Открыть галерею"
          >
            <CaseImage
              src={displayImages[0]}
              alt={`Скриншот: ${item.title}`}
              width={800}
              height={500}
              className="object-cover w-full h-full"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              loading="lazy"
            />
          </div>
        )}

        {hasKpis ? (
          <div className={s.kpis}>
            {item.kpis.slice(0, 3).map((kpi) => (
              <KpiBadge key={kpi.label} label={kpi.label} value={kpi.value} />
            ))}
          </div>
        ) : (
          <div className={s.metaItem} style={{ marginTop: 14 }}>
            <div className={s.metaLabel}>Статус</div>
            <div className={s.metaValue}>Кейс в разработке, показатели появятся после завершения этапа теста.</div>
          </div>
        )}

        <CaseActions item={item} />
      </div>
    </article>
  );
}

/* ── Case detail view (used on /cases/[slug] page) ── */
export function CaseDetailView({
  caseItem,
  onOpenGallery,
  cases,
}: {
  caseItem: CaseItem;
  onOpenGallery: (slug: string, idx: number) => void;
  cases: CaseItem[];
}) {
  const allCases = casesWithPhotos(cases);
  const caseIndex = allCases.findIndex((c) => c.slug === caseItem.slug);
  const prevCase = caseIndex > 0 ? allCases[caseIndex - 1] : null;
  const nextCase = caseIndex >= 0 && caseIndex < allCases.length - 1 ? allCases[caseIndex + 1] : null;
  const displayImages = getDisplayImages(caseItem);
  const hasKpis = (caseItem.kpis || []).length > 0;

  return (
    <>
      <section className={`${s.section} ${s.detailHero}`} id="top">
        <div className={`${s.heroCard} ${s.detailHeroCard}`}>
          <Link className={`${s.link} ${s.backLink}`} href="/cases">
            ← Вернуться ко всем кейсам
          </Link>
          <div className={s.row}>
            <span className={s.badge}>{caseItem.category}</span>
          </div>
          <h1 className={s.detailTitle}>{caseItem.title}</h1>
          <p>{caseItem.summary}</p>
          <div className={s.heroActions}>
            <CaseActions item={caseItem} isDetail />
          </div>
        </div>
      </section>

      <section className={s.section} style={{ padding: "20px 16px 8px" }}>
        <h2 className={s.sectionTitle}>Галерея</h2>
        <div className={s.detailMediaGrid}>
          {displayImages.map((src, idx) => (
            <div
              key={src}
              className={`${s.shot} ${s.shotDetail}`}
              data-gallery-shot
              role="button"
              tabIndex={0}
              onClick={() => onOpenGallery(caseItem.slug, idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpenGallery(caseItem.slug, idx);
                }
              }}
              aria-label={`Открыть фото ${idx + 1} из ${displayImages.length}`}
            >
              <CaseImage
                src={src}
                alt={`${caseItem.title} — фото ${idx + 1}`}
                width={800}
                height={500}
                className="object-cover w-full h-full"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <div className={s.detailTriplet}>
          <article className={s.trustCard}>
            <h3>Задача</h3>
            <p>{caseItem.problem}</p>
          </article>
          <article className={s.trustCard}>
            <h3>Решение</h3>
            <p>{caseItem.solution}</p>
          </article>
          <article className={s.trustCard}>
            <h3>Результат</h3>
            <p>{caseItem.result}</p>
          </article>
        </div>
      </section>

      <section className={s.section} style={{ paddingTop: 24 }}>
        <h2 className={s.sectionTitle}>KPI и показатели</h2>
        {hasKpis ? (
          <div className={s.detailKpiGrid}>
            {caseItem.kpis.map((kpi) => (
              <div key={kpi.label} className={`${s.kpi} ${kpi.tone === "secondary" ? s.kpiSecondary : ""}`}>
                <div className={s.kpiLabel}>{kpi.label}</div>
                <div className={s.kpiValue}>{kpi.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className={s.metaItem}>
            <div className={s.metaLabel}>Статус</div>
            <div className={s.metaValue}>Кейс находится в разработке. KPI появятся после релиза.</div>
          </div>
        )}
      </section>

      <section className={`${s.section} ${s.trust}`}>
        <article className={s.trustCard}>
          <h2 className={s.sectionTitle}>Стек / инструменты</h2>
          <div className={s.detailChipsWrap}>
            <div className={s.chips}>
              {caseItem.stack.map((tech) => (
                <span key={tech} className={s.chip}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </article>
        <article className={s.trustCard}>
          <h2 className={s.sectionTitle}>Что было сделано</h2>
          <ul className={s.list}>
            {caseItem.workDone.map((done) => (
              <li key={done}>{done}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className={`${s.section} ${s.work}`}>
        <h2 className={s.sectionTitle}>Процесс</h2>
        <div className={s.steps}>
          {caseItem.process.map((stage, idx) => (
            <article key={stage.step + idx} className={s.step}>
              <div className={s.stepIndex}>{idx + 1}</div>
              <h3>{stage.step}</h3>
              <p>
                <strong>{stage.time}</strong> · {stage.note}
              </p>
            </article>
          ))}
        </div>
      </section>

      <nav className={`${s.section} ${s.detailNav}`} aria-label="Навигация по кейсам">
        <Link className={`${s.btn} ${s.btnNav}`} href={prevCase ? `/cases/${prevCase.slug}` : "/cases"}>
          {prevCase ? "← Предыдущий кейс" : "← К списку"}
        </Link>
        <Link className={`${s.btn} ${s.btnNav}`} href="/cases">
          Вернуться ко всем кейсам
        </Link>
        <Link className={`${s.btn} ${s.btnNav}`} href={nextCase ? `/cases/${nextCase.slug}` : "/cases"}>
          {nextCase ? "Следующий кейс →" : "К списку →"}
        </Link>
      </nav>

      <CTAFormBlock />
    </>
  );
}

/* ── CTA form ── */
function CTAFormBlock() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const submittedRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submittedRef.current) return;
    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string)?.trim() || "";
    const contact = (fd.get("contact") as string)?.trim() || "";
    const message = (fd.get("message") as string)?.trim() || "";
    const company = (fd.get("company") as string)?.trim() || "";

    if (company) return;
    if (name.length < 2 || name.length > 60) {
      setFormState("error");
      setStatusMsg("Имя: от 2 до 60 символов.");
      return;
    }
    if (contact.length < 3 || contact.length > 80) {
      setFormState("error");
      setStatusMsg("Контакт: от 3 до 80 символов.");
      return;
    }
    if (message.length < 10 || message.length > 2000) {
      setFormState("error");
      setStatusMsg("Сообщение: от 10 до 2000 символов.");
      return;
    }

    submittedRef.current = true;
    setFormState("loading");
    setStatusMsg("");

    const { submitLead, collectUtm } = await import("@/lib/lead/submitLead");
    const result = await submitLead({
      name,
      contact,
      message,
      sourcePage: "/cases",
      formId: "cases_form",
      utm: collectUtm(),
    });
    if (result.ok) {
      setFormState("success");
      setStatusMsg("Заявка отправлена. Мы свяжемся в течение 24 часов.");
      submittedRef.current = false;
      (e.target as HTMLFormElement).reset();
    } else {
      submittedRef.current = false;
      setFormState("error");
      setStatusMsg(result.message);
    }
  };

  return (
    <section className={`${s.section} ${s.cta}`} id="cta">
      <div className={s.ctaWrap}>
        <div className={s.ctaGrid}>
          <div>
            <h2 className={s.sectionTitle}>Обсудим ваш кейс</h2>
            <p className={s.sectionSub}>Напишите задачу и контакт. Вернёмся с планом внедрения и сроками.</p>
            <form className={s.form} onSubmit={handleSubmit} noValidate>
              <div className={s.field}>
                <label htmlFor="cl-name">Имя</label>
                <input id="cl-name" name="name" type="text" placeholder="Как к вам обращаться" required minLength={2} maxLength={60} autoComplete="name" />
              </div>
              <div className={s.field}>
                <label htmlFor="cl-contact">Контакт</label>
                <input id="cl-contact" name="contact" type="text" placeholder="@telegram / телефон / email" required minLength={3} maxLength={80} autoComplete="tel" />
              </div>
              <div className={s.field}>
                <label htmlFor="cl-message">Сообщение</label>
                <textarea id="cl-message" name="message" rows={4} placeholder="Коротко о задаче" minLength={10} maxLength={2000} required />
              </div>
              <div className={s.fieldHp} aria-hidden="true">
                <label htmlFor="cl-company">Компания</label>
                <input id="cl-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <FormStatus
                variant={formState === "success" ? "success" : formState === "error" ? "error" : "idle"}
                message={statusMsg}
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" className={`${s.btn} ${s.btnPrimary} ${s.pulse} flex-1`} disabled={formState === "loading"}>
                  {formState === "loading" ? "Отправка…" : "Отправить заявку"}
                </button>
                <TelegramLeadButton location="cases-form" />
              </div>
              <p className={s.disclaimer}>Нажимая кнопку, вы соглашаетесь на обработку данных для обратной связи.</p>
            </form>
          </div>
          <aside className={s.contacts}>
            <h3>Контакты</h3>
            <p>
              <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </p>
            <p className={s.disclaimer}>Ответ обычно в течение рабочего дня.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ── Filter tabs ── */
function FilterTabs({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: string;
  onFilterChange: (id: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const updateIndicator = useCallback(() => {
    const wrap = wrapRef.current;
    const indicator = indicatorRef.current;
    if (!wrap || !indicator) return;
    const active = wrap.querySelector<HTMLButtonElement>("[data-active='true']");
    if (!active) return;
    const x = active.offsetLeft - 8;
    const w = active.offsetWidth;
    indicator.style.width = `${w}px`;
    indicator.style.transform = `translateX(${x}px)`;
  }, []);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeFilter, updateIndicator]);

  return (
    <section className={`${s.section} ${s.filters}`} aria-label="Фильтр кейсов">
      <div ref={wrapRef} className={s.filterWrap} role="tablist" aria-label="Категории кейсов">
        <span ref={indicatorRef} className={s.filterIndicator} aria-hidden="true" />
        {FILTERS.map((tab) => (
          <button
            key={tab.id}
            className={`${s.filterTab} ${activeFilter === tab.id ? s.filterTabActive : ""}`}
            data-active={activeFilter === tab.id ? "true" : undefined}
            type="button"
            role="tab"
            aria-selected={activeFilter === tab.id}
            onClick={() => onFilterChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </section>
  );
}

/* ── How we work ── */
function HowWeWork() {
  return (
    <section className={`${s.section} ${s.work}`} id="process">
      <h2 className={s.sectionTitle}>Как мы работаем</h2>
      <p className={s.sectionSub}>Короткий цикл от задачи до измеримого результата.</p>
      <div className={s.steps}>
        {[
          { title: "Бриф и приоритеты", desc: "Фиксируем цель, ограничения и ключевую метрику на запуск." },
          { title: "Прототип и дизайн-логика", desc: "Собираем flow, контент и экранные сценарии без перегруза." },
          { title: "Сборка и интеграции", desc: "Подключаем CRM, мессенджеры, аналитику и автоматизацию." },
          { title: "Запуск и handoff", desc: "Передаем доступы, инструкцию и даем поддержку на старте." },
        ].map((step, idx) => (
          <article key={step.title} className={s.step}>
            <div className={s.stepIndex}>{idx + 1}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── Trust block ── */
function TrustBlock() {
  return (
    <section className={`${s.section} ${s.trust}`}>
      <article className={s.trustCard}>
        <h2 className={s.sectionTitle}>Технологии и стек</h2>
        <p className={s.sectionSub}>Используем только то, что ускоряет запуск и управляемость.</p>
        <div className={s.chips}>
          {["n8n", "Telegram Bot API", "Mini Apps", "HTML/CSS/JS", "CRM (amo/Bitrix)", "Google Sheets", "Webhooks", "Analytics"].map((t) => (
            <span key={t} className={s.chip}>
              {t}
            </span>
          ))}
        </div>
      </article>
      <article className={s.trustCard}>
        <h2 className={s.sectionTitle}>Что вы получите</h2>
        <ul className={s.list}>
          <li>Рабочий инструмент под вашу задачу, а не шаблонную концепцию</li>
          <li>Понятные метрики результата: скорость, конверсия, CPL, SLA</li>
          <li>End-to-end процесс: лид → квалификация → CRM → статусы</li>
          <li>Документацию и handoff для команды после запуска</li>
        </ul>
      </article>
    </section>
  );
}

/* ── Hero ── */
function HeroSection() {
  return (
    <section className={`${s.section} ${s.hero}`} id="top">
      <div className={s.heroCard}>
        <span className={s.eyebrow}>Портфолио AI Delivery</span>
        <h1 className={s.heroTitle}>
          <span className={s.gradientText}>Кейсы</span> AI Delivery
        </h1>
        <p className={s.heroDesc}>
          Проектируем AI-инструменты, автоматизации и конвертящие страницы, которые дают понятный бизнес-эффект: больше квалифицированных лидов, быстрее обработка и меньше ручной рутины.
        </p>
        <div className={s.heroActions}>
          <a href="#cases" className={`${s.btn} ${s.btnPrimary}`}>
            Смотреть кейсы
          </a>
          <a href={CONTACT_URL} className={s.btn} target="_blank" rel="noopener noreferrer">
            Написать нам
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Main showcase component ── */
export function CasesShowcase({ cases }: { cases: CaseItem[] }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightbox, setLightbox] = useState<{ images: string[]; startIndex: number } | null>(null);

  const handleOpenDetail = useCallback((slug: string) => {
    window.location.href = `/cases/${slug}`;
  }, []);

  const handleOpenGallery = useCallback((slug: string, idx: number) => {
    const caseItem = cases.find((c) => c.slug === slug);
    if (!caseItem) return;
    const images = getDisplayImages(caseItem);
    if (images.length) setLightbox({ images, startIndex: idx });
  }, [cases]);

  const filteredCases =
    activeFilter === "all"
      ? casesWithPhotos(cases)
      : casesWithPhotos(cases).filter((c) => c.filter === activeFilter);

  return (
    <div className={s.wrapper}>
      <HeroSection />
      <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <section className={s.section} id="cases">
        <div className={s.grid}>
          {filteredCases.map((item, index) => (
            <CaseCard
              key={item.id}
              item={item}
              index={index}
              onOpenGallery={handleOpenGallery}
              onOpenDetail={handleOpenDetail}
            />
          ))}
        </div>
      </section>
      <HowWeWork />
      <TrustBlock />
      <CTAFormBlock />
      {lightbox && (
        <GalleryLightbox images={lightbox.images} startIndex={lightbox.startIndex} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
