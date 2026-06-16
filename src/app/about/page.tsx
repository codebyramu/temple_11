import { NavBar } from '@/components/NavBar';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BodyText } from '@/components/ui/BodyText';
import { TempleCard } from '@/components/ui/TempleCard';
import { HeroVideo } from '@/components/HeroVideo';

export const metadata = {
  title: 'About | Divine Street',
  description: 'Welcome to Bhaskararajapuram, a serene village on the banks of River Cauvery.',
};

export default function About() {
  return (
    <main className="about-page">
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
        <BodyText>
          Bhaskararajapuram is a village on the banks of the River Cauvery, near Kumbakonam, located beautifully at the confluence (Sangamam) of the Kaveri, Arasalar, and Vennaru rivers. It stands as a testament to deep spiritual heritage and enduring devotion.
        </BodyText>

        <BodyText>
          The Srinivas Rama Trust plays a crucial role in the maintenance of the village's sacred spaces and the organization of annual celebrations, keeping the rich traditions alive for future generations.
        </BodyText>

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
    </main>
  );
}
