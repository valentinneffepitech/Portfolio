import React, { useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Error(props) {
  const wrapperRef = useRef(null);
  const shadowRef = useRef(null);
  const navigation = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();

      let x = e.clientX - wrapperRect.left;
      let y = e.clientY - wrapperRect.top;
      shadowRef.current.style.left = x + 'px';
      shadowRef.current.style.top = y + 'px';
    };

    const handleClick = (e) => {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const centerX = wrapperRect.left + wrapperRect.width / 2;
      const centerY = wrapperRect.top + wrapperRect.height / 2;
      const radius = Math.min(wrapperRect.width, wrapperRect.height) / 8; // Adjust the radius as needed

      const distance = Math.sqrt((e.clientX - centerX) ** 2 + (e.clientY - centerY) ** 2);

      if (distance <= radius) {
        navigation('/');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div>
      <div ref={wrapperRef} className="wrapper">
        <div ref={shadowRef} className="shadow"></div>
      </div>
    </div>
  );
}