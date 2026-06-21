import { useEffect, useMemo, useRef, useState } from 'react';

function ImageLightbox({ image, onClose }) {
  const [index, setIndex] = useState(0);
  const touchStartRef = useRef(null);
  const images = useMemo(() => {
    if (!image) {
      return [];
    }

    return image.images?.length ? image.images : [image.src];
  }, [image]);
  const activeIndex = images.length ? Math.min(index, images.length - 1) : 0;
  const src = images[activeIndex];
  const canBrowse = images.length > 1;

  useEffect(() => {
    setIndex(image?.index || 0);
  }, [image]);

  useEffect(() => {
    if (!image) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'ArrowLeft') {
        setIndex((current) => (current - 1 + images.length) % images.length);
      }

      if (event.key === 'ArrowRight') {
        setIndex((current) => (current + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [image, images.length, onClose]);

  if (!image) {
    return null;
  }

  const goToPrevious = () => setIndex((current) => (current - 1 + images.length) % images.length);
  const goToNext = () => setIndex((current) => (current + 1) % images.length);

  const handleTouchEnd = (event) => {
    if (touchStartRef.current === null || !canBrowse) {
      return;
    }

    const delta = event.changedTouches[0].clientX - touchStartRef.current;

    if (Math.abs(delta) > 44) {
      if (delta > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }

    touchStartRef.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-film/90 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="图片预览"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
        onClick={onClose}
      >
        关闭
      </button>

      {canBrowse && (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/12 text-3xl leading-none text-white backdrop-blur transition hover:bg-white/22 focus:outline-none focus:ring-2 focus:ring-white/60 md:flex"
            onClick={(event) => {
              event.stopPropagation();
              goToPrevious();
            }}
            aria-label="上一张"
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/12 text-3xl leading-none text-white backdrop-blur transition hover:bg-white/22 focus:outline-none focus:ring-2 focus:ring-white/60 md:flex"
            onClick={(event) => {
              event.stopPropagation();
              goToNext();
            }}
            aria-label="下一张"
          >
            ›
          </button>
        </>
      )}

      <div
        className="flex max-h-[92vh] max-w-[94vw] flex-col items-center gap-3"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          touchStartRef.current = event.touches[0].clientX;
        }}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={src}
          alt={image.alt || `${image.title || '参考图'} ${activeIndex + 1}`}
          className="max-h-[82vh] max-w-[94vw] rounded-lg bg-white/8 object-contain shadow-[0_24px_80px_rgba(0,0,0,0.38)]"
        />
        <div className="w-full max-w-3xl rounded-full border border-white/18 bg-white/10 px-4 py-2 text-center text-sm text-white backdrop-blur">
          <span className="font-semibold">{image.title || '参考图'}</span>
          <span className="mx-2 text-white/50">·</span>
          <span>{activeIndex + 1} / {images.length}</span>
          {canBrowse && <span className="ml-2 text-white/70">手机左右滑动，电脑用箭头或左右键</span>}
        </div>
      </div>
    </div>
  );
}

export default ImageLightbox;
