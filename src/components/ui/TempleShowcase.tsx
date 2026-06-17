'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TEMPLES = [
  {
    id: 1,
    name: "Bhaskararajapuram",
    image: "/images/temples/village.jpg",
    period: "18th Century",
    category: "Village Heritage",
    tags: ["Village Heritage", "Sacred Site"]
  },
  {
    id: 2,
    name: "Triveni Sangamam",
    image: "/images/temples/sangamam.jpg",
    period: "Ancient Sacred Site",
    category: "River Confluence",
    tags: ["Sacred Site", "Historical Landmark"]
  },
  {
    id: 3,
    name: "Shri Bhaskareswarar Temple",
    image: "/images/temples/bhaskareswarar.jpg",
    period: "Traditional Heritage",
    category: "Shiva Temple",
    tags: ["Temple Complex", "Spiritual Centre"]
  },
  {
    id: 4,
    name: "Shri Kothanda Ramaswamy Temple",
    image: "/images/temples/ramaswamy.jpg",
    period: "Traditional Heritage",
    category: "Rama Temple",
    tags: ["Temple Complex", "Sacred Site"]
  },
  {
    id: 5,
    name: "Shri Vishnu Durgai Temple",
    image: "/images/temples/durgai.jpg",
    period: "Traditional Heritage",
    category: "Durgai Temple",
    tags: ["Temple Complex", "Protective Deity"]
  },
  {
    id: 6,
    name: "Shri Bhaskararaya Memorial",
    image: "/images/temples/memorial.jpg",
    period: "18th Century",
    category: "Memorial",
    tags: ["Historical Landmark", "Spiritual Centre"]
  }
];

export function TempleShowcase() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${TEMPLES.length * 80}%`, // Scroll duration
      pin: true,
      scrub: 1, // Smooth scrub
      onUpdate: (self) => {
        setScrollProgress(self.progress * (TEMPLES.length - 1));
      }
    });

    return () => {
      st.kill();
    };
  }, []);

  const activeIndex = Math.round(scrollProgress);

  return (
    <div ref={containerRef} className="temple-showcase-container">
      <div className="temple-showcase">
        {/* LEFT SIDE (Navigation) */}
        <div className="showcase-nav">
          {TEMPLES.map((temple, idx) => {
            // Use floating progress for smooth wheel rotation
            const offset = idx - scrollProgress;
            const distance = Math.abs(offset);
            const isActive = idx === activeIndex;

            // Perfectly smooth scale (1.555 scale roughly equals 28px from 18px base)
            const scale = Math.max(1, 1.555 - distance * 0.8);
            const opacity = Math.max(0.2, 1 - distance * 0.6);
            
            // Smooth color interpolation: Gold (201, 162, 39) to Muted Grey (160, 150, 140)
            const mix = Math.min(1, distance * 1.5);
            const r = Math.round(201 + (160 - 201) * mix);
            const g = Math.round(162 + (150 - 162) * mix);
            const b = Math.round(39 + (140 - 39) * mix);
            const color = `rgb(${r}, ${g}, ${b})`;

            return (
              <div 
                key={temple.id} 
                className={`showcase-nav-item ${isActive ? 'active' : ''}`}
                style={{
                  transform: `translateY(${offset * 85}px) scale(${scale})`, // strictly linear scroll
                  opacity: opacity,
                  color: color,
                  fontWeight: distance < 0.5 ? 600 : 400,
                  fontSize: '18px' // Base size, scaled smoothly
                }}
                onClick={() => {}}
              >
                {isActive && <span className="nav-dot" style={{ transform: `scale(${1/scale})`, backgroundColor: '#C9A227' }} />}
                {temple.name}
              </div>
            );
          })}
        </div>

        {/* RIGHT SIDE (Featured Content) */}
        <div className="showcase-content">
          <div className="showcase-image-container">
             {TEMPLES.map((temple, idx) => (
                <img 
                  key={temple.image}
                  src={temple.image}
                  alt={temple.name}
                  className={`showcase-image ${idx === activeIndex ? 'active' : ''}`}
                />
             ))}

             <div className="showcase-details-wrapper">
                {TEMPLES.map((temple, idx) => (
                   <div 
                     key={temple.id} 
                     className={`showcase-details ${idx === activeIndex ? 'active' : ''}`}
                   >
                     <h2 className="showcase-title">
                       {temple.name}
                       <span className="showcase-icons">↗ ✦</span>
                     </h2>
                     
                     <div className="showcase-tags">
                       {temple.tags.map(tag => (
                         <span key={tag} className="showcase-tag">{tag}</span>
                       ))}
                     </div>
                     
                     <hr className="showcase-divider" />
                     
                     <div className="showcase-metadata">
                       <span className="metadata-left">{temple.period}</span>
                       <span className="metadata-right">{temple.category}</span>
                     </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
