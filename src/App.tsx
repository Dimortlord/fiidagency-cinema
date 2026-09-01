import {
  ArrowDown,
  ArrowRight,
  AudioLines,
  Check,
  ChevronDown,
  Clapperboard,
  Clock3,
  Film,
  Image as ImageIcon,
  Lightbulb,
  ListChecks,
  Languages,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MonitorPlay,
  PenLine,
  Play,
  QrCode,
  Send,
  Smartphone,
  TicketCheck,
  UserRound,
  X,
} from "lucide-react";
import Lenis from "@studio-freight/lenis";
import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CONTACTS } from "./config/contacts";
import { languageLabels, localeFromPath, localePrefix, locales, nativeLanguageNames, translate, type Locale } from "./i18n";

const baseUrl = import.meta.env.BASE_URL;
const locale = localeFromPath(window.location.pathname);
const t = (source: string) => translate(locale, source);
document.documentElement.lang = locale;
const assetUrl = (path: string) => `${baseUrl}${path.replace(/^\/+/, "")}`;
const localeRoot = `${baseUrl}${localePrefix(locale)}`;
const pageUrl = (path: string) => `${localeRoot}${path.replace(/^\/+/, "")}`;
const languageUrl = (nextLocale: Locale) => `${baseUrl}${localePrefix(nextLocale)}`;

const navItems = [
  ["История", "story"],
  ["Услуги", "formats"],
  ["Как это работает", "process"],
  ["Работы", "works"],
  ["FAQ", "faq"],
  ["Контакты", "contact"],
] as const;

const galleryFrames = Array.from({ length: 8 }, (_, index) => ({
  src: assetUrl(`/img/frames/0${index + 1}.webp`),
  alt: [
    "Герои встречаются через реку на рассвете",
    "Встреча на палубе ночного корабля",
    "Сцена знакомства в древнем городе",
    "Герои после рыцарского турнира",
    "Встреча на железнодорожной платформе",
    "Прогулка вдвоём у канала",
    "Ужин у моря на закате",
    "Предложение руки и сердца",
  ][index],
}));

const corridorFrames = galleryFrames.map((frame, index) => ({
  ...frame,
  sourceIndex: index,
}));

const formats = [
  {
    name: "Открытка",
    duration: "30 секунд",
    price: "от €190",
    description: "Один яркий момент. Для сторис, приглашения, поздравления",
    timing: "от 5 дней",
    included: ["1 сцена", "ваши герои", "версия для телефона"],
  },
  {
    name: "История",
    duration: "60 секунд",
    price: "от €390",
    description: "Завязка, поворот, финал. Готовый маленький фильм",
    timing: "7–10 дней",
    included: ["до 3 сцен", "музыка и титры", "постер-кадр"],
  },
  {
    name: "Фильм",
    duration: "2 минуты",
    price: "от €690",
    description: "Полноценный сюжет на 4–5 сцен, с озвучкой",
    timing: "10–14 дней",
    included: ["4–5 сцен", "озвучка", "экранная и вертикальная версии"],
    featured: true,
  },
  {
    name: "Сага",
    duration: "5+ минут",
    price: "от €1490",
    description: "То же, что я показал на своей свадьбе. Эпохи, музыка, премьера в зале",
    timing: "от 21 дня",
    included: ["большой сценарий", "много эпох", "помощь с премьерой"],
  },
];

const occasions = [
  "Свадьба",
  "Помолвка",
  "День рождения",
  "Годовщина",
  "Родителям",
  "Новый год",
  "Для компании",
];

const serviceStories = [
  {
    name: "Свадебная история",
    category: "Для двоих",
    description: "Ваше знакомство, путь друг к другу и день свадьбы — как настоящее кино.",
    video: "/video/services/wedding.mp4",
    poster: "/img/services/wedding.webp",
  },
  {
    name: "Предложение руки и сердца",
    category: "Помолвка",
    description: "Тот самый вопрос превращается в красивую сцену с вашим характером и деталями.",
    video: "/video/services/engagement.mp4",
    poster: "/img/services/engagement.webp",
  },
  {
    name: "Детский день рождения",
    category: "Для ребёнка",
    description: "Именинник становится главным героем доброго приключения для всей семьи.",
    video: "/video/services/birthday.mp4",
    poster: "/img/services/birthday.webp",
  },
  {
    name: "История для родителей",
    category: "Семейный фильм",
    description: "Годы вместе, важные воспоминания и слова, которые хочется сохранить навсегда.",
    video: "/video/services/parents.mp4",
    poster: "/img/services/parents.webp",
  },
  {
    name: "Новогодняя сказка",
    category: "Праздник",
    description: "Тёплый зимний сюжет с близкими вместо ещё одного обычного поздравления.",
    video: "/video/services/new-year.mp4",
    poster: "/img/services/new-year.webp",
  },
  {
    name: "Фильм о команде",
    category: "Для компании",
    description: "Люди, достижения и характер команды в формате яркой персональной премьеры.",
    video: "/video/services/company.mp4",
    poster: "/img/services/company.webp",
  },
] as const;

const processSteps = [
  ["Заявка", "Вы пишете повод и дату", MessageCircle],
  ["Бриф", "Анкета на 15 вопросов: как познакомились, что важно, какие детали", ListChecks],
  ["Сценарий", "Присылаю раскадровку текстом. Вы правите до тех пор, пока не понравится", PenLine],
  ["Персонажи", "Делаю ваших героев по фотографиям и показываю до запуска", UserRound],
  ["Производство", "Сотни кадров, из которых отбираются лучшие", Clapperboard],
  ["Сборка", "Музыка, озвучка, титры, цветокоррекция", AudioLines],
  ["Премьера", "Файл для экрана в зале, вертикальная версия для сторис", MonitorPlay],
] as const;

