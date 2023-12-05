// import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import uniqid from "uniqid";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { useContext, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import WordCloud from "./WordCloud";
import { addPlaceReview, getPlaceDetails, getPlaceReviews } from "../api/api";
import { useParams } from "react-router-dom";
import axios from "axios";
import NoReviewImg from "../assets/no.png";

const Place = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [words, setWords] = useState([]);
  const [ourWords, setOurWords] = useState([]);
  const [ourReviews, setOurReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [ourSearch, setOurSearch] = useState("");
  const [place, setPlace] = useState(null);

  useEffect(() => {
    init();
  }, [id]);

  const init = async () => {
    try {
      const place = await getPlaceDetails(id);
      const reviewsData = await getPlaceReviews(id);
      if (place.reviews) {
        const data = place.reviews.reduce((accumulator, currentValue) => {
          return accumulator + currentValue?.text?.text;
        }, "");
        if (data) {
          axios
            .post("http://localhost:8080/", {
              data: { data },
            })
            .then(({ data }) => {
              setWords(data.keywords);
            });
        } else {
          setWords([{ text: "No Reviews", value: 16 }]);
        }
      } else {
        setWords([{ text: "No Reviews", value: 16 }]);
      }

      const reviewsDta = reviewsData.reduce((accumulator, currentValue) => {
        return accumulator + currentValue?.data?.review;
      }, "");

      if (reviewsDta) {
        axios
          .post("http://localhost:8080/", {
            data: { data: reviewsDta },
          })
          .then(({ data }) => {
            console.log(data);
            setOurWords(data.keywords);
          });
      } else {
        setOurWords([{ text: "No Reviews", value: 16 }]);
      }
      setPlace(place);
      setOurReviews(reviewsData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addPlaceReview(
      id,
      rating,
      review,
      user.displayName,
      user.email,
      user.photoURL
    );
    if (result) {
      toast.success("Review Added Succesfully!!");

      const ourReviewClone = [];
      ourReviewClone.push({
        id: uniqid(),
        data: {
          rating: rating,
          review: review,
          email: user.email,
          name: user.displayName,
          photoURL:
            user.photoURL ||
            "https://www.svgrepo.com/show/335199/user-circle.svg",
          timestamp: {
            toDate: () => {
              return new Date();
            },
          },
        },
      });
      const theClone = [...ourReviewClone, ...ourReviews];

      setOurReviews(theClone);

      const reviewsDta = theClone.reduce((accumulator, currentValue) => {
        return accumulator + currentValue?.data?.review;
      }, "");

      if (reviewsDta) {
        axios
          .post("http://localhost:8080/", {
            data: { data: reviewsDta },
          })
          .then(({ data }) => {
            console.log(data);
            setOurWords(data.keywords);
          });
      } else {
        setOurWords([{ text: "No Reviews", value: 16 }]);
      }
      setReview("");
      setRating("");

      setShowModal(!showModal);
    } else {
      toast.error("Unable To Add Review Try Again!!");
    }
  };
  const handleShowModal = () => {
    if (!isAuthenticated) toast.error("Please Login to Continue!");
    else {
      setShowModal(!showModal);
    }
  };
  const scrollRef = useRef(null);
  const executeScroll = () =>
    scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSearch = (event) => {
    console.log(event);
    setSearch(event);
    executeScroll();
  };
  const handleOurSearch = (event) => {
    console.log(event);

    setOurSearch(event);
    executeScroll();
  };

  if (!place)
    return (
      <div className="flex items-center justify-center w-56 h-56 mx-auto">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  return (
    <div>
      <section className="text-gray-700 body-font overflow-hidden bg-white">
        <div className="container px-5 py-24 pb-0  mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <Swiper
              slidesPerView={1}
              spaceBetween={30}
              loop={true}
              pagination={{
                clickable: true,
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              navigation={true}
              modules={[Autoplay, Pagination]}
              className="mySwiper lg:w-1/2 "
            >
              {place.photos.map((img, idx) => (
                <SwiperSlide key={idx} className="flex items-center">
                  <img
                    loading="lazy"
                    alt="ecommerce"
                    className="w-full max-h-96 object-cover object-center rounded border border-gray-200"
                    src={`https://places.googleapis.com/v1/${
                      img.name
                    }/media?key=AIzaSyChKQRC17o-TBf_uJvmHrrE7miSWMWF7S4&maxWidthPx=${Math.min(
                      img.widthPx,
                      4800
                    )}`}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                {place?.primaryTypeDisplayName?.text}
              </h2>
              <a
                href={place?.websiteUri}
                target="_blank"
                rel="noreferrer"
                className="text-gray-900 text-3xl title-font font-medium mb-1 hover:underline cursor-pointer "
              >
                {place?.displayName?.text}
              </a>
              <div className="flex my-4">
                <div className="flex items-center">
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="google img"
                    className="h-5 mr-1"
                  />
                  <span className="font-[700] text-sm mr-1.5 ml-1">
                    {place?.rating} •
                  </span>

                  <div className="text-sm font-[700]">
                    {place?.userRatingCount} ratings
                  </div>
                </div>
                <div className="flex items-center mx-auto">
                  <div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      role="img"
                      aria-hidden="true"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="9"
                        fill="url(#StoreRating20_svg__paint0_linear_32982_71567)"
                      ></circle>
                      <path
                        d="M10.0816 12.865C10.0312 12.8353 9.96876 12.8353 9.91839 12.865L7.31647 14.3968C6.93482 14.6214 6.47106 14.2757 6.57745 13.8458L7.27568 11.0245C7.29055 10.9644 7.26965 10.9012 7.22195 10.8618L4.95521 8.99028C4.60833 8.70388 4.78653 8.14085 5.23502 8.10619L8.23448 7.87442C8.29403 7.86982 8.34612 7.83261 8.36979 7.77777L9.54092 5.06385C9.71462 4.66132 10.2854 4.66132 10.4591 5.06385L11.6302 7.77777C11.6539 7.83261 11.706 7.86982 11.7655 7.87442L14.765 8.10619C15.2135 8.14085 15.3917 8.70388 15.0448 8.99028L12.7781 10.8618C12.7303 10.9012 12.7095 10.9644 12.7243 11.0245L13.4225 13.8458C13.5289 14.2757 13.0652 14.6214 12.6835 14.3968L10.0816 12.865Z"
                        fill="white"
                      ></path>
                      <defs>
                        <linearGradient
                          id="StoreRating20_svg__paint0_linear_32982_71567"
                          x1="10"
                          y1="1"
                          x2="10"
                          y2="19"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#21973B"></stop>
                          <stop offset="1" stopColor="#128540"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <span className="font-[700] text-sm mr-1.5 ml-2">
                    {ourReviews.length > 0
                      ? Math.random() * (4.5 - 3.5) + 3.5
                      : 0}{" "}
                    •
                  </span>

                  <div className="text-sm font-[700]">
                    {ourReviews.length} ratings
                  </div>
                </div>
              </div>

              <p className="leading-relaxed">{place?.editorialSummary?.text}</p>
              <div className="flex flex-col mt-2 mb-4 space-y-2">
                <div className="flex">
                  <span className="flex items-center">
                    <img
                      src="https://www.svgrepo.com/show/504557/maps.svg"
                      className="h-5"
                      alt="website"
                    />
                    <a
                      href={place?.googleMapsUri}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 cursor-pointer hover:underline text-gray-500 text-xs font-semibold"
                    >
                      {place.formattedAddress}
                    </a>
                  </span>
                </div>
                <div className="flex">
                  <a href={place?.googleMapsUri} className=" text-gray-500">
                    <img
                      src="https://www.svgrepo.com/show/474939/phone-android.svg"
                      className="h-5"
                      alt="website"
                    />
                  </a>
                  <span
                    href={place?.nationalPhoneNumber}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 text-gray-500 cursor-pointer hover:underline text-xs font-semibold"
                  >
                    {place?.nationalPhoneNumber}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {place?.types?.map((chip) => (
                  <span
                    key={chip}
                    className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <div className=" flex my-3">
                <button
                  className="flex ml-auto text-white bg-black
                 border-0 py-2 px-6 focus:outline-none  rounded"
                  onClick={handleShowModal}
                >
                  Write Review
                </button>
                {/* <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                 
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="flex justify-around mt-8">
        <div className="flex justify-start  items-center gap-x-4 ">
          <p
            className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800 dark:text-white flex items-center"
            ref={scrollRef}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google img"
              className="h-12 mr-1"
            />{" "}
            Reviews{" "}
          </p>
          {search && (
            <span
              onClick={() => {
                setSearch("");
              }}
              className="cursor-pointer bg-gray-300 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 mt-1"
            >
              Reset
            </span>
          )}
        </div>
        <div className="flex justify-start  items-center gap-x-4 ">
          <p
            className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800 dark:text-white flex items-center "
            ref={scrollRef}
          >
            <img
              src="https://img.icons8.com/?size=100&id=Ot9kqqzPU1Lw&format=png"
              className="h-12 mr-1"
              alt="RevUp Logo"
            />
            Reviews{" "}
          </p>
          {ourSearch && (
            <span
              onClick={() => {
                setOurSearch("");
              }}
              className="cursor-pointer bg-gray-300 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300 mt-1"
            >
              Reset
            </span>
          )}
        </div>
      </div>
      <WordCloud
        words={words}
        ourWords={ourWords}
        setSearch={handleSearch}
        setOurSearch={handleOurSearch}
      />
      {/* <div className="flex justify-around h-56">
        <div className="w-1/2 absolute left-[25%]">
          {" "}
          <div className="flex items-center mb-2">
            <svg
              className="w-4 h-4 text-yellow-300 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 text-yellow-300 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 text-yellow-300 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 text-yellow-300 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 text-gray-300 me-1 dark:text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              4.95
            </p>
            <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              out of
            </p>
            <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              5
            </p>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            1,745 global ratings
          </p>
          <div className="flex items-center mt-4">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-500">
              5 star
            </p>
            <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div
                className="h-5 bg-yellow-300 rounded"
                style={{
                  width: "70%",
                }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              70%
            </span>
          </div>
          <div className="flex items-center mt-4">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-500">
              4 star
            </p>
            <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div
                className="h-5 bg-yellow-300 rounded"
                style={{
                  width: "17%",
                }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              17%
            </span>
          </div>
          <div className="flex items-center mt-4">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-500">
              3 star
            </p>
            <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div
                className="h-5 bg-yellow-300 rounded"
                style={{
                  width: "8%",
                }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              8%
            </span>
          </div>
          <div className="flex items-center mt-4">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-500">
              2 star
            </p>
            <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div
                className="h-5 bg-yellow-300 rounded"
                style={{
                  width: "4%",
                }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              4%
            </span>
          </div>
          <div className="flex items-center mt-4">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-500">
              1 star
            </p>
            <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div
                className="h-5 bg-yellow-300 rounded"
                style={{
                  width: "1%",
                }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              1%
            </span>
          </div>
        </div>
      </div> */}
      <div className="pt-12 pb-4 px-4 md:px-8 2xl:container 2xl:mx-auto flex justify-around items-start gap-x-8">
        <div className="flex flex-col justify-start items-start w-full space-y-8">
          <div className=" max-h-[86vh] overflow-auto w-full">
            {place?.reviews?.length > 0 ? (
              <>
                {place.reviews
                  .filter((review) => {
                    if (search) {
                      const stringsArray = search.toLowerCase().split(" ");

                      return stringsArray.every((str) =>
                        review.text.text.toLowerCase().includes(str)
                      );
                    } else return true;
                  })
                  .map((review, idx) => (
                    <article
                      key={idx}
                      className="border-b py-4 w-full border-b-[#eee]"
                    >
                      <div className="flex items-center mb-2">
                        <img
                          className="w-10 h-10 me-4 "
                          src={review.authorAttribution.photoUri}
                          alt=""
                        />
                        <div className="font-medium dark:text-white">
                          <p>
                            {review.authorAttribution.displayName}{" "}
                            <time
                              dateTime="2014-08-16 19:00"
                              className="text-sm text-gray-500 dark:text-gray-400 flex"
                            >
                              {getRating(review.rating)}
                            </time>
                          </p>
                        </div>
                      </div>

                      <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                        <p>
                          Reviewed on{" "}
                          <time dateTime="2017-03-03 19:00">
                            {dayjs(review.publishTime).format("MMMM D, YYYY")}
                          </time>
                        </p>
                      </footer>
                      <p className="mb-2 text-gray-500 dark:text-gray-400">
                        {review.text.text}
                      </p>

                      <aside>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {Math.floor(Math.random() * 100) + 1} people found
                            this helpful
                          </span>
                        </p>
                        <div className="flex items-center mt-3">
                          <p className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                            Helpful
                          </p>
                          <p className="ps-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-4 border-s md:mb-0 dark:border-gray-600">
                            Report abuse
                          </p>
                        </div>
                      </aside>
                    </article>
                  ))}
              </>
            ) : (
              <>
                {" "}
                <div className="w-full">
                  <div className="mx-auto max-w-sm p-5 bg-white border border-gray-200  shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-col rounded-lg cursor-pointer">
                    <img src={NoReviewImg} alt="img" className="" />
                    <div className="text-center">
                      <p className="font-bold text-gray-700 my-3">
                        No Google review&apos;s found
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-start items-start w-full space-y-8">
          <div className=" max-h-[86vh] overflow-auto w-full ">
            {ourReviews.length > 0 ? (
              <>
                {ourReviews
                  .filter(({ data }) => {
                    if (ourSearch) {
                      const stringsArray = ourSearch.toLowerCase().split(" ");

                      return stringsArray.every((str) =>
                        data.review.toLowerCase().includes(str)
                      );
                    } else return true;
                  })
                  .map(({ data }, idx) => (
                    <article
                      key={idx}
                      className="border-b py-4 w-full border-b-[#eee]"
                    >
                      <div className="flex items-center mb-2">
                        <img
                          className="w-10 h-10 me-4 rounded-full"
                          src={data.photoURL}
                          alt=""
                        />
                        <div className="font-medium dark:text-white">
                          <p>
                            {data.name}{" "}
                            <time
                              dateTime="2014-08-16 19:00"
                              className="text-sm text-gray-500 dark:text-gray-400 flex"
                            >
                              {getRating(data.rating)}
                            </time>
                          </p>
                        </div>
                      </div>

                      <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                        <p>
                          Reviewed on{" "}
                          <time dateTime="2017-03-03 19:00">
                            {dayjs(data.timestamp.toDate()).format(
                              "MMMM D, YYYY"
                            )}
                          </time>
                        </p>
                      </footer>
                      <p className="mb-2 text-gray-500 dark:text-gray-400">
                        {data.review}
                      </p>

                      <aside>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {Math.floor(Math.random() * 100) + 1} people found
                          this helpful
                        </p>
                        <div className="flex items-center mt-3">
                          <p className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-xs px-2 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                            Helpful
                          </p>
                          <p className="ps-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-4 border-s md:mb-0 dark:border-gray-600">
                            Report abuse
                          </p>
                        </div>
                      </aside>
                    </article>
                  ))}
              </>
            ) : (
              <>
                {" "}
                <div className="w-full">
                  <div className="mx-auto max-w-sm p-5 bg-white border border-gray-200  shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-col rounded-lg cursor-pointer">
                    <img src={NoReviewImg} alt="img" className="" />
                    <div className="text-center">
                      <p className="font-bold text-gray-700 my-3">
                        No review&apos;s found
                      </p>
                      <div className=" flex my-3">
                        <button
                          className="  text-white w-full bg-black
                 border-0 py-2 px-6 focus:outline-none  rounded"
                          onClick={handleShowModal}
                        >
                          Write Review
                        </button>
                        {/* <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                 
                </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <div
          id="crud-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="show  flex fixed top-0 right-0 left-0 z-[9999] justify-center items-center w-full md:inset-0  h-screen overflow-hidden  bg-black bg-opacity-75"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Give Feedback
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(!showModal)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="crud-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Rating
                    </label>
                    <select
                      id="category"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required
                      placeholder="Select Rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Rating
                      </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Review
                    </label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      required
                      id="description"
                      rows="4"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write review here"
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Add New Review
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Place;

const getRating = (num) => {
  let number = +num;
  return (
    <>
      {[...Array(number)].map((_, idx) => (
        <svg
          key={idx}
          className="w-4 h-4 text-yellow-300"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      ))}
      {[...Array(5 - number)].map((_, idx) => (
        <svg
          key={idx}
          className="w-4 h-4 text-gray-300 dark:text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      ))}
    </>
  );
};
