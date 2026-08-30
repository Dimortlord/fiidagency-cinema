import {
  ArrowDown,
  ArrowRight,
  AudioLines,
  Check,
  ChevronDown,
  Clapperboard,
  Clock3,
  Film,
  Frame,
  Image as ImageIcon,
  Lightbulb,
  ListChecks,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MonitorPlay,
  Pause,
  PenLine,
  Play,
  QrCode,
  Send,
  Smartphone,
  Sparkles,
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

const baseUrl = import.meta.env.BASE_URL;
const assetUrl = (path: string) => `${baseUrl}${path.replace(/^\/+/, "")}`;
const pageUrl = (path: string) => `${baseUrl}${path.replace(/^\/+/, "")}`;

const navItems = [
  ["История", "story"],
  ["Форматы", "formats"],
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

const occasionLines: Record<string, string> = {
  Свадьба: "Премьера, после которой ваши гости ещё долго говорят не о торте.",
  Помолвка: "Ваше предложение становится сценой, которую хочется пересматривать.",
  "День рождения": "Главный герой получает собственное маленькое приключение.",
  Годовщина: "Вся дорога от первого взгляда до сегодняшнего дня — в одном сюжете.",
  Родителям: "Семейная история, которую можно смотреть всем поколением.",
  "Новый год": "Тёплая зимняя история вместо ещё одного обычного поздравления.",
  "Для компании": "Люди, события и характер команды — в формате настоящей премьеры.",
};

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
  ["Вертикальная нарезка", "Для сторис и рилсов — уже в правильном формате.", Smartphone],
  ["Кадр-постер", "В печатном качестве: можно поставить в рамку и повесить на стену.", ImageIcon],
  ["QR-открытка", "Гость сканирует код и смотрит фильм с телефона.", QrCode],
  ["Версия для большого экрана", "Собрана специально для показа в зале.", MonitorPlay],
  ["Ваш файл навсегда", "Без водяных знаков и ограничений на количество просмотров.", TicketCheck],
] as const;

const theses = [
  ["Подарите эмоцию, а не вещь", "Её невозможно положить в шкаф"],
  ["Такого больше нет ни у кого", "Сюжет собран из вашей истории"],
  ["Это пересматривают годами", "На годовщинах, с детьми, с родителями"],
  ["Зал замолкает", "Проверено на живой свадьбе"],
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
  const [hidden, setHidden] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setHidden(current > lastScroll.current && current > 120 && !menuOpen);
      lastScroll.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

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
    window.setTimeout(() => scrollToId(id), 60);
  };

  return (
    <header className={`site-header ${hidden ? "is-hidden" : ""}`}>
      <div className="header-inner">
        <button className="brand" onClick={() => navigate("hero")} aria-label="На первый экран">
          <span className="brand-mark"><Film size={21} /></span>
          <span>FIID <i>CINEMA</i></span>
        </button>

        <nav className="desktop-nav" aria-label="Главная навигация">
          {navItems.map(([label, id]) => (
            <button key={id} onClick={() => navigate(id)}>{label}</button>
          ))}
        </nav>

        <div className="header-actions">
          <button className="lang-switch" type="button" disabled aria-label="Русская версия активна">
            RU <span>DE</span>
          </button>
          <button className="header-cta" onClick={() => navigate("contact")}>Обсудить фильм</button>
          <button
            className="menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          <p>Ваш следующий фильм</p>
          {navItems.map(([label, id], index) => (
            <button key={id} onClick={() => navigate(id)}>
              <span>0{index + 1}</span>{label}<ArrowRight />
            </button>
          ))}
          <div className="mobile-menu-foot">Ульм · работаем по всей Европе</div>
        </div>
      </div>
    </header>
  );
}

