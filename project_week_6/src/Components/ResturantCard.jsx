import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
const ResturantCard = ({ resturant }) => {
  //   const color = getColor(5);
  const photo =
    !!resturant?.photos?.length > 0
      ? `https://places.googleapis.com/v1/${
          resturant?.photos[0].name
        }/media?key=AIzaSyChKQRC17o-TBf_uJvmHrrE7miSWMWF7S4&maxWidthPx=${Math.min(
          resturant?.photos[0].widthPx,
          4800
        )}`
      : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";

  return (
    <Link
      to={`/place/${resturant.id}`}
      className="w-full max-w-md bg-white rounded-lg  thegrow dark:bg-gray-800 dark:border-gray-700 overflow-hidden lgOeYp"
    >
      <div className="sc-kFCsca giWlNM">
        <div className="sc-irLwvL hNNsKQ">
          <div width="100%" height="100%" className="sc-qZqnM fwEgds">
            <img
              className="sc-eDLJxc kvGwZG"
              loading="lazy"
              src={photo}
              alt="Leon's - Burgers &amp; Wings (Leon Grill)"
            />
          </div>
        </div>
      </div>
      <div style={{ marginLeft: "12px" }}>
        <div className="my-2">
          <div className="font-semibold text-lg line-clamp-1">
            {resturant?.displayName.text}
          </div>
        </div>
        <div className="flex items-center">
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
          <span className="font-[700] text-sm mr-1.5 ml-1">
            {resturant?.rating} •
          </span>

          <div className="text-sm font-[700]">
            {resturant?.userRatingCount} ratings
          </div>

          {/* <div className="ml-auto">
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
          <span className="font-[700] text-sm mr-1.5 ml-1">
            {resturant?.rating} •
          </span>

          <div className="text-sm font-[700]">
            {resturant?.userRatingCount} ratings
          </div> */}
        </div>
        <div className="">
          <div className="line-clamp-2">{resturant?.formattedAddress}</div>
        </div>
      </div>
    </Link>
  );
};

export default ResturantCard;
