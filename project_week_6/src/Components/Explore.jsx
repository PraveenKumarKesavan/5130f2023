import { useEffect, useState } from "react";
import Resturants from "./Resturants";
// import { getTextSearch } from "../api/api";
import { getPlaceByLatLan } from "../api/api";
import toast from "react-hot-toast";

const Explore = () => {
  const [resturants, setResturants] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      setLoading(false);
      // setResturants(data);
    }
  }, []);
  const fetchData = async () => {
    geoLocation();
  };
  const geoLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          console.log("LAT " + latitude);
          console.log("LNG " + longitude);
          const { places } = await getPlaceByLatLan(latitude, longitude);
          setResturants(places);
          setLoading(false);
        },
        showError
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };
  function showError(error) {
    setLoading(false);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        toast.error("Enable location to get personalized search results. 🌍");
        break;
      case error.POSITION_UNAVAILABLE:
        toast.error("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        toast.error("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        toast.error("An unknown error occurred.");
        break;
    }
  }
  if (loading)
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
      <div className="StyleWrapper__Main-sc-10ym97a-3 klWrLQ">
        <div>
          <div
            tabIndex="0"
            aria-label="Restaurants Near Me"
            role="banner"
            className="MasterHeading__Container-sc-6pjiye-0 fpGMDP"
          >
            <div
              aria-hidden="true"
              className="MasterHeading__Content-sc-6pjiye-4 kSkLVQ"
            >
              <div className="MasterHeading__TextWrapper-sc-6pjiye-1 hveOxk">
                <h1
                  color="text_High_Emphasis"
                  className="MasterHeading__TextContainer-sc-6pjiye-2 cCaqlf"
                >
                  Restaurants Near Me
                </h1>
                <div className="MasterHeading__CurvedUnderline-sc-6pjiye-5 fDZKcW">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 78 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 5.25939C27 -0.240624 53.5 -0.2406 77 4.25939"
                      stroke="#F15700"
                      strokeWidth="1.5"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="MasterHeading__ImageWrapper-sc-6pjiye-3 iTgrwg">
                <img
                  className="sc-eDLJxc hETPAk"
                  src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1002,h_600/v1678428358/portal/m/seo_web/dweb_header.png"
                  width="501"
                  height="300"
                  alt="food"
                />
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div className="px-6 lg:px-8 my-4">
        {resturants.length > 0 ? (
          <>
            <h1 className="text-3xl font-bold mb-4">
              Popular restaurants near me
            </h1>
            <Resturants resturants={resturants} />
          </>
        ) : (
          <>
            <div className="w-full">
              <div className="mx-auto max-w-md p-5 bg-white border border-gray-200  shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex rounded-lg cursor-pointer items-center">
                <img
                  src="https://lh3.googleusercontent.com/JCAAWPj3mGeDHwEqOz3kas7SIhGX4Miw-RQDcGMaFcwB9JlStUP25v5cqjjwdaOUA3dMNTkC0Uvgf5O4fppkrh6Qkr33G_j6Du3swj8JgA=w192-rw"
                  alt="img"
                />
                <p className="font-bold text-gray-700">
                  No Near By Resturants Found
                </p>
              </div>
            </div>
          </>
        )}{" "}
      </div>
    </div>
  );
};

export default Explore;
