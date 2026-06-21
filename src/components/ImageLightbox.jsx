import { useEffect, useMemo, useRef, useState } from 'react';

function ImageLightbox({ image, onClose }) {
  const [index, setIndex] = useState(0);
  const touchStartRef = useRef(null);
  const didSwipeRef = useRef(false);
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

    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
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

    const deltaX = event.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = event.changedTouches[0].clientY - touchStartRef.current.y;

    if (Math.abs(deltaX) > 24 && Math.abs(deltaX) > Math.abs(deltaY) * 0.7) {
      didSwipeRef.current = true;
      if (deltaX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
      window.setTimeout(() => {
        didSwipeRef.current = false;
      }, 260);
    }

    touchStartRef.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex touch-none items-center justify-center bg-film/90 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="图片预览"
      onClick={onClose}
      onTouchMove={(event) => event.preventDefault()}
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
          touchStartRef.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };
        }}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative">
          <img
            src={src}
            alt={image.alt || `${image.title || '参考图'} ${activeIndex + 1}`}
            className="max-h-[82vh] max-w-[94vw] rounded-lg bg-white/8 object-contain shadow-[0_24px_80px_rgba(0,0,0,0.38)]"
            draggable="false"
          />
          {canBrowse && (
            <>
              <button
                type="button"
                className="absolute inset-y-0 left-0 w-1/2 rounded-l-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-white/55"
                onClick={(event) => {
                  event.stopPropagation();
                  if (didSwipeRef.current) {
                    return;
                  }
                  goToPrevious();
                }}
                aria-label="点击左侧查看上一张"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 w-1/2 rounded-r-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-white/55"
                onClick={(event) => {
                  event.stopPropagation();
                  if (didSwipeRef.current) {
                    return;
                  }
                  goToNext();
                }}
                aria-label="点击右侧查看下一张"
              />
            </>
          )}
        </div>
        <div className="w-full max-w-3xl rounded-full border border-white/18 bg-white/10 px-4 py-2 text-center text-sm text-white backdrop-blur">
          <span className="font-semibold">{image.title || '参考图'}</span>
          <span className="mx-2 text-white/50">·</span>
          <span>{activeIndex + 1} / {images.length}</span>
          {canBrowse && <span className="ml-2 text-white/70">手机左右滑动，或点击图片左右侧切换</span>}
        </div>
      </div>
    </div>
  );
}

export default ImageLightbox;
