import s from "./loading.module.scss";

export default function Loading() {
  return (
    <div className={s.page} aria-label="Loading homepage">
      <section className={s.section}>
        <div className={`container ${s.heroGrid}`}>
          <div>
            <div className={s.chip} />
            <div className={`${s.line} ${s.h1a}`} />
            <div className={`${s.line} ${s.h1b}`} />
            <div className={`${s.line} ${s.p1}`} />
            <div className={`${s.line} ${s.p2}`} />
            <div className={`${s.line} ${s.p3}`} />
            <div className={s.btnRow}>
              <div className={s.btn} />
              <div className={s.btn} />
            </div>
            <div className={s.stats}>
              <div className={s.stat} />
              <div className={s.stat} />
              <div className={s.stat} />
            </div>
          </div>
          <div className={s.photo} />
        </div>
      </section>

      <section className={s.section}>
        <div className="container">
          <div className={s.grid4}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`${s.card} ${s.counter}`} />
            ))}
          </div>
        </div>
      </section>

      <section className={`${s.section} ${s.alt}`}>
        <div className="container">
          <div className={s.subscribeBand} />
        </div>
      </section>

      <section className={`${s.section} ${s.alt}`}>
        <div className="container">
          <div className={s.about}>
            <div className={`${s.photo} ${s.aboutMedia}`} />
            <div className={s.aboutCopy}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={s.line} />
              ))}
              <div className={s.btn} />
            </div>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className="container">
          <div className={`${s.line} ${s.head}`} />
          <div className={s.grid3}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={s.card} />
            ))}
          </div>
        </div>
      </section>

      <section className={`${s.section} ${s.alt}`}>
        <div className="container">
          <div className={s.grid4}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`${s.card} ${s.counter}`} />
            ))}
          </div>
        </div>
      </section>

      <section className={s.section}>
        <div className="container">
          <div className={`${s.line} ${s.head}`} />
          <div className={s.galleryGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={s.gallery} />
            ))}
          </div>
        </div>
      </section>

      <section className={`${s.section} ${s.alt}`}>
        <div className="container">
          <div className={s.quote} />
        </div>
      </section>

      <section className={s.section}>
        <div className="container">
          <div className={s.cta} />
        </div>
      </section>

      <section className={s.section}>
        <div className="container">
          <div className={`${s.line} ${s.head}`} />
          <div className={s.grid3}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={s.card} />
            ))}
          </div>
        </div>
      </section>

      <section className={`${s.section} ${s.alt}`}>
        <div className="container">
          <div className={`${s.line} ${s.head}`} />
          <div className={s.sponsors}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={s.logo} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
