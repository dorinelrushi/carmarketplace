import Header from './components/Header';
import Hero from './components/Hero';
import Models from './components/Models';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white overflow-x-hidden selection:bg-red-600 selection:text-white">
      <Header />
      <Hero />
      <Models />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
