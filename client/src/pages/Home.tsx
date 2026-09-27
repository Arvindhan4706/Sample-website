import { ChangeEvent, FormEvent, ReactNode, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  Palette,
  Paperclip,
  Plus,
  Send,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import {
  BRAND_NAME,
  buildWhatsAppUrl,
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  Product,
  ProductCategory,
  products,
} from "@/lib/products";

type FormValues = {
  name: string;
  phone: string;
  email: string;
  category: ProductCategory | "";
  product: string;
  colour: string;
  personalisation: string;
  size: string;
  budget: string;
  details: string;
};

const initialForm: FormValues = {
  name: "",
  phone: "",
  email: "",
  category: "",
  product: "",
  colour: "",
  personalisation: "",
  size: "",
  budget: "",
  details: "",
};

const steps = [
  { number: "01", title: "Choose a piece", text: "Start with a sample idea or tell us what you have in mind." },
  { number: "02", title: "Share your details", text: "Colour, size, name, occasion — the little things matter." },
  { number: "03", title: "Send inspiration", text: "A reference image helps us understand the feeling you want." },
  { number: "04", title: "Make it together", text: "We’ll chat, confirm the details and shape your custom piece." },
];

const formFields: Array<{ key: keyof FormValues; label: string; placeholder: string }> = [
  { key: "colour", label: "Colour direction", placeholder: "e.g. terracotta, soft blue, neutrals" },
  { key: "personalisation", label: "Name or text to include", placeholder: "A name, date, initials or short phrase" },
  { key: "size", label: "Preferred size", placeholder: "If you have one in mind" },
];

function SectionHeading({ eyebrow, title, description, align = "left" }: { eyebrow: string; title: ReactNode; description?: string; align?: "left" | "center" }) {
  return (
    <div className={`section-heading ${align === "center" ? "section-heading-center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a className={`brand-mark ${light ? "brand-mark-light" : ""}`} href="#top" aria-label={`${BRAND_NAME} home`}>
      <span className="brand-symbol">m</span>
      <span>
        <strong>{BRAND_NAME}</strong>
        <small>handmade, slowly</small>
      </span>
    </a>
  );
}

function CategoryCard({ category, image, description, number, onExplore }: { category: ProductCategory; image: string; description: string; number: string; onExplore: (category: ProductCategory) => void }) {
  return (
    <article className={`category-card ${category === "Crochet" ? "category-card-crochet" : ""}`}>
      <img src={image} alt={`${category} handmade sample pieces`} loading="lazy" />
      <div className="category-card-overlay" />
      <div className="category-card-top"><span>{number}</span><ArrowUpRight size={19} /></div>
      <div className="category-card-content">
        <p className="eyebrow eyebrow-light">collection</p>
        <h3>{category}</h3>
        <p>{description}</p>
        <button className="text-button text-button-light" type="button" onClick={() => onExplore(category)}>
          Explore {category} <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

function ProductCard({ product, onRequest }: { product: Product; onRequest: (product: Product) => void }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={`${product.name}, ${product.category} sample listing`} loading="lazy" />
        <span className="product-tag">{product.category}</span>
        {product.customisable ? <span className="product-custom"><Sparkles size={12} /> made personal</span> : null}
        <button className="product-plus" type="button" onClick={() => onRequest(product)} aria-label={`Request ${product.name}`}><Plus size={19} /></button>
      </div>
      <div className="product-card-body">
        <div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
        <div className="product-card-meta">
          <span>{product.price}</span>
          <button type="button" className="product-request-link" onClick={() => onRequest(product)}>Request <ArrowUpRight size={14} /></button>
        </div>
      </div>
    </article>
  );
}

function OrderForm({ selectedProduct, onClearSelected, onWhatsAppFallback }: { selectedProduct: Product | null; onClearSelected: () => void; onWhatsAppFallback: () => void }) {
  const [values, setValues] = useState<FormValues>(() => ({ ...initialForm, category: selectedProduct?.category ?? "", product: selectedProduct?.name ?? "" }));
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const visibleProducts = useMemo(() => values.category ? products.filter((product) => product.category === values.category) : products, [values.category]);

  const updateValue = (key: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    if (submitted) setSubmitted(false);
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/")) {
      setErrors((current) => ({ ...current, details: "Please choose a JPG, PNG or WEBP image." }));
      return;
    }
    if (nextFile.size > 5 * 1024 * 1024) {
      setErrors((current) => ({ ...current, details: "That image is over 5MB. Please choose a smaller file." }));
      return;
    }
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
    setErrors((current) => ({ ...current, details: "" }));
  };

  const removeFile = () => {
    setFile(null);
    setPreview("");
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    if (!values.name.trim()) nextErrors.name = "Please add your name.";
    if (!values.phone.trim()) nextErrors.phone = "Please add a WhatsApp number.";
    if (!values.category) nextErrors.category = "Choose a category to get started.";
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = "Please check the email address.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const message = `Hi, I'd like to enquire about a custom ${values.product || values.category || "piece"}. My name is ${values.name}. ${values.details || "I have a custom idea to discuss."}${values.colour ? ` Colour: ${values.colour}.` : ""}${values.personalisation ? ` Personalisation: ${values.personalisation}.` : ""}`;
  const whatsappUrl = buildWhatsAppUrl(message);

  return (
    <div className="order-form-shell">
      {submitted ? (
        <div className="success-state">
          <div className="success-icon"><CircleCheck size={28} /></div>
          <p className="eyebrow">request saved in this session</p>
          <h3>Your custom request is ready.</h3>
          <p>Thanks, {values.name.split(" ")[0] || "there"}. We’ve captured your requirements in the form. Continue the conversation on WhatsApp once the real number is connected.</p>
          <div className="success-summary">
            <span>{values.category}{values.product ? ` · ${values.product}` : ""}</span>
            {file ? <span><Paperclip size={14} /> {file.name}</span> : null}
          </div>
          {whatsappUrl ? <a className="button button-primary" href={whatsappUrl} target="_blank" rel="noreferrer">Continue on WhatsApp <ArrowUpRight size={17} /></a> : <button className="button button-primary" type="button" onClick={onWhatsAppFallback}>Connect WhatsApp number <ArrowUpRight size={17} /></button>}
          <button className="text-button muted-button" type="button" onClick={() => setSubmitted(false)}>Edit request</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-section-head">
            <div><span className="form-step">01</span><div><p className="eyebrow">start here</p><h3>Tell us a little about you</h3></div></div>
            <span className="required-note">* required</span>
          </div>
          <div className="form-grid">
            <label className="field"><span>Name <b>*</b></span><input value={values.name} onChange={(event) => updateValue("name", event.target.value)} placeholder="Your name" aria-invalid={Boolean(errors.name)} />{errors.name ? <em>{errors.name}</em> : null}</label>
            <label className="field"><span>Phone / WhatsApp <b>*</b></span><input value={values.phone} onChange={(event) => updateValue("phone", event.target.value)} placeholder="Best number to reach you" inputMode="tel" aria-invalid={Boolean(errors.phone)} />{errors.phone ? <em>{errors.phone}</em> : null}</label>
            <label className="field"><span>Email <small>optional</small></span><input value={values.email} onChange={(event) => updateValue("email", event.target.value)} placeholder="you@example.com" type="email" aria-invalid={Boolean(errors.email)} />{errors.email ? <em>{errors.email}</em> : null}</label>
          </div>

          <div className="form-section-head form-section-head-spaced">
            <div><span className="form-step">02</span><div><p className="eyebrow">your idea</p><h3>What would you like made?</h3></div></div>
          </div>
          <div className="form-grid">
            <label className="field"><span>Product category <b>*</b></span><div className="select-wrap"><select value={values.category} onChange={(event) => updateValue("category", event.target.value as ProductCategory | "")} aria-invalid={Boolean(errors.category)}><option value="">Choose one</option><option value="Resin">Resin</option><option value="Crochet">Crochet</option></select><ChevronDown size={17} /></div>{errors.category ? <em>{errors.category}</em> : null}</label>
            <label className="field"><span>Product or item <small>optional</small></span><div className="select-wrap"><select value={values.product} onChange={(event) => updateValue("product", event.target.value)}><option value="">I’m open to ideas</option>{visibleProducts.map((product) => <option value={product.name} key={product.id}>{product.name}</option>)}</select><ChevronDown size={17} /></div></label>
          </div>
          <div className="form-grid form-grid-three">
            {formFields.map((field) => <label className="field" key={field.key}><span>{field.label} <small>optional</small></span><input value={values[field.key]} onChange={(event) => updateValue(field.key, event.target.value)} placeholder={field.placeholder} /></label>)}
          </div>
          <label className="field field-wide"><span>Tell us what you’d like <small>optional</small></span><textarea value={values.details} onChange={(event) => updateValue("details", event.target.value)} placeholder="Describe your idea, preferred colours, theme, occasion, size or anything else you’d like us to know." rows={5} /></label>

          <div className="upload-grid">
            <div className="upload-copy"><span className="form-step">03</span><p className="eyebrow">inspiration welcome</p><h3>Have a reference image?</h3><p>Upload a photo, sketch or colour reference. This stays in your browser for now and will be ready to connect to a real upload API later.</p><span className="upload-note">JPG, PNG or WEBP · max 5MB</span></div>
            <div className={`upload-dropzone ${preview ? "upload-dropzone-filled" : ""}`}>
              {preview ? <><img src={preview} alt="Selected reference preview" /><div className="upload-file-row"><span><Paperclip size={14} /> {file?.name}</span><button type="button" onClick={removeFile} aria-label="Remove reference image"><X size={16} /></button></div></> : <label className="upload-label"><UploadCloud size={27} /><strong>Drop an image here</strong><span>or tap to browse</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} /></label>}
            </div>
          </div>
          {errors.details ? <p className="form-error upload-error">{errors.details}</p> : null}

          <div className="form-section-head form-section-head-spaced compact-head"><div><span className="form-step">04</span><div><p className="eyebrow">a rough guide</p><h3>Approximate budget</h3></div></div><span className="required-note">optional</span></div>
          <div className="budget-options" role="radiogroup" aria-label="Approximate budget">
            {["Under ₹500", "₹500–₹1,000", "₹1,000–₹2,000", "₹2,000+", "Not sure yet"].map((budget) => <label className={`budget-option ${values.budget === budget ? "budget-option-active" : ""}`} key={budget}><input type="radio" name="budget" value={budget} checked={values.budget === budget} onChange={(event) => updateValue("budget", event.target.value)} /><span>{budget}</span>{values.budget === budget ? <Check size={14} /> : null}</label>)}
          </div>
          <div className="form-submit-row"><p>We’ll reply with next steps, availability and a quote. This is an enquiry, not a confirmed order.</p><button className="button button-primary" type="submit">Send my request <Send size={16} /></button></div>
        </form>
      )}
      {selectedProduct ? <button className="form-product-pill" type="button" onClick={onClearSelected}><span>Requesting</span> {selectedProduct.name}<X size={14} /></button> : null}
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"All" | ProductCategory>("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [notice, setNotice] = useState("");

  const filteredProducts = activeCategory === "All" ? products : products.filter((product) => product.category === activeCategory);
  const featuredProducts = products.filter((product) => product.featured);

  const closeMenu = () => setMenuOpen(false);
  const jumpToOrder = (product?: Product) => {
    if (product) setSelectedProduct(product);
    closeMenu();
    window.setTimeout(() => document.getElementById("custom-order")?.scrollIntoView({ behavior: "smooth" }), 30);
  };
  const exploreCategory = (category: ProductCategory) => {
    setActiveCategory(category);
    window.setTimeout(() => document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" }), 30);
  };
  const handleWhatsAppFallback = () => {
    setNotice("Add the real WhatsApp number in client/src/lib/products.ts to activate direct chat links.");
    window.setTimeout(() => setNotice(""), 5000);
  };

  return (
    <div className="site-shell" id="top">
      <header className="site-nav">
        <div className="container nav-inner">
          <Logo />
          <nav className={`desktop-nav ${menuOpen ? "desktop-nav-open" : ""}`} aria-label="Primary navigation">
            <a href="#collections" onClick={closeMenu}>Collections</a>
            <a href="#custom-order" onClick={closeMenu}>Custom orders</a>
            <a href="#about" onClick={closeMenu}>Our approach</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
          </nav>
          <div className="nav-actions"><a className="nav-instagram" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a><button type="button" className="button button-dark button-small nav-cta" onClick={() => jumpToOrder()}>Custom order <ArrowUpRight size={15} /></button><button type="button" className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button></div>
        </div>
        {menuOpen ? <div className="mobile-menu"><a href="#collections" onClick={closeMenu}>Collections <ArrowRight size={16} /></a><a href="#custom-order" onClick={closeMenu}>Custom orders <ArrowRight size={16} /></a><a href="#about" onClick={closeMenu}>Our approach <ArrowRight size={16} /></a><a href="#contact" onClick={closeMenu}>Contact <ArrowRight size={16} /></a></div> : null}
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-backdrop" />
          <div className="container hero-grid">
            <div className="hero-copy"><div className="hero-kicker"><span className="kicker-dot" /> small-batch handmade studio <span className="kicker-line" /></div><h1>Pieces that feel <em>like you.</em></h1><p className="hero-lede">Resin keepsakes and crochet treasures, made slowly and personalised with care for the people and moments you want to hold onto.</p><div className="hero-actions"><button className="button button-primary" type="button" onClick={() => jumpToOrder()}>Create a custom order <ArrowUpRight size={17} /></button><a className="button button-quiet" href="#collections">Explore the pieces <ArrowDownRight size={16} /></a></div><div className="hero-aside"><span>01 / 04</span><span className="hero-rule" /><span>made for gifting & keeping</span></div></div>
            <div className="hero-visual"><div className="hero-image-frame"><img src="/manus-storage/hero-handmade-studio_d15c333f.jpg" alt="Warm handmade studio table with resin and crochet pieces" /></div><div className="hero-stamp"><span>made</span><strong>with<br />intention</strong><span>♡</span></div><div className="hero-float-note"><Heart size={14} fill="currentColor" /> nothing mass-made here</div></div>
          </div>
          <div className="hero-bottom container"><span>scroll to explore</span><div className="scroll-line" /><span>⌄</span></div>
        </section>

        <section className="ticker"><div className="ticker-track"><span>resin pieces</span><i>✦</i><span>crochet treasures</span><i>✦</i><span>made personal</span><i>✦</i><span>thoughtfully handmade</span><i>✦</i><span>resin pieces</span><i>✦</i><span>crochet treasures</span><i>✦</i></div></section>

        <section className="section categories-section" id="collections">
          <div className="container"><div className="section-intro-row"><SectionHeading eyebrow="the collections" title={<>Made from <em>feeling.</em></>} description="A small edit of resin and crochet pieces to start with. Every idea can be adapted to your colours, words and occasion." /><span className="section-index">01 — 04</span></div><div className="category-grid"><CategoryCard category="Resin" number="01" image="/manus-storage/resin-collection_5b8bc6eb.jpg" description="Layered, translucent and full of little details worth looking closer at." onExplore={exploreCategory} /><CategoryCard category="Crochet" number="02" image="/manus-storage/crochet-collection_0361937f.jpg" description="Soft, tactile and made one careful stitch at a time for a gentle everyday joy." onExplore={exploreCategory} /></div></div>
        </section>

        <section className="section featured-section">
          <div className="container"><div className="section-intro-row featured-header"><SectionHeading eyebrow="sample catalogue · replace with final stock" title={<>A few things we’d <em>make.</em></>} description="These are sample listings to show the shape of the catalogue. Final product names, photos and pricing can drop in here later." /><a className="text-button" href="#collections">View all pieces <ArrowRight size={16} /></a></div><div className="product-grid">{featuredProducts.slice(0, 4).map((product) => <ProductCard product={product} onRequest={jumpToOrder} key={product.id} />)}</div><div className="catalogue-note"><span><Sparkles size={16} /> customisation is always part of the conversation</span><button className="text-button" type="button" onClick={() => jumpToOrder()}>Have a different idea? <ArrowRight size={16} /></button></div></div>
        </section>

        <section className="custom-band section" id="custom-order"><div className="container custom-band-grid"><div className="custom-band-copy"><p className="eyebrow eyebrow-light">the best part</p><h2>Made <em>your way.</em></h2><p>Choose your colours, names, sizes and all the tiny preferences that turn a handmade piece into yours. Have an inspiration image? Bring it along.</p><button className="button button-cream" type="button" onClick={() => document.getElementById("request-form")?.scrollIntoView({ behavior: "smooth" })}>Request a custom order <ArrowUpRight size={17} /></button><div className="custom-band-signature"><span>your idea</span><ArrowRight size={15} /><span>our hands</span></div></div><div className="custom-band-visual"><img src="/manus-storage/custom-detail_8f26ac13.jpg" alt="Maker hands working beside yarn and resin materials" loading="lazy" /><div className="round-note">no two<br /><em>ever</em><br />the same</div></div></div></section>

        <section className="section process-section"><div className="container"><div className="section-intro-row"><SectionHeading eyebrow="how it works" title={<>A little <em>conversation</em> first.</>} description="No checkout, no rush. Just a simple way to share your idea and see what we can make together." /><span className="section-index">02 — 04</span></div><div className="steps-grid">{steps.map((step, index) => <div className="step-card" key={step.number}><span className="step-number">{step.number}</span><div className="step-icon">{index === 0 ? <PackageCheck size={21} /> : index === 1 ? <Palette size={21} /> : index === 2 ? <Paperclip size={21} /> : <MessageCircle size={21} />}</div><h3>{step.title}</h3><p>{step.text}</p>{index < steps.length - 1 ? <ArrowRight className="step-arrow" size={18} /> : null}</div>)}</div></div></section>

        <section className="section collection-section"><div className="container"><div className="section-intro-row"><SectionHeading eyebrow="browse the sample edit" title={<>Find your <em>starting point.</em></>} description="Use a piece below as a prompt, or start with a blank idea. Sample catalogue content is ready to swap for the final collection." /><span className="section-index">03 — 04</span></div><div className="filter-row" role="tablist" aria-label="Filter sample pieces">{["All", "Resin", "Crochet"].map((category) => <button className={`filter-button ${activeCategory === category ? "filter-button-active" : ""}`} type="button" role="tab" aria-selected={activeCategory === category} onClick={() => setActiveCategory(category as "All" | ProductCategory)} key={category}>{category}<span>{category === "All" ? products.length : products.filter((product) => product.category === category).length}</span></button>)}</div><div className="product-grid product-grid-large">{filteredProducts.map((product) => <ProductCard product={product} onRequest={jumpToOrder} key={product.id} />)}</div></div></section>

        <section className="section about-section" id="about"><div className="container about-grid"><div className="about-visual"><img src="/manus-storage/detail-still-life_a95c93c7.jpg" alt="A resin keychain and crochet heart on textured paper" loading="lazy" /><span className="about-vertical">the little details matter</span></div><div className="about-copy"><p className="eyebrow">our approach</p><h2>Small things, <em>held close.</em></h2><p className="about-lede">This is a working space for thoughtful handmade pieces — the sort of objects that make a desk feel like yours, a gift feel more personal, or an ordinary day a little softer.</p><div className="about-points"><div><span>01</span><strong>Made in small batches</strong><p>Slow enough to notice the details. Nothing here is rushed for the sake of volume.</p></div><div><span>02</span><strong>Personal by design</strong><p>Colours, words, textures and small changes are welcome from the start.</p></div><div><span>03</span><strong>A real conversation</strong><p>We’ll talk through your idea honestly before anything is confirmed.</p></div></div><button className="text-button" type="button" onClick={() => jumpToOrder()}>Bring us an idea <ArrowRight size={16} /></button></div></div></section>

        <section className="section form-section" id="request-form"><div className="container"><div className="section-intro-row"><SectionHeading eyebrow="custom order enquiry" title={<>Let’s make room for <em>your idea.</em></>} description="Tell us what you’re imagining. The more or less detail you have is completely fine — we can shape the rest together." /><span className="section-index">04 — 04</span></div><OrderForm selectedProduct={selectedProduct} onClearSelected={() => setSelectedProduct(null)} onWhatsAppFallback={handleWhatsAppFallback} /></div></section>

        <section className="social-section"><div className="container social-grid"><div><p className="eyebrow">follow along</p><h2>Little moments from the <em>studio.</em></h2><p className="section-description">A placeholder for the real feed once the Instagram link and images are ready.</p><a className="button button-outline" href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><Instagram size={17} /> Visit Instagram <ArrowUpRight size={15} /></a></div><div className="social-images"><img src="/manus-storage/detail-still-life_a95c93c7.jpg" alt="Sample handmade still life" loading="lazy" /><img src="/manus-storage/resin-collection_5b8bc6eb.jpg" alt="Sample resin collection" loading="lazy" /><img src="/manus-storage/crochet-collection_0361937f.jpg" alt="Sample crochet collection" loading="lazy" /></div></div></section>
      </main>

      <footer className="site-footer" id="contact"><div className="container footer-grid"><div className="footer-brand"><Logo light /><p>Resin keepsakes and crochet treasures, made slowly and personalised with care.</p><span className="footer-placeholder">Brand name and contact details are editable placeholders.</span></div><div className="footer-links"><div><p className="footer-label">Explore</p><a href="#collections">Collections</a><a href="#custom-order">Custom orders</a><a href="#about">Our approach</a></div><div><p className="footer-label">Say hello</p><button type="button" onClick={handleWhatsAppFallback}><MessageCircle size={15} /> WhatsApp</button><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><Instagram size={15} /> Instagram</a>{CONTACT_EMAIL ? <a href={`mailto:${CONTACT_EMAIL}`}><Mail size={15} /> Email</a> : <span className="footer-muted"><Mail size={15} /> Email to be added</span>}</div><div><p className="footer-label">Studio notes</p><span className="footer-muted"><Clock3 size={15} /> made to order</span><span className="footer-muted"><MapPin size={15} /> location to be added</span><span className="footer-muted"><Heart size={15} /> no mass production</span></div></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {BRAND_NAME} · sample frontend</span><span>made with care, not urgency <span className="footer-heart">♡</span></span></div></footer>

      <button className="floating-whatsapp" type="button" onClick={handleWhatsAppFallback}><MessageCircle size={18} fill="currentColor" /><span>WhatsApp</span></button>
      {notice ? <div className="notice" role="status"><Sparkles size={16} />{notice}<button type="button" onClick={() => setNotice("")} aria-label="Dismiss notice"><X size={15} /></button></div> : null}
    </div>
  );
}
