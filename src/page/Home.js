import HeroSection from "src/layouts/IndexLayout/HeroSection";
import 'src/App.css';
import Cards from '../layouts/IndexLayout/Cards';
import Footer from '../layouts/IndexLayout/Footer';

function Home() {
  return (
    <>
      <HeroSection />
      <Cards />
      <Footer />
    </>
  );
}

export default Home;