function Filmstrip() {
  const [active, setActive] = useState("hero");
  const sections = useMemo(() => [
    "hero", "story", "formats", "process", "bonuses", "works", "trust", "idea", "faq", "contact",
  ], []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(visible.target.id);
    }, { rootMargin: "-20% 0px -55%", threshold: [0, 0.2, 0.5] });
    sections.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <aside className="filmstrip" aria-label="Навигация по сценам">
      <div className="film-perforations" />
      <div className="film-frames">
        {sections.map((id, index) => (
          <button
            className={active === id ? "active" : ""}
            key={id}
            onClick={() => scrollToId(id)}
            aria-label={`Перейти к сцене ${index + 1}`}
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
          <p className="eyebrow">Персональные мультфильмы на заказ</p>
          <h1 id="hero-title">Ваша история — <span>теперь мультфильм</span></h1>
          <p className="hero-lead">5 минут, ради которых в зале становится тихо. Герои — вы. Сюжет — то, что было на самом деле.</p>
          <div className="button-row">
            <button className="button button-primary" onClick={() => scrollToId("contact")}>
              Хочу такой мультфильм <ArrowRight size={19} />
            </button>
            <button className="button button-outline" onClick={() => scrollToId("works")}>
              <Play size={18} fill="currentColor" /> Посмотреть свадебный фильм
            </button>
          </div>
          <p className="location"><MapPin size={16} /> Ульм · Баден-Вюртемберг · работаем по всей Европе</p>
        </div>

        <div className="hero-cinema">
          <div className="beam" aria-hidden="true" />
          <div className="cinema-screen">
            <video ref={videoRef} autoPlay muted loop playsInline preload="metadata" poster={assetUrl("/img/hero-poster.webp")} aria-label="Фрагменты персональных мультфильмов">
              <source src={assetUrl("/video/hero-reel.mp4")} type="video/mp4" />
            </video>
            <div className="screen-vignette" />
            <div className="screen-label"><span /> Идёт показ</div>
          </div>
          <div className="projector" aria-hidden="true">
            <div className="projector-reel reel-one"><i /><i /><i /></div>
            <div className="projector-reel reel-two"><i /><i /><i /></div>
            <div className="projector-body"><span>FIID</span><b /></div>
            <div className="projector-lens" />
            <div className="projector-foot foot-one" />
            <div className="projector-foot foot-two" />
          </div>
        </div>
      </div>

      <button className="scroll-cue" onClick={() => scrollToId("story")} aria-label="Листать к следующей сцене">
        <span>Листайте — фильм начинается</span><ArrowDown />
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
          {/* TODO: заменить на реальное фото Дмитрия. */}
          <img src={assetUrl("/img/author-real.jpg")} alt="Место для реального портрета Дмитрия" width="1000" height="1250" loading="lazy" />
          <figcaption><Clapperboard size={17} /> Ночной монтаж перед свадьбой</figcaption>
        </figure>
        <div className="story-copy" data-reveal>
          <p className="section-kicker">Сцена 02 · Начало</p>
          <h2 id="story-title">Первый мультфильм я сделал для своей жены</h2>
          <p>На нашей свадьбе я показал гостям пятиминутный мультфильм. В нём мы с женой искали друг друга через века: пещеры, Египет, рыцарский турнир, корабль, поезд — и наконец наши дни, наш город, наша машина.</p>
          <p>Когда включился экран, зал замолчал. Потом моя жена заплакала. Потом заплакала половина гостей. Мы пересматривали его ещё раз в ту же ночь, и ещё раз через неделю, и будем пересматривать через двадцать лет.</p>
          <p>Фотографии с праздника листают один раз и убирают в папку. Такой фильм пересматривают. Поэтому я стал делать их для других.</p>
          <div className="story-end">
            <span className="signature">Дмитрий</span>
            <div className="story-stats" aria-label="Фильм в цифрах">
              <span><b>5</b> минут</span>
              <span><b>100+</b> кадров</span>
              <span><b>1</b> история</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Formats() {
  const [occasion, setOccasion] = useState("Свадьба");
  return (
    <section id="formats" className="formats paper-section" aria-labelledby="formats-title">
      <div className="container">
        <div className="section-heading" data-reveal>
          <p className="section-kicker">Сцена 03 · Формат</p>
          <h2 id="formats-title">Какие мультфильмы я делаю</h2>
          <p>Выберите повод — хронометраж и сюжет подстроим под вашу историю.</p>
        </div>

        <div className="occasion-tabs" role="tablist" aria-label="Повод для фильма">
          {occasions.map((item) => (
            <button
              key={item}
              role="tab"
              aria-selected={occasion === item}
              className={occasion === item ? "active" : ""}
              onClick={() => setOccasion(item)}
            >{item}</button>
          ))}
        </div>
        <div className="occasion-note" key={occasion}><Sparkles size={18} /> {occasionLines[occasion]}</div>

        <div className="price-grid">
          {formats.map((format) => (
            <article className={`price-card ${format.featured ? "featured" : ""}`} key={format.name} data-reveal>
              {format.featured && <div className="popular-ribbon">Чаще всего берут</div>}
              <div className="price-card-head">
                <span>{format.duration}</span>
                <h3>{format.name}</h3>
                <strong>{format.price}</strong>
              </div>
              <p>{format.description}</p>
              <div className="timing"><Clock3 size={17} /> {format.timing}</div>
              <ul>
                {format.included.map((item) => <li key={item}><Check size={17} /> {item}</li>)}
              </ul>
              <button className="text-link" onClick={() => scrollToId("contact")}>Обсудить <ArrowRight size={18} /></button>
            </article>
          ))}
        </div>
        <p className="pricing-footnote">Точная цена зависит от количества сцен и сроков. Скажите повод и дату — назову стоимость в тот же день.</p>
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
          <p className="section-kicker light">Сцена 04 · Производство</p>
          <h2 id="process-title">От заявки до премьеры</h2>
          <p>Семь понятных шагов. На каждом вы знаете, что уже готово и что будет дальше.</p>
        </div>
        <div className="process-viewport">
          <div className="process-track" ref={trackRef}>
            {processSteps.map(([title, text, Icon], index) => (
              <article className="process-card" key={title}>
                <div className="step-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="step-icon"><Icon /></div>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="step-line" />
              </article>
            ))}
          </div>
        </div>
        <div className="process-hint"><ArrowRight /> Лента движется вместе со страницей</div>
      </div>
    </section>
  );
}

function Bonuses() {
  return (
    <section id="bonuses" className="bonuses paper-section" aria-labelledby="bonuses-title">
      <div className="container">
        <div className="section-heading compact" data-reveal>
          <p className="section-kicker">Сцена 05 · После титров</p>
          <h2 id="bonuses-title">Что вы получаете сверх фильма</h2>
        </div>
        <div className="bonus-grid">
          {bonuses.map(([title, text, Icon], index) => (
            <article className={`bonus-card tone-${index + 1}`} key={title} data-reveal>
              <div className="bonus-icon"><Icon /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <span>Входит в фильм</span>
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
          <p className="section-kicker light">Сцена 06 · Большой экран</p>
          <h2 id="works-title">Вот как выглядит ваша премьера</h2>
        </div>
        <div className="showcase-screen">
          <video ref={videoRef} muted loop playsInline preload="none" poster={assetUrl("/img/frames/08.webp")} aria-label="Фрагмент фильма о предложении руки и сердца">
            <source src={`${assetUrl("/video/showcase.mp4")}?v=2`} type="video/mp4" />
          </video>
          <div className="showcase-vignette" />
          <div className="showcase-status"><span /> Фрагмент фильма · 00:24</div>
        </div>
        <div className="thesis-layer">
          {theses.map(([title, text], index) => (
            <article className={`thesis thesis-${index + 1}`} data-thesis key={title}>
              <span>0{index + 1}</span><h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
        <div className="showcase-scroll"><ArrowDown /> Листайте фильм</div>
      </div>

      <div className="container gallery-block">
        <div className="gallery-heading" data-reveal>
          <div><p className="section-kicker light">Стоп-кадры</p><h3>Одна история. Восемь миров.</h3></div>
          <p>Нажмите на кадр, чтобы рассмотреть детали.</p>
        </div>
        <div className="gallery-grid">
          {galleryFrames.map((frame, index) => (
            <button key={frame.src} onClick={() => setLightbox(index)} aria-label={`Открыть кадр ${index + 1}`}>
              <img src={frame.src} alt={frame.alt} width="1200" height="675" loading="lazy" />
              <span>0{index + 1} <Frame size={18} /></span>
            </button>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Просмотр кадра" onMouseDown={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Закрыть"><X /></button>
          <button className="lightbox-arrow prev" onMouseDown={(e) => e.stopPropagation()} onClick={() => setLightbox((lightbox - 1 + galleryFrames.length) % galleryFrames.length)} aria-label="Предыдущий кадр"><ArrowRight /></button>
          <figure onMouseDown={(event) => event.stopPropagation()}>
            <img src={galleryFrames[lightbox].src} alt={galleryFrames[lightbox].alt} />
            <figcaption><span>0{lightbox + 1}</span>{galleryFrames[lightbox].alt}</figcaption>
          </figure>
          <button className="lightbox-arrow next" onMouseDown={(e) => e.stopPropagation()} onClick={() => setLightbox((lightbox + 1) % galleryFrames.length)} aria-label="Следующий кадр"><ArrowRight /></button>
        </div>
      )}
    </section>
  );
}

function FilmPlayer() {
  const figureRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const figure = figureRef.current;
    const video = videoRef.current;
    if (!figure || !video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      video.preload = "metadata";
      video.load();
      if (!reduced) void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      observer.disconnect();
    }, { rootMargin: "100% 0px" });
    observer.observe(figure);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };
  return (
    <figure className="first-film" ref={figureRef} data-reveal>
      <video ref={videoRef} muted loop playsInline preload="none" poster={assetUrl("/img/frames/01.webp")} aria-label="Фрагмент первого свадебного мультфильма">
        <source src={assetUrl("/video/first-film.mp4")} type="video/mp4" />
      </video>
      <button onClick={toggle} aria-label={playing ? "Поставить на паузу" : "Продолжить просмотр"}>
        {playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
      </button>
      <figcaption><span /> Первый показ · август 2026</figcaption>
    </figure>
  );
}

function Trust() {
  const placesLeft = 10;
  return (
    <section id="trust" className="trust paper-section" aria-labelledby="trust-title">
      <div className="container trust-grid">
        <FilmPlayer />
        <div className="trust-copy" data-reveal>
          <p className="section-kicker">Сцена 07 · Честно</p>
          <h2 id="trust-title">Пока отзывов нет — есть кое-что лучше</h2>
          <p>Я начал делать это недавно и сейчас собираю первые работы. Поэтому первым десяти клиентам — цена ниже и максимум внимания к деталям.</p>
          <p>Взамен прошу разрешение показать готовый фильм в портфолио. Если история личная и показывать её нельзя — тоже нормально, просто скажите.</p>
          <div className="trust-actions">
            <button className="button button-primary" onClick={() => scrollToId("contact")}>Войти в первую десятку <ArrowRight size={19} /></button>
            <span className="places"><i /> Осталось мест: <b>{placesLeft}</b></span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Idea() {
  return (
    <section id="idea" className="idea night-section" aria-labelledby="idea-title">
      <div className="idea-beam" aria-hidden="true" />
      <div className="container idea-grid">
        <div className="idea-character" data-reveal>
          <div className="bulb"><Lightbulb /></div>
          <img src={assetUrl("/img/people/dmitriy.webp")} alt="Персонаж придумывает новую историю" width="680" height="1052" loading="lazy" />
          <div className="idea-bubbles"><i /><i /><i /></div>
        </div>
        <div className="idea-copy" data-reveal>
          <p className="section-kicker light">Сцена 08 · Без рамок</p>
          <h2 id="idea-title">У вас своя идея?</h2>
          <p>Не обязательно выбирать из готовых форматов. Расскажите, что придумали — и я скажу, как это сделать и сколько будет стоить. Даже если идея кажется странной. Особенно если кажется странной.</p>
          <div className="button-row">
            {CONTACTS.whatsapp && <a className="button button-primary" href={CONTACTS.whatsapp}>Написать лично <MessageCircle size={19} /></a>}
            <button className="button button-outline" onClick={() => scrollToId("contact")}>Заполнить бриф <PenLine size={18} /></button>
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
          <p className="section-kicker">Сцена 09 · Без сюрпризов</p>
          <h2 id="faq-title">Частые вопросы</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => {
            const isOpen = open === index;
            return (
              <article className={isOpen ? "open" : ""} key={question}>
                <h3>
                  <button onClick={() => setOpen(isOpen ? -1 : index)} aria-expanded={isOpen} aria-controls={`faq-answer-${index}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>{question}<ChevronDown />
                  </button>
                </h3>
                <div id={`faq-answer-${index}`} className="faq-answer"><p>{answer}</p></div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type FormFields = { name: string; contact: string; occasion: string; date: string; story: string };

function Contact() {
  const [fields, setFields] = useState<FormFields>({ name: "", contact: "", occasion: "Свадьба", date: "", story: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof FormFields, string>> = {};
    if (fields.name.trim().length < 2) nextErrors.name = "Как к вам обращаться?";
    if (fields.contact.trim().length < 5) nextErrors.contact = "Оставьте телефон, ник или e-mail";
    if (fields.story.trim().length < 8) nextErrors.story = "Расскажите хотя бы в двух словах";
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
          <p className="section-kicker">Сцена 10 · Начнём с разговора</p>
          <h2 id="contact-title">Расскажите, чей это будет фильм</h2>
          <p>Напишите повод и дату. Я отвечу сегодня, задам несколько вопросов и сразу скажу, какой формат подойдёт.</p>
          <div className="messenger-list">
            {CONTACTS.whatsapp && <a href={CONTACTS.whatsapp}><MessageCircle /><span><b>WhatsApp</b>Обычно отвечаю быстрее всего</span><ArrowRight /></a>}
            {CONTACTS.telegram && <a href={CONTACTS.telegram}><Send /><span><b>Telegram</b>Можно голосовым сообщением</span><ArrowRight /></a>}
            {CONTACTS.email && <a href={`mailto:${CONTACTS.email}`}><Mail /><span><b>E-mail</b>{CONTACTS.email}</span><ArrowRight /></a>}
          </div>
          {CONTACTS.city && <div className="contact-location"><MapPin /> {CONTACTS.city} · дистанционно по всей Европе</div>}
        </div>

        <form className={`brief-form ${sent ? "is-sent" : ""}`} onSubmit={submit} noValidate data-reveal>
          {sent ? (
            <div className="form-success" role="status">
              <div><Check /></div>
              <p>Получил. Отвечу сегодня.</p>
              <span>А пока можете сохранить страницу — ваша история уже сделала первый шаг к экрану.</span>
              <button type="button" className="text-link" onClick={() => setSent(false)}>Отправить ещё одну заявку</button>
            </div>
          ) : (
            <>
              <div className="form-heading"><span>Короткий бриф</span><b>≈ 2 минуты</b></div>
              <label>
                Как вас зовут?
                <input value={fields.name} onChange={(e) => update("name", e.target.value)} placeholder="Имя" aria-invalid={Boolean(errors.name)} />
                {errors.name && <small>{errors.name}</small>}
              </label>
              <label>
                Куда ответить?
                <input value={fields.contact} onChange={(e) => update("contact", e.target.value)} placeholder="Телефон, Telegram или e-mail" aria-invalid={Boolean(errors.contact)} />
                {errors.contact && <small>{errors.contact}</small>}
              </label>
              <div className="form-row">
                <label>
                  Повод
                  <select value={fields.occasion} onChange={(e) => update("occasion", e.target.value)}>
                    {occasions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label>
                  Дата показа
                  <input type="date" value={fields.date} onChange={(e) => update("date", e.target.value)} />
                </label>
              </div>
              <label>
                О чём ваша история?
                <textarea value={fields.story} onChange={(e) => update("story", e.target.value)} placeholder="Например: познакомились в поезде, а предложение было в Венеции…" rows={4} aria-invalid={Boolean(errors.story)} />
                {errors.story && <small>{errors.story}</small>}
              </label>
              <button className="button button-primary submit-button" type="submit">Отправить историю <ArrowRight /></button>
              <p className="privacy-note">Нажимая кнопку, вы соглашаетесь на обработку данных только для ответа на заявку. <a href={pageUrl("/datenschutz")}>Подробнее</a>.</p>
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
            <p>Настоящие истории.<br />Большая семейная анимация.</p>
          </div>
          <div className="footer-links">
            <div><span>Сцены</span>{navItems.slice(0, 4).map(([label, id]) => <button key={id} onClick={() => scrollToId(id)}>{label}</button>)}</div>
            <div><span>Связь</span>{CONTACTS.whatsapp && <a href={CONTACTS.whatsapp}>WhatsApp</a>}{CONTACTS.telegram && <a href={CONTACTS.telegram}>Telegram</a>}{CONTACTS.email && <a href={`mailto:${CONTACTS.email}`}>E-mail</a>}</div>
            <div><span>Документы</span><a href={pageUrl("/impressum")}>Impressum</a><a href={pageUrl("/datenschutz")}>Datenschutz</a><button disabled>RU · DE скоро</button></div>
          </div>
        </div>

        <div className="footer-cast" aria-label="Герои наших историй">
          {footerPeople.map(([src, alt], index) => (
            <div className={`cast-member cast-${index + 1}`} key={src}>
              <img src={src} alt={alt} width="120" height="120" loading="lazy" />
              <span aria-hidden="true">👋</span>
            </div>
          ))}
          <p>До встречи<br />на премьере</p>
        </div>

        <div className="footer-bottom">
          <span>© 2026 FIID Cinema · Ульм, Германия</span>
          <span>Сайт собран с вниманием в <a href="https://fiidagency.com" target="_blank" rel="noreferrer">fiidagency.com</a></span>
        </div>
      </div>
    </footer>
  );
}

function LegalPage({ type }: { type: "impressum" | "datenschutz" }) {
  const isImpressum = type === "impressum";
  return (
    <main className="legal-page night-section">
      <a className="brand" href={baseUrl}><span className="brand-mark"><Film size={21} /></span><span>FIID <i>CINEMA</i></span></a>
      <div>
        <p className="eyebrow">Юридическая информация</p>
        <h1>{isImpressum ? "Impressum" : "Datenschutz"}</h1>
        <p>{isImpressum ? "Здесь будут размещены данные владельца сайта и контактная информация в соответствии с требованиями законодательства Германии." : "Здесь будет размещена политика обработки персональных данных и информация об используемых сервисах."}</p>
        <p>Перед публикацией замените этот текст на финальную юридическую редакцию.</p>
        <a className="button button-primary" href={baseUrl}>Вернуться к фильму <ArrowRight /></a>
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
      let pendingVideoFrame = 0;

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
          const horizontalDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);
          gsap.to(track, {
            x: () => -horizontalDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: process,
              start: "top top",
              end: () => `+=${Math.max(1050, horizontalDistance() * 0.9 + 520)}`,
              scrub: 0.45,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
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
                scrub: 0.42,
                pin: true,
                onUpdate: (self) => {
                  if (Number.isFinite(video.duration) && video.duration > 0) {
                    const targetTime = Math.min(video.duration - 0.05, video.duration * self.progress);
                    if (Math.abs(video.currentTime - targetTime) < 0.12 || video.seeking || pendingVideoFrame) return;
                    pendingVideoFrame = requestAnimationFrame(() => {
                      video.currentTime = targetTime;
                      pendingVideoFrame = 0;
                    });
                  }
                },
              },
            });
            timeline.fromTo(".showcase-screen", { scale: 0.84, borderRadius: 28 }, { scale: 1, borderRadius: 0, duration: 0.55, ease: "power2.out" }, 0);
            cards.forEach((card, index) => {
              const fromX = index % 2 === 0 ? -70 : 70;
              timeline.fromTo(card, { opacity: 0, x: fromX, y: 12, filter: "blur(8px)" }, { opacity: 1, x: 0, y: 0, filter: "blur(0px)", duration: 0.26 }, 0.4 + index * 0.55);
              timeline.to(card, { opacity: 0, y: -28, duration: 0.2 }, 0.76 + index * 0.55);
            });
          }
        }

        ScrollTrigger.refresh();
      });
      cleanup = () => {
        if (pendingVideoFrame) cancelAnimationFrame(pendingVideoFrame);
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
      <a className="skip-link" href="#hero">Перейти к содержанию</a>
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
        <Idea />
        <FAQ />
        <Contact />
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
  const path = resolvedPath.length > 1 ? resolvedPath.replace(/\/$/, "") : resolvedPath;
  if (path === "/impressum") return <LegalPage type="impressum" />;
  if (path === "/datenschutz") return <LegalPage type="datenschutz" />;
  return <Site />;
}
