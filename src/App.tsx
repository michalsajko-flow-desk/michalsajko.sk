import { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Linkedin, Mail, Menu, Phone, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { siClickup, siGooglechat, siGoogleforms, siJira, siTrello } from 'simple-icons/icons';

gsap.registerPlugin(ScrollTrigger);

const calendly = 'https://calendly.com/michal-sajko-wqni/30min';
const steps = [
  ['01', 'Formulár', 'Klient odošle požiadavku'],
  ['02', 'FlowDesk', 'Automaticky spracuje a rozdelí'],
  ['03', 'Task manager', 'Vznikne nová úloha'],
  ['04', 'Notifikácia tímu', 'Tím vie okamžite, bez kopírovania'],
];
const tools = [
  { name: 'Google Forms', icon: siGoogleforms },
  { name: 'Trello', icon: siTrello },
  { name: 'Jira', icon: siJira },
  { name: 'Slack', icon: null },
  { name: 'Google Chat', icon: siGooglechat },
  { name: 'ClickUp', icon: siClickup },
  { name: 'Microsoft Excel', icon: null },
  { name: 'Microsoft Teams', icon: null },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = prefersReducedMotion ? null : new Lenis({ duration: 1.1, smoothWheel: true });
    const tick = (time: number) => {
      lenis?.raf(time * 1000);
      ScrollTrigger.update();
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--scroll', `${scrollable ? (window.scrollY / scrollable) * 100 : 0}%`);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    const ctx = gsap.context(() => {
      gsap.from('.hero-word', { yPercent: 110, opacity: 0, duration: 0.85, stagger: 0.07, ease: 'power3.out', delay: 0.15 });
      gsap.from('.hero-visual', { scale: 0.92, opacity: 0, duration: 1.1, ease: 'expo.out', delay: 0.25 });
      gsap.to('.hero-visual', { y: -14, duration: 2.6, ease: 'sine.inOut', repeat: -1, yoyo: true });
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((item) => {
        gsap.from(item, { y: 36, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 84%' } });
      });
      gsap.utils.toArray<HTMLElement>('.scrub-word').forEach((item) => {
        gsap.to(item, { opacity: 1, color: '#191726', scrollTrigger: { trigger: item, start: 'top 82%', end: 'top 42%', scrub: true } });
      });
      gsap.to('.texture-layer', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '#o-mne', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.to('.cta-panel', { width: '100%', borderRadius: '24px', scrollTrigger: { trigger: '.cta-wrap', start: 'top 78%', end: 'top 32%', scrub: true } });
      if (!prefersReducedMotion) {
        ScrollTrigger.create({
          trigger: '.flow-stage', start: 'top top+=100', end: 'bottom bottom-=100',
          pin: '.flow-copy', scrub: true,
          onUpdate: (self) => setActiveStep(Math.min(3, Math.floor(self.progress * 4))),
        });
      }
    }, appRef);

    return () => { ctx.revert(); lenis?.destroy(); gsap.ticker.remove(tick); window.removeEventListener('scroll', updateProgress); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <div ref={appRef} className="site-shell">
      <div className="scroll-progress" />
      <header className={`site-header ${menuOpen ? 'is-open' : ''}`}>
        <a className="brand" href="#top" aria-label="Michal Sajko domov"><span className="brand-mark">ms</span><span>Michal Sajko</span></a>
        <nav className="desktop-nav" aria-label="Hlavná navigácia">
          <a href="#o-mne">O mne</a><a href="#flowdesk">FlowDesk</a><a href="https://flow-desk.michalsajko.sk/case-study">Case study <ArrowUpRight size={14} /></a>
        </nav>
        <a className="button button-small header-cta" href={calendly}>Dohodnúť hovor <ArrowUpRight size={14} /></a>
        <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Zavrieť menu' : 'Otvoriť menu'}>{menuOpen ? <X /> : <Menu />}</button>
        <div className="mobile-nav"><a href="#o-mne" onClick={() => setMenuOpen(false)}>O mne</a><a href="#flowdesk" onClick={() => setMenuOpen(false)}>FlowDesk</a><a href="https://flow-desk.michalsajko.sk/case-study">Case study <ArrowUpRight size={18} /></a><a className="button" href={calendly}>Dohodnúť hovor <ArrowUpRight size={18} /></a></div>
      </header>

      <main id="top">
        <section className="hero section-white">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> IT konzultant <i>·</i> Workflow Automation</div>
              <h1>{['Procesy,', 'ktoré', 'fungujú', 'bez vás.'].map((word) => <span key={word} className={`hero-word ${word === 'fungujú' ? 'accent-italic' : ''}`}>{word} </span>)}</h1>
              <p className="hero-lead">Prepojím váš formulár, task manager a firemný chat do jedného automatizovaného systému. Jednorazovo, bez mesačných poplatkov.</p>
              <div className="hero-actions"><a className="button" href={calendly}>Dohodnúť hovor zadarmo <ArrowUpRight size={17} /></a><a className="text-link" href="#flowdesk">Ako to funguje <ArrowDownRight size={17} /></a></div>
              <p className="microcopy">30 min hovor zadarmo <span /> nastavenie do 5 dní</p>
            </div>
            <div className="hero-art"><div className="art-orbit" /><img className="hero-visual" src="/images/hero-flow.webp" alt="Prepojenie formulára, task listu a chatu" width="900" height="700" /></div>
          </div>
        </section>

        <section className="tools-strip" aria-label="Nástroje, ktoré prepájam"><div className="container"><p className="mono-label">Prepájam nástroje, ktoré už používate</p><div className="marquee-mask"><div className="marquee-track">{[...tools, ...tools].map((tool, index) => <div className="tool-item" key={`${tool.name}-${index}`}>{tool.icon ? <svg className="tool-icon" viewBox="0 0 24 24" aria-hidden="true"><path d={tool.icon.path} /></svg> : null}{tool.name}</div>)}</div></div></div></section>

        <section id="o-mne" className="about section-lavender"><img className="texture-layer" src="/images/texture.webp" alt="" aria-hidden="true" /><div className="container about-grid"><div className="about-copy"><p className="section-kicker reveal">01 / Kto som</p><h2 className="reveal">7+ rokov v digitálnych produktoch a procesnej automatizácii.</h2><p className="body-large reveal">{'IT projektový manažér so skúsenosťami z digitalizácie verejnej správy, e-commerce platforiem, software house a fintech aplikácií. Poznám procesy malých aj veľkých tímov — a viem, kde presne vznikajú straty času.'.split(' ').map((word, index) => <span className="scrub-word" key={`${word}-${index}`}>{word} </span>)}</p><p className="body-large muted reveal">Dnes túto skúsenosť ponúkam malým firmám cez FlowDesk — jednorazovú implementáciu automatizácie, po ktorej systém funguje úplne samostatne, bez závislosti odo mňa.</p></div><div className="profile-card reveal"><div className="availability"><span /> Voľný termín</div><img src="/images/michal.webp" alt="Michal Sajko" width="640" height="760" loading="lazy" /><div className="profile-meta"><h3>Michal Sajko</h3><p>IT Project Manager &amp; Workflow Automation</p><a href="https://www.linkedin.com/in/michal-sajko-624979176/">Viac info na LinkedIne <ArrowUpRight size={15} /></a></div></div></div></section>

        <section id="flowdesk" className="flowdesk section-white"><div className="container flow-stage"><div className="flow-copy"><p className="section-kicker">02 / Moja služba</p><h2>FlowDesk — koniec chaosu v komunikácii tímu.</h2><div className="step-detail"><div className="step-number">{steps[activeStep][0]} <span>/ 04</span></div><p className="step-title">{steps[activeStep][1]}</p><p className="step-description">{steps[activeStep][2]}</p></div><div className="step-progress">{steps.map((step, index) => <span key={step[0]} className={index <= activeStep ? 'active' : ''} />)}</div><div className="flow-actions"><a className="button" href="https://flow-desk.michalsajko.sk/">Pozrieť FlowDesk <ArrowUpRight size={17} /></a><a className="text-link" href="https://flow-desk.michalsajko.sk/case-study">Čítať case study <ArrowUpRight size={16} /></a></div></div><div className="engine-wrap"><img src="/images/engine.webp" alt="FlowDesk automatizačný engine" width="1000" height="760" loading="lazy" /><div className={`engine-pulse pulse-${activeStep + 1}`} /></div><div className="mobile-steps">{steps.map((step) => <div className="mobile-step" key={step[0]}><span>{step[0]}</span><div><strong>{step[1]}</strong><p>{step[2]}</p></div></div>)}</div></div></section>

        <section className="cta-wrap"><div className="cta-panel"><div className="cta-content"><p className="section-kicker light">03 / Začnime</p><h2>Prvý hovor <span>zadarmo.</span></h2><p>30 minút, bez záväzkov. Zistíme, či a ako vám vieme pomôcť.</p><a className="button button-light" href={calendly}>Dohodnúť hovor zadarmo <ArrowUpRight size={17} /></a><small>Odpovedám do 24 hodín</small><div className="contact-chips"><a href="mailto:michal.sajko@gmail.com"><Mail size={15} /> michal.sajko@gmail.com</a><a href="tel:+421914703355"><Phone size={15} /> +421 914 703 355</a></div></div></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-inner"><p>© 2026 Michal Sajko. Všetky práva vyhradené.</p><div><a href="https://flow-desk.michalsajko.sk/">Web FlowDesk <ArrowUpRight size={14} /></a><a href="mailto:michal.sajko@gmail.com">Email</a><a href="tel:+421914703355">Telefón</a><a href="https://www.linkedin.com/in/michal-sajko-624979176/"><Linkedin size={15} /> LinkedIn</a></div></div></footer>
    </div>
  );
}

export default App;
