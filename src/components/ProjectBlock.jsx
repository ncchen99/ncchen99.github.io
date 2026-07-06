function Media({ image, className = '' }) {
  const isVideo = image.src.endsWith('.mp4')
  const common = `w-full border border-line bg-card object-cover ${className}`
  if (isVideo) {
    return <video src={image.src} autoPlay loop muted playsInline className={common} />
  }
  return <img src={image.src} alt={image.alt} loading="lazy" className={common} />
}

// Landscape shots -> 50/50 split, images stacked vertically on the right.
// Portrait shots / GIFs -> 5/7 split, a compact horizontal row on the right.
export default function ProjectBlock({ project }) {
  const wide = project.images.filter((im) => im.wide)
  const narrow = project.images.filter((im) => !im.wide)
  const hasWide = wide.length > 0

  return (
    <div
      className={`grid items-center gap-x-12 gap-y-10 md:gap-x-16 ${
        hasWide ? 'md:grid-cols-2' : 'md:grid-cols-12'
      }`}
    >
      {/* left — title + intro */}
      <div className={hasWide ? '' : 'md:col-span-5'}>
        <h3 className="display text-3xl leading-tight text-ink md:text-[2.6rem]">
          {project.name}
        </h3>
        {project.latin && project.latin !== project.name && (
          <p className="eyebrow mt-3">{project.latin}</p>
        )}

        <p className="mt-6 max-w-md font-cjk text-xl leading-snug text-ink md:mt-8 md:text-[1.45rem]">
          {project.lead}
        </p>
        <p className="mt-5 max-w-md font-cjk text-[0.95rem] leading-loose text-muted">
          {project.body}
        </p>

        {project.note && (
          <p className="mt-5 font-serif text-lg italic text-muted">{project.note}</p>
        )}

        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.2em] text-ink"
        >
          <span className="link-underline whitespace-nowrap">前往平台</span>
          <span aria-hidden="true" className="text-muted">
            ↗ {project.hrefLabel}
          </span>
        </a>
      </div>

      {/* right — media */}
      <div className={hasWide ? '' : 'md:col-span-7'}>
        {hasWide ? (
          <div className="flex flex-col gap-5 md:gap-6">
            {wide.map((image) => (
              <Media key={image.src} image={image} className="md:max-h-[34vh]" />
            ))}
          </div>
        ) : (
          <div
            className={`grid items-end gap-4 md:gap-5 ${
              narrow.length >= 4 ? 'grid-cols-4' : 'grid-cols-3'
            }`}
          >
            {narrow.map((image) => (
              // portrait shots: show the whole screenshot (no crop), sat on a
              // common baseline so the row still reads as a tidy set
              <Media key={image.src} image={image} className="h-auto" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
