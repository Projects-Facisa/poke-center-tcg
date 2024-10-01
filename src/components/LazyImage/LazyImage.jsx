import React, { useState, useEffect } from 'react';
import "./LazyImage.css"
import DefaultImage from "../../assets/placeholder.png";

const LazyImage = ({ src, alt, placeholder }) => {
  const [imageSrc, setImageSrc] = useState(placeholder || DefaultImage);
  const [imageRef, setImageRef] = useState();

  useEffect(() => {
    let observer;
    let didCancel = false;

    if (imageRef && imageSrc !== src) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (
                !didCancel &&
                (entry.intersectionRatio > 0 || entry.isIntersecting)
              ) {
                setImageSrc(src);
                observer.unobserve(imageRef);
              }
            });
          },
          {
            threshold: 0.01,
            rootMargin: '75%',
          }
        );
        observer.observe(imageRef);
      } else {

        setImageSrc(src);
      }
    }
    return () => {
      didCancel = true;
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageSrc, imageRef]);

  return <img ref={setImageRef} src={imageSrc} alt={alt} className="lazy-image" />;
};

export default LazyImage;