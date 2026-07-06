import Scene from './Scene'

export default function Hero() {
  return (
    <Scene id="hero" tint="cream">
      <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
        {/* manifesto */}
        <h1 className="display order-2 text-[2.5rem] leading-[1.16] text-ink md:order-1 md:col-span-7 md:text-[3.4rem] md:leading-[1.18]">
          結合資訊科技與商業，
          <br className="hidden sm:block" />
          打造讓世界更溫暖的產品
        </h1>

        {/* portrait — in colour */}
        <div className="order-1 md:order-2 md:col-span-5 md:pl-6">
          <div className="mx-auto w-52 sm:w-60 md:ml-auto md:mr-0 md:w-full md:max-w-sm">
            <img
              src="/images/ncc.jpg"
              alt="念誠"
              className="w-full border border-line object-cover"
            />
            <p className="eyebrow mt-4">念誠 · Ning-Cheng Chen</p>
          </div>
        </div>
      </div>
    </Scene>
  )
}
