'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { NavBar } from '@/components/NavBar';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BodyText } from '@/components/ui/BodyText';
import { TempleCard } from '@/components/ui/TempleCard';
import { HeroVideo } from '@/components/HeroVideo';

const volumeIcon = (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

const mutedIcon = (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>
);

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textStartRef = useRef<HTMLDivElement>(null);
  const textEndRef = useRef<HTMLDivElement>(null);
  const welcomeTextRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lenisRef = useRef<Lenis | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Audio refs
  const fluteRef = useRef<HTMLAudioElement>(null);
  const bellRef = useRef<HTMLAudioElement>(null);
  const bellPlayedRef = useRef(false);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (fluteRef.current) fluteRef.current.muted = nextMuted;
    if (bellRef.current) bellRef.current.muted = nextMuted;
  };

  const playBell = useCallback(() => {
    if (bellPlayedRef.current) return;
    bellPlayedRef.current = true;
    const bell = bellRef.current;
    if (!bell) return;
    bell.volume = 0.55;
    bell.currentTime = 0;
    bell.play().catch(() => {});
  }, []);

  useEffect(() => {
    // Start audio automatically at 25% volume
    const startAudio = () => {
      const flute = fluteRef.current;
      if (flute) {
        flute.volume = 0.25;
        flute.play().catch(() => {
          // Autoplay blocked by browser, wait for interaction
          const playOnInteract = () => {
            flute.play().catch(() => {});
            window.removeEventListener('click', playOnInteract);
            window.removeEventListener('scroll', playOnInteract);
            window.removeEventListener('touchstart', playOnInteract);
          };
          window.addEventListener('click', playOnInteract);
          window.addEventListener('scroll', playOnInteract, { once: true });
          window.addEventListener('touchstart', playOnInteract, { once: true });
        });
      }
    };
    
    startAudio();

    gsap.registerPlugin(ScrollTrigger);

    const initSequence = async () => {
      try {
        const res = await fetch('/api/frames');
        const data = await res.json();
        const frameFiles: string[] = data.frames;

        if (frameFiles.length === 0) {
          console.error('No frames found.');
          return;
        }

        let loadedCount = 0;
        const totalFrames = frameFiles.length;
        const images: HTMLImageElement[] = [];

        await Promise.all(
          frameFiles.map((file, i) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.src = `/frames/${file}`;
              img.onload = () => {
                images[i] = img;
                loadedCount++;
                setProgress(Math.round((loadedCount / totalFrames) * 100));
                resolve();
              };
              img.onerror = () => {
                images[i] = images[i - 1] || new Image();
                loadedCount++;
                setProgress(Math.round((loadedCount / totalFrames) * 100));
                resolve();
              };
            })
          )
        );

        imagesRef.current = images;

        const canvas = canvasRef.current;
        if (canvas && images[0]) {
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;

          const drawCover = (img: HTMLImageElement) => {
            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;
            let drawWidth, drawHeight, offsetX, offsetY;
            if (canvasRatio > imgRatio) {
              drawWidth = canvas.width;
              drawHeight = canvas.width / imgRatio;
              offsetX = 0;
              offsetY = (canvas.height - drawHeight) / 2;
            } else {
              drawWidth = canvas.height * imgRatio;
              drawHeight = canvas.height;
              offsetX = (canvas.width - drawWidth) / 2;
              offsetY = 0;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          };

          drawCover(images[0]);

          const frameObj = { frame: 0 };
          gsap.to(frameObj, {
            frame: totalFrames - 1,
            snap: 'frame',
            ease: 'none',
            scrollTrigger: {
              trigger: '.scroll-container',
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.5,
              onUpdate: () => {
                if (images[frameObj.frame]) {
                  requestAnimationFrame(() => drawCover(images[frameObj.frame]));
                }
              },
            },
          });

          // Fade out start text
          gsap.to(textStartRef.current, {
            opacity: 0,
            y: -50,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: '.scroll-container',
              start: 'top top',
              end: '15% top',
              scrub: true,
            },
          });

          // Welcome text fade in before the last frames
          gsap.fromTo(
            welcomeTextRef.current,
            { opacity: 0, y: 30, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.scroll-container',
                start: '65% top',
                end: '80% top',
                scrub: true,
              },
            }
          );

          // Fade out background canvas when scrolling into the main page (about section)
          gsap.to('.canvas-wrapper', {
            opacity: 0,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: '#about',
              start: 'top bottom',
              end: 'top center',
              scrub: true,
            },
          });



          // Bell at 60%
          ScrollTrigger.create({
            trigger: '.scroll-container',
            start: '60% top',
            end: '61% top',
            onEnter: () => playBell(),
          });

          // Lenis
          const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            syncTouch: true,
          });
          lenisRef.current = lenis;

          lenis.on('scroll', ScrollTrigger.update);
          gsap.ticker.add((time) => lenis.raf(time * 1000));
          gsap.ticker.lagSmoothing(0);

          const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (images[frameObj.frame]) drawCover(images[frameObj.frame]);
          };
          window.addEventListener('resize', handleResize);

          setTimeout(() => setLoading(false), 500);

          return () => window.removeEventListener('resize', handleResize);
        }
      } catch (err) {
        console.error('Initialization failed:', err);
      }
    };

    initSequence();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      lenisRef.current?.destroy();
    };
  }, [playBell]);

  return (
    <>
      <audio ref={fluteRef} src="/audio/flute.mp3" loop preload="auto" />
      <audio ref={bellRef} src="/audio/bell.mp3" preload="auto" />

      <button 
        onClick={toggleMute}
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'rgba(250, 243, 231, 0.5)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(196, 122, 90, 0.3)',
          color: 'var(--maroon-primary)',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease'
        }}
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      >
        {isMuted ? mutedIcon : volumeIcon}
      </button>

      {loading && (
        <div id="loading-screen">
          <div className="loading-text">Awakening</div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="percentage">{progress}%</div>
        </div>
      )}

      <div className="scroll-container" ref={containerRef}>
        <div className="canvas-wrapper">
          <canvas id="video-canvas" ref={canvasRef} />
          <div className="vignette" />
          <div className="light-rays" />
        </div>

        <div className="text-overlay" ref={textStartRef}>
          <div className="text-start">
            <h1>Baskarajapuramm Welcomes</h1>
          </div>
        </div>

        <div className="text-overlay welcome-seq" ref={welcomeTextRef}>
          <div className="welcome-text-container">
            <p className="welcome-small">Welcome to</p>
            <h2 className="welcome-large">Bhaskararajapuram</h2>
          </div>
        </div>


      </div>

      <div id="about" style={{ position: 'relative', zIndex: 10, backgroundColor: 'var(--bg-color)', width: '100%' }}>
        <NavBar />
        
        <section className="hero-section">
          <HeroVideo />
          <div className="hero-content">
            <SectionHeading className="hero-title">Welcome to Bhaskararajapuram</SectionHeading>
            <BodyText italic className="hero-tagline">
              A village, quaint yet serene, on the banks of River Cauvery...
            </BodyText>
          </div>
        </section>

        <section className="about-content">
          <div className="about-text-with-flanks">
            <div className="flank left-flank">
              <img src="/images/gif/gif_1.gif" alt="Sacred Ritual Left" className="flank-gif" />
            </div>
            
            <div className="center-text">
              <BodyText>
                Bhaskararajapuram is a village on the banks of the River Cauvery, near Kumbakonam, located beautifully at the confluence (Sangamam) of the Kaveri, Arasalar, and Vennaru rivers. It stands as a testament to deep spiritual heritage and enduring devotion.
              </BodyText>

              <BodyText>
                The Srinivas Rama Trust plays a crucial role in the maintenance of the village's sacred spaces and the organization of annual celebrations, keeping the rich traditions alive for future generations.
              </BodyText>
            </div>

            <div className="flank right-flank">
              <img src="/images/gif/gif_2.gif" alt="Sacred Ritual Right" className="flank-gif" />
            </div>
          </div>

          <div className="temple-grid">
            <TempleCard 
              title="Shri Bhaskareswarar Temple" 
              description="The central landmark of our village's spiritual life." 
              href="/temples/bhaskareswarar" 
            />
            <TempleCard 
              title="Shri Kothanda Ramaswamy Temple" 
              description="A serene sanctuary dedicated to Lord Rama." 
              href="/temples/kothanda-ramaswamy" 
            />
            <TempleCard 
              title="Shri Vishnu Durgai Temple" 
              description="Home to the powerful and protective Goddess Durgai." 
              href="/temples/vishnu-durgai" 
            />
            <TempleCard 
              title="Shri Bhaskareswarar Memorial" 
              description="A tribute to the enduring legacy of Bhaskararaya." 
              href="/memorial" 
            />
          </div>
        </section>
      </div>
    </>
  );
}
