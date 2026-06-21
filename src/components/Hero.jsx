function Hero({ project }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-[#f7fbfb]">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(74,158,216,0.16),transparent_46%),linear-gradient(145deg,rgba(127,182,168,0.18),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.78),rgba(243,248,247,0.9))]" />
      <div className="relative mx-auto grid min-h-[88vh] w-full max-w-6xl content-end px-5 pb-12 pt-24 sm:px-8 lg:px-10 lg:pb-16">
        <div className="max-w-4xl">
          <p className="mb-5 text-xs font-semibold uppercase text-clay">
            Graduation Photo Script
          </p>
          <h1 className="font-serif text-6xl font-semibold leading-[0.94] text-ink sm:text-7xl lg:text-8xl">
            {project.title}
          </h1>
          {project.tagline && (
            <p className="mt-7 max-w-2xl text-xl leading-9 text-muted sm:text-2xl">
              {project.tagline}
            </p>
          )}
        </div>

        <div className="mt-12 grid gap-4 border-t border-line pt-6 sm:grid-cols-2 lg:max-w-3xl">
          <div>
            <p className="metadata-label">Location</p>
            <p className="mt-2 text-base leading-7 text-ink">{project.location}</p>
          </div>
          <div>
            <p className="metadata-label">Date</p>
            <p className="mt-2 text-base leading-7 text-ink">{project.date}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
