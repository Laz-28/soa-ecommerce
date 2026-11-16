import { ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";

function Hero() {
  function scrollToProducts() {
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">NEW TECHNOLOGY COLLECTION</span>

          <h1>
            Smart technology.
            <br />
            Better everyday life.
          </h1>

          <p>
            Discover reliable audio, power and wearable products
            designed for your daily routine.
          </p>

          <button
            className="primary-button"
            type="button"
            onClick={scrollToProducts}
          >
            Shop now
            <ArrowRight size={19} />
          </button>
        </div>

        <div className="hero-visual">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />

          <div className="device-case">
            <div className="device-light" />
            <div className="earbud earbud-left" />
            <div className="earbud earbud-right" />
          </div>

          <span className="floating-label label-one">
            40-hour battery
          </span>

          <span className="floating-label label-two">
            Clear audio
          </span>
        </div>
      </section>

      <section className="benefits">
        <article>
          <Truck size={28} />
          <div>
            <strong>Fast delivery</strong>
            <span>Across Kenya</span>
          </div>
        </article>

        <article>
          <ShieldCheck size={28} />
          <div>
            <strong>Secure shopping</strong>
            <span>Protected purchases</span>
          </div>
        </article>

        <article>
          <RotateCcw size={28} />
          <div>
            <strong>Easy returns</strong>
            <span>Simple return process</span>
          </div>
        </article>
      </section>
    </>
  );
}

export default Hero;