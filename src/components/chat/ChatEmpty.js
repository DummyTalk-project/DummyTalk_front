import React, { useEffect, useRef } from 'react';
import './ChatEmpty.css'; // CSS 파일을 import

const ChatEmpty = () => {
    const cardsRef = useRef(null);
    const imagesRef = useRef(null);
    const backgroundsRef = useRef(null);
    const range = 40;

    const calcValue = (a, b) => ((a / b) * range - range / 2).toFixed(1); // thanks @alice-mx

    useEffect(() => {
        let timeout;

        const handleMouseMove = ({ clientX: x, clientY: y }) => {
            if (cardsRef.current && imagesRef.current && backgroundsRef.current) { // 요소가 null이 아닌지 확인
                if (timeout) {
                    window.cancelAnimationFrame(timeout);
                }

                timeout = window.requestAnimationFrame(() => {
                    const yValue = calcValue(y, window.innerHeight);
                    const xValue = calcValue(x, window.innerWidth);

               /*     cardsRef.current.style.transform = `rotateX(${yValue}deg) rotateY(${xValue}deg)`;*/

                    [].forEach.call(imagesRef.current, (image) => {
                        if (image) {
                     /*       image.style.transform = `translateX(${-xValue}px) translateY(${yValue}px)`;*/
                        }
                    });

                    [].forEach.call(backgroundsRef.current, (background) => {
                        if (background) {
                        /*    background.style.backgroundPosition = `${xValue * 0.45}px ${-yValue * 0.45}px`;*/
                        }
                    });
                });
            }
        };

        document.addEventListener('mousemove', handleMouseMove, false);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="my-custom-class">
            {/* Your JSX for the component */}
            <div className="bg-transparent" ref={cardsRef}>
                <div className="my-custom-card__bg" ref={backgroundsRef}></div>
                <img className="my-custom-card__img my-custom-card__img-centered" src="" alt="dumcat" ref={imagesRef} />
            </div>
            {/*<span className="my-custom-notice">view on desktop for mousemove</span>*/}
{/*            <a
                className="my-custom-twitter__link"
                target="_blank"
                href="https://twitter.com/intent/tweet?text=Check%20out%20this%203D%20CSS%20depth%20effect%20from%20@dazulu&via=CodePen%20&hashtags=codepen%2cfrontend&url=https://codepen.io/dazulu/details/VVZrQv/"
            >
                <img className="my-custom-twitter__icon" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/62105/twitter.svg" alt="Twitter" /> Share
            </a>*/}
        </div>
    );
};

export default ChatEmpty;