const bonuses = [
  {
    title: "Вертикальная нарезка",
    text: "Для сторис и рилсов — уже в правильном формате.",
    Icon: Smartphone,
    src: "/img/bonuses/vertical-cut.jpg",
    position: "44% center",
  },
  {
    title: "Кадр-постер",
    text: "В печатном качестве: можно поставить в рамку и повесить на стену.",
    Icon: ImageIcon,
    src: "/img/bonuses/poster-frame.jpg",
    position: "center",
  },
  {
    title: "QR-открытка",
    text: "Гость сканирует код и смотрит фильм с телефона.",
    Icon: QrCode,
    src: "/img/bonuses/qr-card.jpg",
    position: "42% center",
  },
  {
    title: "Версия для большого экрана",
    text: "Собрана специально для показа в зале.",
    Icon: MonitorPlay,
    src: "/img/bonuses/big-screen.jpg",
    position: "center",
  },
  {
    title: "Ваш файл навсегда",
    text: "Без водяных знаков и ограничений на количество просмотров.",
    Icon: TicketCheck,
    src: "/img/bonuses/file-forever.jpg",
    position: "center",
  },
] as const;

const theses = [
  ["Подарите эмоцию, а не вещь", "Её невозможно положить в шкаф"],
  ["Такого больше нет ни у кого", "Сюжет собран из вашей истории"],
  ["Это пересматривают годами", "На годовщинах, с детьми, с родителями"],
  ["Остаётся навсегда", "Файл ваш, без ограничений"],
] as const;

const faqs = [
  [
    "Насколько герои будут похожи на нас?",
    "Это стилизация, а не портрет: узнаваемые черты, причёска, фигура, одежда, но нарисованный персонаж. Персонажей я показываю до запуска производства, и на этом этапе их ещё можно поменять.",
  ],
  [
    "Сколько это занимает?",
    "От 10 до 14 дней. Срочно за 72 часа тоже можно, с наценкой. Чем раньше напишете, тем спокойнее пройдёт работа.",
  ],
  [
    "Сколько правок входит?",
    "Сценарий правим сколько нужно, до полного согласия. После запуска производства — один круг правок, дальше по договорённости.",
  ],
  [
    "Какие фотографии нужны?",
    "5–10 штук: лица крупно, в полный рост, вместе. Качество телефона подойдёт.",
  ],
  [
    "А если история личная и я не хочу её показывать?",
    "Тогда фильм останется только у вас, в портфолио он не попадёт. Это ваш выбор, и он не влияет на цену.",
  ],
  [
    "Можно на другом языке?",
    "Да: русский, украинский, немецкий, английский. Вторая языковая версия того же фильма — плюс 20%.",
  ],
  [
    "В каком виде я получу фильм?",
    "Файл MP4 в 1080p для показа на экране, вертикальная версия для телефона, кадр-постер в печатном качестве. Всё без водяных знаков.",
  ],
  [
    "Как оплатить?",
    "Половина при старте, половина перед выдачей. Перевод, PayPal или наличными при встрече.",
  ],
] as const;

let activeLenis: Lenis | null = null;

function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  if (activeLenis) {
    activeLenis.scrollTo(target, { offset: -72, duration: 1.05 });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [attached, setAttached] = useState(() => window.scrollY > 28);
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setAttached(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!languageOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!languageRef.current?.contains(event.target as Node)) setLanguageOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLanguageOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [languageOpen]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    if (menuOpen) activeLenis?.stop();
    else activeLenis?.start();
    return () => {
      document.body.classList.remove("menu-open");
      activeLenis?.start();
    };
  }, [menuOpen]);

  const navigate = (id: string) => {
    setMenuOpen(false);
    setLanguageOpen(false);
    window.setTimeout(() => scrollToId(id), 60);
  };

  return (
    <>
      <header className={`site-header ${attached ? "is-attached" : ""}`}>
        <div className="header-inner">
          <button className="brand" onClick={() => navigate("hero")} aria-label={t("На первый экран")}>
            <span className="brand-mark"><Film size={21} /></span>
            <span>FIID <i>CINEMA</i></span>
          </button>

          <nav className="desktop-nav" aria-label={t("Главная навигация")}>
            {navItems.map(([label, id]) => (
              <button key={id} onClick={() => navigate(id)}>{t(label)}</button>
            ))}
          </nav>

          <div className="header-actions">
            <div className={`nav-language ${languageOpen ? "is-open" : ""}`} ref={languageRef}>
              <button
                className="nav-language-trigger"
                type="button"
                aria-label={t("Выбор языка")}
                aria-haspopup="menu"
                aria-expanded={languageOpen}
                aria-controls="language-menu"
                onClick={() => {
                  setLanguageOpen((open) => !open);
                  setMenuOpen(false);
                }}
              >
                <Languages size={15} aria-hidden="true" />
                <span>{languageLabels[locale]}</span>
                <ChevronDown size={14} aria-hidden="true" />
              </button>
              <nav id="language-menu" className="nav-language-menu" aria-label={t("Выбор языка")}>
                <small>{t("Выбор языка")}</small>
                {locales.map((item) => (
                  <a
                    key={item}
                    className={item === locale ? "active" : ""}
                    href={languageUrl(item)}
                    lang={item}
                    hrefLang={item}
                    aria-current={item === locale ? "page" : undefined}
                  >
                    <span>{nativeLanguageNames[item]}</span>
                    <b>{languageLabels[item]}</b>
                    {item === locale ? <Check size={14} aria-hidden="true" /> : <i aria-hidden="true" />}
                  </a>
                ))}
              </nav>
            </div>
            <button className="header-cta" onClick={() => navigate("contact")}>{t("Обсудить фильм")}</button>
            <button
              className="menu-button"
              onClick={() => {
                setMenuOpen((open) => !open);
                setLanguageOpen(false);
              }}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={t(menuOpen ? "Закрыть меню" : "Открыть меню")}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          <p>{t("Ваш следующий фильм")}</p>
          {navItems.map(([label, id], index) => (
            <button key={id} onClick={() => navigate(id)}>
              <span>0{index + 1}</span>{t(label)}<ArrowRight />
            </button>
          ))}
          <div className="mobile-menu-foot">{t("Ульм · работаем по всей Европе")}</div>
        </div>
      </div>
    </>
  );
}

