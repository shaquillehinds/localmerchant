import styles from "../styles/components/image-slide.module.scss";
import { useState } from "react";

const ImageSlide = ({ images }) => {
  const [state, setState] = useState({ xStart: null, xPosition: 0, xEnd: 0, xEndPrev: 0, image: 0 });
  const selectorStyleChange = ({ selector, image }) => {
    document.querySelectorAll("[data-selector]").forEach((selector) => {
      selector.style.backgroundColor = "transparent";
    });
    if (selector) selector.style.backgroundColor = "var(--theme-primary)";
    else if (image || image === 0) {
      document.getElementById(`selector_${image}`).style.backgroundColor = "var(--theme-primary)";
    }
  };
  const handleTouchStart = (e) => {
    const xStart = e.touches[0].clientX;
    setState((prev) => ({ ...prev, xStart }));
  };
  const handleTouchMove = (e) => {
    const xEnd = e.touches[0].clientX;
    setState((prev) => ({ ...prev, xEnd }));
  };
  const handleTouchEnd = (e) => {
    if (state.xEnd === state.xEndPrev) {
      return;
    }
    if (!state.xStart) {
      return;
    }
    setState((prev) => ({ ...prev, xEndPrev: state.xEnd }));
    const wrapper = document.getElementById("image_slide_image_wrapper");
    const wrapperWidth = wrapper.offsetWidth;
    const amountOfImages = document.querySelectorAll("[data-selector]").length - 1;
    const maxWidth = wrapperWidth * amountOfImages;
    const xDiff = state.xStart - state.xEnd;
    if (xDiff >= 50) {
      const direction = "forward";
      if (!(Math.abs(state.xPosition) >= maxWidth)) {
        wrapperTransformer({ xDiff, wrapperWidth, wrapper, direction });
      }
    } else if (xDiff <= -50) {
      const direction = "backward";
      if (!(Math.abs(state.xPosition) <= 0)) {
        wrapperTransformer({ xDiff, wrapperWidth, wrapper, direction });
      }
    }
  };
  const transformDirection = ({ direction, wrapperWidth, wrapper, totalImages }) => {
    if (direction && images) {
      let xPosition;
      direction === "forward"
        ? (xPosition = state.xPosition - wrapperWidth)
        : (xPosition = state.xPosition + wrapperWidth);
      let image;
      direction === "forward" ? (image = state.image + 1) : (image = state.image - 1);
      if (image === totalImages) {
        image = 0;
        xPosition = 0;
      }
      if (image === -1) {
        image = totalImages - 1;
        xPosition = -(wrapperWidth * image);
      }
      wrapper.style.transform = `translateX(${xPosition}px)`;
      selectorStyleChange({ image });
      setState((prev) => ({ ...prev, xPosition, image }));
    }
  };
  const wrapperTransformer = ({ image, selector, selectorId, xDiff, direction }) => {
    const wrapper = document.getElementById("image_slide_image_wrapper");
    const wrapperWidth = wrapper.offsetWidth;
    if (selectorId) {
      selectorStyleChange({ selector });
      const image = parseInt([...selectorId].pop());
      const xPosition = -(wrapperWidth * parseInt([...selectorId].pop()));
      setState((prev) => ({ ...prev, xPosition, image }));
      return (wrapper.style.transform = `translateX(${xPosition}px)`);
    }
    if (xDiff) return transformDirection({ direction, wrapperWidth, wrapper });

    if (direction) {
      const totalImages = document.querySelectorAll("[data-selector]").length;
      transformDirection({ direction, wrapperWidth, wrapper, totalImages });
    }
  };
  const selectorHandler = (e) => {
    const selector = e.target;
    const selectorId = selector.getAttribute("id");
    return wrapperTransformer({ selector, selectorId });
  };
  const handleArrow = (e) => {
    const direction = e.target.getAttribute("data-arrow");
    wrapperTransformer({ direction });
  };
  return (
    <div className={styles.image_slide_wrapper}>
      <div className={styles.image_slide_image_wrapper_outer}>
        <svg
          data-arrow="backward"
          onClick={handleArrow}
          className={styles.image_slide_arrow_left}
          viewBox="0 0 50 82.39"
        >
          <path d="M1.32,44.4,38,81.06a4.53,4.53,0,0,0,6.41,0h0l4.26-4.27a4.52,4.52,0,0,0,0-6.4l-29-29.19L48.67,12a4.52,4.52,0,0,0,0-6.4L44.39,1.33a4.52,4.52,0,0,0-6.4,0h0L1.32,38A4.54,4.54,0,0,0,1.32,44.4Z" />
        </svg>
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={styles.image_slide_image_wrapper}
          id="image_slide_image_wrapper"
        >
          {/* <img src="" alt="" className={styles.image_slide_image} /> */}
          {images.map((image, index) => {
            let imageClass = "image_slide_image_" + index;
            return <img key={index} src={image} alt="" className={styles[imageClass]} />;
          })}
        </div>
        <svg
          data-arrow="forward"
          onClick={handleArrow}
          className={styles.image_slide_arrow_right}
          viewBox="0 0 50 82.39"
        >
          <path d="M48.67,44.4,12,81.06a4.53,4.53,0,0,1-6.41,0L1.33,76.79a4.53,4.53,0,0,1,0-6.4L30.38,41.2,1.32,12a4.53,4.53,0,0,1,0-6.4L5.6,1.33a4.53,4.53,0,0,1,6.41,0L48.67,38A4.53,4.53,0,0,1,48.67,44.4Z" />
        </svg>
      </div>
      <ul className={styles.image_slide_selector_wrapper}>
        {images.map((image, index) => {
          let selectorId = "selector_" + index;
          return (
            <li
              key={index}
              onClick={selectorHandler}
              id={selectorId}
              data-selector
              className={styles.image_slide_selector}
            ></li>
          );
        })}
      </ul>
    </div>
  );
};

export default ImageSlide;
