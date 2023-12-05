import { Link } from "react-router-dom";
import HeroImg from "../assets/hero.png";
const Hero = () => {
  return (
    <div className="bg-white relative   flex items-center  h-full justify-center overflow-hidden z-50">
      <div className="relative mx-auto h-full px-4  pb-20   md:pb-10 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-2xl lg:px-8">
        <div className="flex flex-col items-center justify-between lg:flex-row py-8">
          <div className=" lg:mx-auto relative ">
            <div className="lg:max-w-xl lg:pr-5 relative z-40">
              <h2 className="mb-6 max-w-lg text-5xl font-light leading-snug tracking-tight  sm:text-7xl sm:leading-snug">
                We make reviews look
                <span className="my-1 inline-block border-b-8 border-g4 bg-white px-4 font-bold text-g4 animate__animated animate__flash">
                  different
                </span>
              </h2>
              <p className=" text-gray-700 text-xl">
                Join our community and express your opinions freely
              </p>
              <div className="mt-10 flex flex-col items-center md:flex-row">
                <Link
                  to="/explore"
                  className="mb-3 inline-flex h-12 w-full items-center justify-center rounded bg-black px-6 font-medium tracking-wide text-white shadow-md transition hover:bg-white hover:text-black focus:outline-none md:mr-4 md:mb-0 md:w-auto"
                >
                  Get Started
                </Link>
                <Link
                  to="/searcg"
                  aria-label=""
                  className="group inline-flex items-center font-semibold text-g1"
                >
                  Learn More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-4 h-6 w-6 transition-transform group-hover:translate-x-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="relative hidden lg:ml-32 lg:block lg:w-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="my-6 mx-auto h-10 w-10 animate-bounce rounded-full bg-white p-2 lg:hidden"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 17l-4 4m0 0l-4-4m4 4V3"
              ></path>
            </svg>
            <div className="abg-orange-400 mx-auto w-fit overflow-hidden rounded-[6rem] rounded-br-none rounded-tl-none">
              <img src={HeroImg} alt="hero img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
