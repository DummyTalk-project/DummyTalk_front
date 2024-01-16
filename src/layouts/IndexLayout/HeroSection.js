import '../../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {
  
  return (
    <div className='hero-container'>
      <video src='/videos/video-1.mp4' autoPlay loop muted />
      <h1>AI DUMMY TALK</h1>
      <p>전세계사람들이랑 소통하고 싶나요?</p>
      <p>메신저 사진을 효율적으로 관리하고 싶나요?</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          link='/main'
        >
          GET STARTED
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
        >
          WATCH TRAILER <i className='far fa-play-circle' />
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
