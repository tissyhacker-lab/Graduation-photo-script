function ImageLightbox({ image, onClose }) {
  if (!image) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-film/86 p-4 sm:p-8"
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
      <img
        src={image.src}
        alt={image.alt}
        className="max-h-[88vh] max-w-[94vw] rounded-lg bg-white/8 object-contain shadow-[0_24px_80px_rgba(0,0,0,0.38)]"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}

export default ImageLightbox;