function Filmstrip() {
  const [active, setActive] = useState("hero");
  const sections = useMemo(() => [
    "hero", "story", "formats", "process", "bonuses", "works", "trust", "idea", "faq", "contact",
  ], []);

  useEffect(() => {
    let frame = 0;
    const updateActiveFrame = () => {
      frame = 0;
      const markerY = window.innerHeight * 0.42;
      let nextActive = sections[0];
      let nearestDistance = Number.POSITIVE_INFINITY;

      sections.forEach((id) => {
        const node = document.getElementById(id);
        if (!node) return;
        const rect = node.getBoundingClientRect();
        if (rect.top <= markerY && rect.bottom > markerY) {
          nextActive = id;
          nearestDistance = -1;
          return;
        }
        if (nearestDistance < 0) return;
        const distance = rect.top > markerY ? rect.top - markerY : markerY - rect.bottom;
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nextActive = id;
        }
      });

      setActive((current) => current === nextActive ? current : nextActive);
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateActiveFrame);
    };

    updateActiveFrame();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [sections]);

  return (
    <aside className="filmstrip" aria-label={t("Навигация по сценам")}>
      <div className="film-perforations" />
      <div className="film-frames">
        {sections.map((id, index) => (
          <button
            className={active === id ? "active" : ""}
            key={id}
            onClick={() => scrollToId(id)}
            aria-label={`${t("Перейти к сцене")} ${index + 1}`}
          >
            <img src={assetUrl(`/img/frames/0${(index % 8) + 1}.webp`)} alt="" width="120" height="68" />
            <span>{String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause();
    }
  }, []);
  return (
    <section id="hero" className="hero night-section" aria-labelledby="hero-title">
      <div className="hero-grain" />
      <div className="projector-dust" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{t("Персональные мультфильмы на заказ")}</p>
          <h1 id="hero-title">{t("Ваша история —")} <span>{t("теперь мультфильм")}</span></h1>
          <p className="hero-lead">{t("5 минут, ради которых в зале становится тихо. Герои — вы. Сюжет — то, что было на самом деле.")}</p>
          <div className="button-row">
            <button className="button button-primary" onClick={() => scrollToId("contact")}>
              {t("Хочу такой мультфильм")} <ArrowRight size={19} />
            </button>
            <button className="button button-outline" onClick={() => scrollToId("works")}>
              <Play size={18} fill="currentColor" /> {t("Посмотреть свадебный фильм")}
            </button>
          </div>
          <p className="location"><MapPin size={16} /> {t("Ульм · Баден-Вюртемберг · работаем по всей Европе")}</p>
        </div>

        <div className="hero-cinema">
          <div className="beam beam-back" aria-hidden="true" />
          <div className="cinema-screen">
            <video ref={videoRef} autoPlay muted loop playsInline preload="metadata" poster={assetUrl("/img/hero-poster.webp")} aria-label={t("Фрагменты персональных мультфильмов")}>
              <source src={assetUrl("/video/hero-reel.mp4")} type="video/mp4" />
            </video>
            <div className="screen-vignette" />
            <div className="screen-label"><span /> {t("Идёт показ")}</div>
          </div>
          <div className="projector" aria-hidden="true">
            <div className="projector-reel reel-one"><i /><i /><i /></div>
            <div className="projector-reel reel-two"><i /><i /><i /></div>
            <div className="projector-body"><span>FIID</span><b /><i className="projector-knob" /></div>
            <div className="projector-lens"><i /></div>
            <div className="projector-base" />
            <div className="projector-foot foot-one" />
            <div className="projector-foot foot-two" />
          </div>
        </div>
      </div>

      <button className="scroll-cue" onClick={() => scrollToId("story")} aria-label={t("Листать к следующей сцене")}>
        <span>{t("Листайте — фильм начинается")}</span><ArrowDown />
      </button>
    </section>
  );
}

function Story() {
  return (
    <section id="story" className="story paper-section" aria-labelledby="story-title">
      <div className="light-patch light-patch-one" aria-hidden="true" />
      <div className="container story-grid">
        <figure className="author-photo" data-reveal>
          <img src={assetUrl("/img/author-real.jpg")} alt={t("Дмитрий в день своей свадьбы")} width="1000" height="1250" loading="lazy" />
          <figcaption><Clapperboard size={17} /> {t("Ночной монтаж перед свадьбой")}</figcaption>
        </figure>
        <div className="story-copy" data-reveal>
          <p className="section-kicker">{t("Сцена 02 · Начало")}</p>
          <h2 id="story-title">{t("Первый мультфильм я сделал для своей жены")}</h2>
          <p>{t("На нашей свадьбе я показал гостям пятиминутный мультфильм. В нём мы с женой искали друг друга через века: пещеры, Египет, рыцарский турнир, корабль, поезд — и наконец наши дни, наш город, наша машина.")}</p>
          <p>{t("Когда включился экран, зал замолчал. Потом моя жена заплакала. Потом заплакала половина гостей. Мы пересматривали его ещё раз в ту же ночь, и ещё раз через неделю, и будем пересматривать через двадцать лет.")}</p>
          <p>{t("Фотографии с праздника листают один раз и убирают в папку. Такой фильм пересматривают. Поэтому я стал делать их для других.")}</p>
          <div className="story-end">
            <span className="signature">{t("Дмитрий")}</span>
            <div className="story-stats" aria-label={t("Фильм в цифрах")}>
              <span><b>5</b> {t("минут")}</span>
              <span><b>100+</b> {t("кадров")}</span>
              <span><b>1</b> {t("история")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Formats() {
  const [selectedService, setSelectedService] = useState(0);
  const service = serviceStories[selectedService];
  return (
    <section id="formats" className="formats paper-section" aria-labelledby="formats-title">
      <div className="container">
        <div className="section-heading" data-reveal>
          <p className="section-kicker">{t("Сцена 03 · Услуги")}</p>
          <h2 id="formats-title">{t("Выберите, какой мультфильм будет вашим")}</h2>
          <p>{t("Нажмите на историю — видеопример откроется сразу. Сюжет, героев и детали я соберу уже из вашей жизни.")}</p>
        </div>

        <div className="service-picker" data-reveal>
          <div className="service-list" role="tablist" aria-label={t("Выберите тип мультфильма")}>
            {serviceStories.map((item, index) => (
            <button
              key={item.name}
              role="tab"
              aria-selected={selectedService === index}
              aria-controls="service-video"
              className={selectedService === index ? "active" : ""}
              onClick={() => setSelectedService(index)}
            >
              <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="service-option-copy">
                <small>{t(item.category)}</small>
                <strong>{t(item.name)}</strong>
              </span>
              <ArrowRight size={19} />
            </button>
            ))}
          </div>

          <div className="service-preview" id="service-video" role="tabpanel" key={service.name}>
            <video
              src={assetUrl(service.video)}
              poster={assetUrl(service.poster)}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={`${t("Видеопример")}: ${t(service.name)}`}
            />
            <div className="service-preview-top">
              <span><i /> {t("Видеопример")}</span>
              <span>{String(selectedService + 1).padStart(2, "0")} / {String(serviceStories.length).padStart(2, "0")}</span>
            </div>
            <div className="service-preview-copy">
              <small>{t(service.category)}</small>
              <h3>{t(service.name)}</h3>
              <p>{t(service.description)}</p>
              <button className="service-select" onClick={() => scrollToId("contact")}>
                {t("Хочу такую историю")} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="format-subheading" data-reveal>
          <span>{t("Следующий шаг")}</span>
          <h3>{t("Выберите хронометраж")}</h3>
          <p>{t("Любую из историй выше можно сделать короткой открыткой или полноценным фильмом.")}</p>
        </div>

        <div className="price-grid">
          {formats.map((format) => (
            <article className={`price-card ${format.featured ? "featured" : ""}`} key={format.name} data-reveal>
              {format.featured && <div className="popular-ribbon">{t("Чаще всего берут")}</div>}
              <div className="price-card-head">
                <span>{t(format.duration)}</span>
                <h3>{t(format.name)}</h3>
                <strong>{t(format.price)}</strong>
              </div>
              <p>{t(format.description)}</p>
              <div className="timing"><Clock3 size={17} /> {t(format.timing)}</div>
              <ul>
                {format.included.map((item) => <li key={item}><Check size={17} /> {t(item)}</li>)}
              </ul>
              <button className="text-link" onClick={() => scrollToId("contact")}>{t("Обсудить")} <ArrowRight size={18} /></button>
            </article>
          ))}
        </div>
        <p className="pricing-footnote">{t("Точная цена зависит от количества сцен и сроков. Скажите повод и дату — назову стоимость в тот же день.")}</p>
      </div>
    </section>
  );
}

function Process({ processRef, trackRef }: {
  processRef: React.RefObject<HTMLElement>;
  trackRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <section id="process" className="process night-section" ref={processRef} aria-labelledby="process-title">
      <div className="process-inner">
        <div className="container process-heading">
          <p className="section-kicker light">{t("Сцена 04 · Производство")}</p>
          <h2 id="process-title">{t("От заявки до премьеры")}</h2>
          <p>{t("Семь понятных шагов. На каждом вы знаете, что уже готово и что будет дальше.")}</p>
        </div>
        <div className="process-viewport">
          <div className="process-track" ref={trackRef}>
            {processSteps.map(([title, text, Icon], index) => (
              <article className={`process-card ${index === 0 ? "is-active" : ""}`} key={title} data-process-card>
                <div className="step-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="step-icon"><Icon /></div>
                <h3>{t(title)}</h3>
                <p>{t(text)}</p>
                <span className="step-line" />
              </article>
            ))}
          </div>
        </div>
        <div className="process-hint"><ArrowRight /> {t("Лента движется вместе со страницей")}</div>
      </div>
    </section>
  );
}

function Bonuses() {
  return (
    <section id="bonuses" className="bonuses paper-section" aria-labelledby="bonuses-title">
      <div className="container">
        <div className="section-heading compact" data-reveal>
          <p className="section-kicker">{t("Сцена 05 · После титров")}</p>
          <h2 id="bonuses-title">{t("Что вы получаете сверх фильма")}</h2>
        </div>
        <div className="bonus-grid">
          {bonuses.map((bonus, index) => (
            <article className={`bonus-card bonus-visual-${index + 1}`} key={bonus.title} data-reveal>
              <div className="bonus-media is-image" aria-hidden="true">
                <img src={assetUrl(bonus.src)} alt="" loading="lazy" style={{ objectPosition: bonus.position }} />
              </div>
              <div className="bonus-overlay" aria-hidden="true" />
              <div className="bonus-content">
                <div className="bonus-icon"><bonus.Icon /></div>
                <h3>{t(bonus.title)}</h3>
                <p>{t(bonus.text)}</p>
              </div>
              <span>{t("Входит в фильм")}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Works({ showcaseRef, videoRef }: {
  showcaseRef: React.RefObject<HTMLDivElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowRight") setLightbox((current) => current === null ? null : (current + 1) % galleryFrames.length);
      if (event.key === "ArrowLeft") setLightbox((current) => current === null ? null : (current - 1 + galleryFrames.length) % galleryFrames.length);
    };
    document.body.classList.add("lightbox-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  return (
    <section id="works" className="works night-section" aria-labelledby="works-title">
      <div className="showcase-stage" ref={showcaseRef}>
        <div className="showcase-title">
          <p className="section-kicker light">{t("Сцена 06 · Большой экран")}</p>
          <h2 id="works-title">{t("Вот как выглядит ваша премьера")}</h2>
        </div>
        <div className="showcase-screen">
          <video ref={videoRef} muted loop playsInline preload="none" poster={assetUrl("/img/showcase-medieval-poster.webp")} aria-label={t("Нарезка фильма через эпохи")}>
              <source src={`${assetUrl("/video/epochs-montage.mp4")}?v=3`} type="video/mp4" />
          </video>
          <div className="showcase-vignette" />
          <div className="showcase-status"><span /> {t("Семь эпох · 00:29")}</div>
        </div>
        <div className="thesis-layer">
          {theses.map(([title, text], index) => (
            <article className={`thesis thesis-${index + 1}`} data-thesis key={title}>
              <span>0{index + 1}</span><h3>{t(title)}</h3><p>{t(text)}</p>
            </article>
          ))}
        </div>
        <div className="showcase-scroll"><ArrowDown /> {t("Листайте фильм")}</div>
      </div>

      <div className="gallery-corridor" data-gallery-corridor>
        <div className="gallery-corridor-stage" data-gallery-stage>
          <div className="gallery-corridor-beam" aria-hidden="true" />
          <div className="gallery-corridor-scene" data-gallery-scene>
            {corridorFrames.map((frame, index) => (
              <button
                className="corridor-frame"
                data-corridor-frame
                key={`${frame.src}-${index}`}
                onClick={() => setLightbox(frame.sourceIndex)}
                aria-label={`${t("Открыть кадр")} ${frame.sourceIndex + 1}`}
              >
                <img src={frame.src} alt={t(frame.alt)} width="1200" height="675" loading="lazy" />
              </button>
            ))}
          </div>
          <div className="gallery-corridor-grain" aria-hidden="true" />
          <div className="gallery-corridor-vignette" aria-hidden="true" />
          <div className="gallery-corridor-heading">
            <p className="section-kicker light">{t("Стоп-кадры")}</p>
            <h3>{t("Одна история. Восемь миров.")}</h3>
            <p className="gallery-corridor-lead">{t("Это миры из нашей истории. Для вас я нарисую любой — эпоху, планету, вашу собственную сказку.")}</p>
          </div>
          <div className="gallery-corridor-hud" aria-hidden="true">
            <strong data-gallery-current>01</strong>
            <span>{t("кадр")}<br />{t("из")} {corridorFrames.length}</span>
            <i><b data-gallery-progress /></i>
          </div>
          <p className="gallery-corridor-caption">{t("Нажмите на кадр, чтобы рассмотреть детали.")}</p>
        </div>
      </div>

      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={t("Просмотр кадра")} onMouseDown={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label={t("Закрыть")}><X /></button>
          <button className="lightbox-arrow prev" onMouseDown={(e) => e.stopPropagation()} onClick={() => setLightbox((lightbox - 1 + galleryFrames.length) % galleryFrames.length)} aria-label={t("Предыдущий кадр")}><ArrowRight /></button>
          <figure onMouseDown={(event) => event.stopPropagation()}>
            <img src={galleryFrames[lightbox].src} alt={t(galleryFrames[lightbox].alt)} />
            <figcaption><span>0{lightbox + 1}</span>{t(galleryFrames[lightbox].alt)}</figcaption>
          </figure>
          <button className="lightbox-arrow next" onMouseDown={(e) => e.stopPropagation()} onClick={() => setLightbox((lightbox + 1) % galleryFrames.length)} aria-label={t("Следующий кадр")}><ArrowRight /></button>
        </div>
      )}
    </section>
  );
}

function FilmPlayer() {
  return (
    <figure className="first-film" data-reveal>
      <video controls playsInline preload="metadata" poster={assetUrl("/img/frames/01.webp")} aria-label={t("Полный свадебный мультфильм")}>
        <source src={assetUrl("/video/full-wedding-film.mp4")} type="video/mp4" />
      </video>
      <figcaption><span /> {t("Полный фильм · 07:28 · Премьера в замке")}</figcaption>
    </figure>
  );
}

function Trust() {
  return (
    <section id="trust" className="trust paper-section" aria-labelledby="trust-title">
      <div className="container trust-grid">
        <FilmPlayer />
        <div className="trust-copy" data-reveal>
          <p className="section-kicker">{t("Сцена 07 · Личное доказательство")}</p>
          <h2 id="trust-title">{t("Мой фильм — мой главный отзыв")}</h2>
          <p>{t("Около 40 часов я собирал этот фильм для нашей свадьбы, продумывая каждую сцену и каждую деталь.")}</p>
          <p>{t("Премьера была на дорогой свадьбе в замке в Нейфене — перед всеми гостями. Права на ошибку не было: всё должно было сработать с первого кадра.")}</p>
          <p>{t("Теперь каждый фильм для клиентов я делаю с тем же вниманием и качеством, как если бы снова делал его для себя.")}</p>
          <div className="trust-proof" aria-label={t("Три факта о первом фильме")}>
            <span><b>≈ 40</b>{t("часов работы")}</span>
            <span><b>{t("Замок")}</b>{t("премьера в Нейфене")}</span>
            <span><b>{t("Как для себя")}</b>{t("так делаю для вас")}</span>
          </div>
          <div className="trust-actions">
            <button className="button button-primary" onClick={() => scrollToId("contact")}>{t("Хочу фильм с таким подходом")} <ArrowRight size={19} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

type IdeaDraft = { id: number; occasion: string; story: string };

const ideaChoices = {
  occasion: ["Свадьба", "День рождения", "Годовщина", "Для компании"],
  mood: ["Трогательно", "Романтично", "С юмором", "Эпично"],
  world: ["Наша реальность", "Сказка", "Сквозь эпохи", "Другая планета"],
} as const;

type IdeaChoice = {
  occasion: (typeof ideaChoices.occasion)[number];
  mood: (typeof ideaChoices.mood)[number];
  world: (typeof ideaChoices.world)[number];
};

function Idea({ onComplete }: { onComplete: (draft: IdeaDraft) => void }) {
  const [choice, setChoice] = useState<IdeaChoice>({
    occasion: ideaChoices.occasion[0],
    mood: ideaChoices.mood[0],
    world: ideaChoices.world[2],
  });
  const assemblyKey = `${choice.occasion}-${choice.mood}-${choice.world}`;

  const completeIdea = () => {
    onComplete({
      id: Date.now(),
      occasion: choice.occasion,
      story: `${t("Идея из конструктора:")} ${t(choice.occasion)} · ${t(choice.mood)} · ${t(choice.world)}.`,
    });
  };

  return (
    <section id="idea" className="idea night-section" aria-labelledby="idea-title">
      <div className="idea-beam" aria-hidden="true" />
      <div className="container">
        <div className="idea-heading" data-reveal>
          <div>
            <p className="section-kicker light">{t("Сцена 08 · Конструктор идеи")}</p>
            <h2 id="idea-title">{t("Соберите идею своего фильма")}</h2>
          </div>
          <p>{t("Выберите три детали. Я соединю их с вашей настоящей историей и превращу в сюжет, которого больше ни у кого не будет.")}</p>
        </div>

        <div className="idea-builder" data-reveal>
          <div className="idea-controls">
            <fieldset>
              <legend><span>01</span>{t("Повод")}</legend>
              <div>
                {ideaChoices.occasion.map((item) => (
                  <button type="button" className={choice.occasion === item ? "active" : ""} aria-pressed={choice.occasion === item} key={item} onClick={() => setChoice((current) => ({ ...current, occasion: item }))}>{t(item)}</button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend><span>02</span>{t("Настроение")}</legend>
              <div>
                {ideaChoices.mood.map((item) => (
                  <button type="button" className={choice.mood === item ? "active" : ""} aria-pressed={choice.mood === item} key={item} onClick={() => setChoice((current) => ({ ...current, mood: item }))}>{t(item)}</button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend><span>03</span>{t("Мир истории")}</legend>
              <div>
                {ideaChoices.world.map((item) => (
                  <button type="button" className={choice.world === item ? "active" : ""} aria-pressed={choice.world === item} key={item} onClick={() => setChoice((current) => ({ ...current, world: item }))}>{t(item)}</button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="idea-assembly">
            <div className="idea-formula" key={assemblyKey} aria-live="polite">
              <div className="idea-ingredient ingredient-occasion">
                <TicketCheck />
                <span>{t("Повод")}</span>
                <b>{t(choice.occasion)}</b>
              </div>
              <div className="idea-ingredient ingredient-mood">
                <AudioLines />
                <span>{t("Настроение")}</span>
                <b>{t(choice.mood)}</b>
              </div>
              <div className="idea-ingredient ingredient-world">
                <ImageIcon />
                <span>{t("Мир истории")}</span>
                <b>{t(choice.world)}</b>
              </div>
              <svg className="idea-connections" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
                <path d="M155 95 C260 95 265 200 385 240" />
                <path d="M445 95 C390 120 420 180 385 240" />
                <path d="M160 310 C245 310 285 250 385 240" />
              </svg>
              <div className="idea-core">
                <div><Lightbulb /></div>
                <span>{t("Ваша идея собрана")}</span>
                <b>{t("Осталось превратить её в фильм")}</b>
              </div>
              <i className="idea-spark spark-one" aria-hidden="true" />
              <i className="idea-spark spark-two" aria-hidden="true" />
              <i className="idea-spark spark-three" aria-hidden="true" />
            </div>
            <button className="button button-primary idea-submit" type="button" onClick={completeIdea}>{t("Передать идею в бриф")} <ArrowRight size={19} /></button>
            <p>{t("Ваш выбор автоматически появится в заявке")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="faq paper-section" aria-labelledby="faq-title">
      <div className="container">
        <div className="section-heading compact" data-reveal>
          <p className="section-kicker">{t("Сцена 09 · Без сюрпризов")}</p>
          <h2 id="faq-title">{t("Частые вопросы")}</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => {
            const isOpen = open === index;
            return (
              <article className={isOpen ? "open" : ""} key={question}>
                <h3>
                  <button onClick={() => setOpen(isOpen ? -1 : index)} aria-expanded={isOpen} aria-controls={`faq-answer-${index}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>{t(question)}<ChevronDown />
                  </button>
                </h3>
                <div id={`faq-answer-${index}`} className="faq-answer"><p>{t(answer)}</p></div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type FormFields = { name: string; contact: string; occasion: string; date: string; story: string };

function Contact({ ideaDraft }: { ideaDraft: IdeaDraft | null }) {
  const [fields, setFields] = useState<FormFields>({ name: "", contact: "", occasion: "Свадьба", date: "", story: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!ideaDraft) return;
    setFields((current) => ({ ...current, occasion: ideaDraft.occasion, story: ideaDraft.story }));
    setErrors((current) => ({ ...current, story: undefined }));
    setSent(false);
  }, [ideaDraft]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof FormFields, string>> = {};
    if (fields.name.trim().length < 2) nextErrors.name = t("Как к вам обращаться?");
    if (fields.contact.trim().length < 5) nextErrors.contact = t("Оставьте телефон, ник или e-mail");
    if (fields.story.trim().length < 8) nextErrors.story = t("Расскажите хотя бы в двух словах");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setSent(true);
  };

  const update = (key: keyof FormFields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  return (
    <section id="contact" className="contact paper-section" aria-labelledby="contact-title">
      <div className="container contact-grid">
        <div className="contact-copy" data-reveal>
          <p className="section-kicker">{t("Сцена 10 · Начнём с разговора")}</p>
          <h2 id="contact-title">{t("Расскажите, чей это будет фильм")}</h2>
          <p>{t("Напишите повод и дату. Я отвечу сегодня, задам несколько вопросов и сразу скажу, какой формат подойдёт.")}</p>
          <div className="messenger-list">
            {CONTACTS.whatsapp && <a href={CONTACTS.whatsapp}><MessageCircle /><span><b>WhatsApp</b>{t("Обычно отвечаю быстрее всего")}</span><ArrowRight /></a>}
            {CONTACTS.telegram && <a href={CONTACTS.telegram}><Send /><span><b>Telegram</b>{t("Можно голосовым сообщением")}</span><ArrowRight /></a>}
            {CONTACTS.email && <a href={`mailto:${CONTACTS.email}`}><Mail /><span><b>E-mail</b>{CONTACTS.email}</span><ArrowRight /></a>}
          </div>
          {CONTACTS.city && <div className="contact-location"><MapPin /> {t(CONTACTS.city)} · {t("дистанционно по всей Европе")}</div>}
        </div>

        <form className={`brief-form ${sent ? "is-sent" : ""}`} onSubmit={submit} noValidate data-reveal>
          {sent ? (
            <div className="form-success" role="status">
              <div><Check /></div>
              <p>{t("Получил. Отвечу сегодня.")}</p>
              <span>{t("А пока можете сохранить страницу — ваша история уже сделала первый шаг к экрану.")}</span>
              <button type="button" className="text-link" onClick={() => setSent(false)}>{t("Отправить ещё одну заявку")}</button>
            </div>
          ) : (
            <>
              <div className="form-heading"><span>{t("Короткий бриф")}</span><b>{t("≈ 2 минуты")}</b></div>
              <label>
                {t("Как вас зовут?")}
                <input value={fields.name} onChange={(e) => update("name", e.target.value)} placeholder={t("Имя")} aria-invalid={Boolean(errors.name)} />
                {errors.name && <small>{errors.name}</small>}
              </label>
              <label>
                {t("Куда ответить?")}
                <input value={fields.contact} onChange={(e) => update("contact", e.target.value)} placeholder={t("Телефон, Telegram или e-mail")} aria-invalid={Boolean(errors.contact)} />
                {errors.contact && <small>{errors.contact}</small>}
              </label>
              <div className="form-row">
                <label>
                  {t("Повод")}
                  <select value={fields.occasion} onChange={(e) => update("occasion", e.target.value)}>
                    {occasions.map((item) => <option key={item} value={item}>{t(item)}</option>)}
                  </select>
                </label>
                <label>
                  {t("Дата показа")}
                  <input type="date" value={fields.date} onChange={(e) => update("date", e.target.value)} />
                </label>
              </div>
              <label>
                {t("О чём ваша история?")}
                <textarea value={fields.story} onChange={(e) => update("story", e.target.value)} placeholder={t("Например: познакомились в поезде, а предложение было в Венеции…")} rows={4} aria-invalid={Boolean(errors.story)} />
                {errors.story && <small>{errors.story}</small>}
              </label>
              <button className="button button-primary submit-button" type="submit">{t("Отправить историю")} <ArrowRight /></button>
              <p className="privacy-note">{t("Нажимая кнопку, вы соглашаетесь на обработку данных только для ответа на заявку.")} <a href={pageUrl("/datenschutz")}>{t("Подробнее")}</a>.</p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

const footerPeople = [
  [assetUrl("/img/people/dmitriy.webp"), "Дмитрий"],
  [assetUrl("/img/people/vanessa.webp"), "Ванесса"],
  [assetUrl("/img/people/egypt.webp"), "Герои Египта"],
  [assetUrl("/img/people/knight.webp"), "Герои турнира"],
  [assetUrl("/img/people/future.webp"), "Герои будущего"],
] as const;

function Footer() {
  return (
    <footer className="footer night-section">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand"><span className="brand-mark"><Film size={21} /></span><span>FIID <i>CINEMA</i></span></div>
            <p>{t("Настоящие истории.")}<br />{t("Большая семейная анимация.")}</p>
          </div>
          <div className="footer-links">
            <div><span>{t("Сцены")}</span>{navItems.slice(0, 4).map(([label, id]) => <button key={id} onClick={() => scrollToId(id)}>{t(label)}</button>)}</div>
            <div><span>{t("Связь")}</span>{CONTACTS.whatsapp && <a href={CONTACTS.whatsapp}>WhatsApp</a>}{CONTACTS.telegram && <a href={CONTACTS.telegram}>Telegram</a>}{CONTACTS.email && <a href={`mailto:${CONTACTS.email}`}>E-mail</a>}</div>
            <div><span>{t("Документы")}</span><a href={pageUrl("/impressum")}>Impressum</a><a href={pageUrl("/datenschutz")}>Datenschutz</a><div className="footer-languages">{locales.map((item) => <a key={item} className={item === locale ? "active" : ""} href={languageUrl(item)} lang={item} hrefLang={item} aria-current={item === locale ? "page" : undefined}>{languageLabels[item]}</a>)}</div></div>
          </div>
        </div>

        <div className="footer-cast" aria-label={t("Герои наших историй")}>
          {footerPeople.map(([src, alt], index) => (
            <div className={`cast-member cast-${index + 1}`} key={src}>
              <img src={src} alt={t(alt)} width="120" height="120" loading="lazy" />
              <span aria-hidden="true">👋</span>
            </div>
          ))}
          <p>{t("До встречи")}<br />{t("на премьере")}</p>
        </div>

        <div className="footer-bottom">
          <span>© 2026 FIID Cinema · {t("Ульм, Германия")}</span>
          <span>{t("Сайт собран с вниманием в")} <a href="https://fiidagency.com" target="_blank" rel="noreferrer">fiidagency.com</a></span>
        </div>
      </div>
    </footer>
  );
}

function LegalPage({ type }: { type: "impressum" | "datenschutz" }) {
  const isImpressum = type === "impressum";
  return (
    <main className="legal-page night-section">
      <a className="brand" href={localeRoot}><span className="brand-mark"><Film size={21} /></span><span>FIID <i>CINEMA</i></span></a>
      <div>
        <p className="eyebrow">{t("Юридическая информация")}</p>
        <h1>{isImpressum ? "Impressum" : "Datenschutz"}</h1>
        <p>{t(isImpressum ? "Здесь будут размещены данные владельца сайта и контактная информация в соответствии с требованиями законодательства Германии." : "Здесь будет размещена политика обработки персональных данных и информация об используемых сервисах.")}</p>
        <p>{t("Перед публикацией замените этот текст на финальную юридическую редакцию.")}</p>
        <a className="button button-primary" href={localeRoot}>{t("Вернуться к фильму")} <ArrowRight /></a>
      </div>
    </main>
  );
}

function Site() {
  const processRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const showcaseVideoRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [ideaDraft, setIdeaDraft] = useState<IdeaDraft | null>(null);

  const useIdeaDraft = (draft: IdeaDraft) => {
    setIdeaDraft(draft);
    requestAnimationFrame(() => scrollToId("contact"));
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1,
    });
    activeLenis = lenis;
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      if (activeLenis === lenis) activeLenis = null;
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const stage = showcaseRef.current;
    const video = showcaseVideoRef.current;
    if (!stage || !video) return;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      video.preload = "metadata";
      video.load();
      if (!desktop && !reduced) void video.play().catch(() => undefined);
      observer.disconnect();
    }, { rootMargin: "100% 0px" });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;
    const move = (event: PointerEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      const target = event.target as HTMLElement;
      cursor.classList.toggle("visible", Boolean(target.closest(".night-section")));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let cleanup: () => void = () => {};
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      const lenis = activeLenis;
      const syncScrollTrigger = () => ScrollTrigger.update();
      lenis?.on("scroll", syncScrollTrigger);

      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(element, { opacity: 0, y: 24 }, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          });
        });

        const desktop = window.matchMedia("(min-width: 1024px)").matches;
        const process = processRef.current;
        const track = trackRef.current;
        if (desktop && process && track) {
          const processCards = gsap.utils.toArray<HTMLElement>("[data-process-card]", track);
          const horizontalDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);
          const updateActiveProcessCard = () => {
            if (!processCards.length) return;
            const distance = horizontalDistance();
            const trackX = Number(gsap.getProperty(track, "x")) || 0;
            const progress = distance > 0 ? Math.min(1, Math.max(0, -trackX / distance)) : 0;
            const activeIndex = Math.round(progress * (processCards.length - 1));
            processCards.forEach((card, index) => card.classList.toggle("is-active", index === activeIndex));
          };
          gsap.to(track, {
            x: () => -horizontalDistance(),
            ease: "none",
            onUpdate: updateActiveProcessCard,
            scrollTrigger: {
              trigger: process,
              start: "top top",
              end: () => `+=${Math.max(1050, horizontalDistance() * 0.9 + 520)}`,
              scrub: 0.45,
              pin: true,
              invalidateOnRefresh: true,
              onRefresh: updateActiveProcessCard,
            },
          });
          updateActiveProcessCard();
        }

        const stage = showcaseRef.current;
        const video = showcaseVideoRef.current;
        if (stage && video) {
          if (desktop) {
            const cards = gsap.utils.toArray<HTMLElement>("[data-thesis]", stage);
            if (video.readyState > 0) video.pause();
            else video.addEventListener("loadedmetadata", () => video.pause(), { once: true });
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: "+=2800",
                scrub: 0.38,
                pin: true,
                onToggle: (self) => {
                  if (self.isActive) void video.play().catch(() => undefined);
                  else video.pause();
                },
              },
            });
            timeline.fromTo(".showcase-screen", { scale: 0.84, borderRadius: 28 }, { scale: 1, borderRadius: 0, duration: 0.55, ease: "power2.out" }, 0);
            cards.forEach((card, index) => {
              const fromX = index % 2 === 0 ? -70 : 70;
              const start = 0.48 + index * 0.72;
              timeline.fromTo(card, { opacity: 0, x: fromX, y: 12, filter: "blur(8px)" }, { opacity: 1, x: 0, y: 0, filter: "blur(0px)", duration: 0.24 }, start);
              timeline.to(card, { opacity: 0, y: -28, duration: 0.2 }, start + 0.48);
            });
          }
        }

        const galleryCorridor = document.querySelector<HTMLElement>("[data-gallery-corridor]");
        const galleryScene = document.querySelector<HTMLElement>("[data-gallery-scene]");
        const staticGallery = window.matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce)").matches;
        if (galleryCorridor && galleryScene && !staticGallery) {
          const frames = gsap.utils.toArray<HTMLElement>("[data-corridor-frame]", galleryScene);
          const current = galleryCorridor.querySelector<HTMLElement>("[data-gallery-current]");
          const progressBar = galleryCorridor.querySelector<HTMLElement>("[data-gallery-progress]");
          const near = 380;
          const far = -8200;
          let depth = 0;
          let frameLayout: Array<{ x: number; y: number; z: number; rotateX: number; rotateY: number }> = [];

          const updateLayout = () => {
            const spacing = window.innerWidth < 1024 ? 620 : 800;
            const radiusScale = window.innerWidth < 1100 ? 0.72 : 1;
            depth = frames.length * spacing + 600;
            frameLayout = frames.map((_, index) => {
              const angle = index * 2.399963;
              const radius = (310 + (index % 3) * 118) * radiusScale;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius * 0.55;
              return {
                x,
                y,
                z: -(index + 1) * spacing,
                rotateY: x > 0 ? -11 : 11,
                rotateX: y > 0 ? 5 : -5,
              };
            });
          };

          const renderCorridor = (progress: number) => {
            const camera = progress * depth;
            frames.forEach((frame, index) => {
              const layout = frameLayout[index];
              const z = layout.z + camera;
              let opacity = 0;
              if (z < near && z > far) {
                const fadeIn = Math.min(1, (z - far) / 2600);
                const fadeOut = z > near - 700 ? Math.max(0, (near - z) / 700) : 1;
                opacity = fadeIn * fadeOut;
              }
              frame.style.opacity = opacity.toFixed(3);
              frame.style.pointerEvents = opacity > 0.42 && z > -1450 ? "auto" : "none";
              frame.style.transform = `translate3d(${layout.x.toFixed(1)}px, ${layout.y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${layout.rotateY}deg) rotateX(${layout.rotateX}deg)`;
            });
            const activeIndex = Math.min(frames.length, Math.floor(progress * frames.length) + 1);
            if (current) current.textContent = String(activeIndex).padStart(2, "0");
            if (progressBar) progressBar.style.width = `${progress * 100}%`;
          };

          updateLayout();
          renderCorridor(0);
          ScrollTrigger.create({
            trigger: galleryCorridor,
            start: "top top",
            end: "bottom bottom",
            invalidateOnRefresh: true,
            onUpdate: (self) => renderCorridor(self.progress),
            onRefresh: (self) => {
              updateLayout();
              renderCorridor(self.progress);
            },
          });
        }

        ScrollTrigger.refresh();
      });
      cleanup = () => {
        showcaseVideoRef.current?.pause();
        lenis?.off("scroll", syncScrollTrigger);
        context.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#hero">{t("Перейти к содержанию")}</a>
      <Header />
      <Filmstrip />
      <div className="cursor-glow" ref={cursorRef} aria-hidden="true" />
      <main>
        <Hero />
        <Story />
        <Formats />
        <Process processRef={processRef} trackRef={trackRef} />
        <Bonuses />
        <Works showcaseRef={showcaseRef} videoRef={showcaseVideoRef} />
        <Trust />
        <Idea onComplete={useIdeaDraft} />
        <FAQ />
        <Contact ideaDraft={ideaDraft} />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const basePath = new URL(baseUrl, window.location.origin).pathname.replace(/\/$/, "");
  const pathname = window.location.pathname.toLowerCase();
  const resolvedPath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || "/"
    : pathname;
  const normalizedPath = resolvedPath.length > 1 ? resolvedPath.replace(/\/$/, "") : resolvedPath;
  const languageSegment = locale === "ru" ? "" : `/${locale}`;
  const localizedPath = languageSegment && (normalizedPath === languageSegment || normalizedPath.startsWith(`${languageSegment}/`))
    ? normalizedPath.slice(languageSegment.length) || "/"
    : normalizedPath;
  const path = localizedPath.length > 1 ? localizedPath.replace(/\/$/, "") : localizedPath;
  if (path === "/impressum") return <LegalPage type="impressum" />;
  if (path === "/datenschutz") return <LegalPage type="datenschutz" />;
  return <Site />;
}
