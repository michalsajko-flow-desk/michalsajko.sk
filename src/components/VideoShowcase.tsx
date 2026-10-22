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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const userPausedRef = useRef(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      video.play()?.catch(() => {});
    } else {
      userPausedRef.current = true;
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

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
        onEnter: () => {
          if (!userPausedRef.current) videoRef.current?.play()?.catch(() => {});
        },
        onLeave: () => videoRef.current?.pause(),
        onEnterBack: () => {
          if (!userPausedRef.current) videoRef.current?.play()?.catch(() => {});
        },
        onLeaveBack: () => videoRef.current?.pause(),
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  const src = isDesktop ? '/videos/intro-landscape.mp4' : '/videos/intro-vertical.mp4';
  const poster = isDesktop ? '/videos/intro-poster.jpg' : '/videos/intro-poster-vertical.jpg';

  return (
    <section ref={sectionRef} className="bg-white video-section" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
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
            <div className="relative">
              <video
                ref={videoRef}
                key={isDesktop ? 'desktop' : 'mobile'}
                className="block w-full bg-black"
                style={{ aspectRatio: isDesktop ? '16 / 9' : '9 / 16', objectFit: 'cover', cursor: 'pointer' }}
                muted
                loop
                playsInline
                preload="none"
                poster={poster}
                src={src}
                controls={reducedMotion}
                aria-label="Ukážka automatizácie: formulár, Trello a Slack"
                onClick={() => !reducedMotion && togglePlay()}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              {!reducedMotion && !isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label="Prehrať"
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'rgba(19,16,34,0.25)' }}
                >
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              )}
              {!reducedMotion && (
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Zapnúť zvuk' : 'Vypnúť zvuk'}
                  className="absolute"
                  style={{
                    bottom: '12px',
                    right: '12px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(255,255,255,0.82)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background .25s ease',
                  }}
                >
                  {isMuted ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6355e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      <line x1="22" y1="9" x2="16" y2="15" />
                      <line x1="16" y1="9" x2="22" y2="15" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6355e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  )}
                </button>
              )}
            </div>
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
