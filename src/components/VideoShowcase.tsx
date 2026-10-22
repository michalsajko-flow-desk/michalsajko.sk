import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface VideoShowcaseProps {
  calendlyUrl: string;
}

export default function VideoShowcase({ calendlyUrl }: VideoShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
  );
  const [reducedMotion, setReducedMotion] = useState(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const widthMql = window.matchMedia('(min-width: 768px)');
    const widthHandler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    widthMql.addEventListener('change', widthHandler);

    const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionMql.addEventListener('change', motionHandler);

    return () => {
      widthMql.removeEventListener('change', widthHandler);
      motionMql.removeEventListener('change', motionHandler);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(section, {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 84%' },
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        onEnter: () => videoRef.current?.play()?.catch(() => {}),
        onLeave: () => videoRef.current?.pause(),
        onEnterBack: () => videoRef.current?.play()?.catch(() => {}),
        onLeaveBack: () => videoRef.current?.pause(),
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const src = isDesktop ? '/videos/intro-landscape.mp4' : '/videos/intro-vertical.mp4';
  const poster = isDesktop ? '/videos/intro-poster.jpg' : '/videos/intro-poster-vertical.jpg';

  return (
    <section ref={sectionRef} className="bg-white py-20 md:py-28">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <p className="section-kicker">Ukážka</p>
          <h2 style={{ fontSize: 'clamp(40px,5vw,64px)', maxWidth: '780px' }}>
            Takto vyzerá automatizácia v praxi
          </h2>
          <p className="body-large muted" style={{ margin: '24px 0 0' }}>
            Požiadavka z formulára sa sama zapíše do Trella, tím dostane notifikáciu v Slacku a každá zmena stavu sa automaticky ohlási.
          </p>
        </div>

        <div className="flex justify-center" style={{ marginTop: '48px' }}>
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              maxWidth: isDesktop ? '1000px' : '360px',
              width: '100%',
              border: '1px solid rgba(99,85,224,0.12)',
              boxShadow: '0 30px 80px -20px rgba(99,85,224,0.35)',
            }}
          >
            <div
              className="flex items-center gap-2"
              style={{ padding: '10px 16px', borderBottom: '1px solid rgba(99,85,224,0.08)' }}
            >
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#d8d4e4' }} />
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#d8d4e4' }} />
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#d8d4e4' }} />
            </div>
            <video
              ref={videoRef}
              key={isDesktop ? 'desktop' : 'mobile'}
              className="block w-full bg-black"
              style={{ aspectRatio: isDesktop ? '16 / 9' : '9 / 16', objectFit: 'cover' }}
              muted
              loop
              playsInline
              preload="none"
              poster={poster}
              src={src}
              controls={reducedMotion}
              aria-label="Ukážka automatizácie: formulár, Trello a Slack"
            />
          </div>
        </div>

        <div className="flex justify-center" style={{ marginTop: '48px' }}>
          <a className="button" href={calendlyUrl}>
            Nezáväzná konzultácia <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
