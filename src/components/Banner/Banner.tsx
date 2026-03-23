import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Banner.css';
import img0 from '../../Img/0.jpg';
import img1 from '../../Img/WhatsApp-Image-2019-06-11-at-18.04.17.jpg';
import img2 from '../../Img/ade9d580-d18c-4bad-a4b4-11f7e7f8f25d_skate-caps-web.jpg';

const images = [img0, img1, img2];
const autoplayDelay = 5000;

const Banner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [resetCounter, setResetCounter] = useState(0);

  const changeSlide = (nextIndex: number, nextDirection: 1 | -1, shouldResetTimer = false) => {
    if (nextIndex === activeIndex) {
      if (shouldResetTimer) {
        setResetCounter((prev) => prev + 1);
      }
      return;
    }

    setPreviousIndex(activeIndex);
    setDirection(nextDirection);
    setActiveIndex(nextIndex);

    if (shouldResetTimer) {
      setResetCounter((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % images.length;
    changeSlide(nextIndex, 1, true);
  };

  const handlePrev = () => {
    const nextIndex = (activeIndex - 1 + images.length) % images.length;
    changeSlide(nextIndex, -1, true);
  };

  const toggleSelector = (index: number) => {
    const nextDirection: 1 | -1 = index > activeIndex ? 1 : -1;
    changeSlide(index, nextDirection, true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prevIndex) => {
        setPreviousIndex(prevIndex);
        return (prevIndex + 1) % images.length;
      });
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [resetCounter]);

  return (
    <section className="banner">
      <div className="banner__content">
        <h2 className="banner__title">
          New <br /> Arrivals
        </h2>
        <p className="banner__description">
          ¡MIRA NUESTRA ÚLTIMA COLECCIÓN PRIMAVERA/VERANO 2024! TODA LA COLECCIÓN ESTÁ INSPIRADA EN
          LA MODA ASIÁTICA MODERNA Y EL ESTILO CALLEJERO AMERICANO ATEMPORAL.
        </p>
        <Link to="/productos" className="banner__link">
          ¡Muéstrame más!
        </Link>
      </div>
      <div className="banner__arrows">
        <i className="banner__arrow-left fa-solid fa-arrow-left" onClick={handlePrev}></i>
        <i className="banner__arrow-right fa-solid fa-arrow-right" onClick={handleNext}></i>
      </div>
      <div className="banner__selector">
        {images.map((_, index) => (
          <i
            key={index}
            className={`fa-circle ${activeIndex === index ? 'fa-solid' : 'fa-regular'}`}
            onClick={() => toggleSelector(index)}
          ></i>
        ))}
      </div>
      <div className="banner_images">
        <div className="gradient-overlay"></div>
        {images.map((src, index) => {
          const isActive = index === activeIndex;
          const isPrevious = index === previousIndex;
          const imageClass = isActive
            ? 'active'
            : isPrevious
              ? direction === 1
                ? 'previous-left'
                : 'previous-right'
              : '';

          return (
            <img
              key={index}
              src={src}
              alt={`Banner ${index}`}
              className={`banner__image ${imageClass}`.trim()}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Banner;
