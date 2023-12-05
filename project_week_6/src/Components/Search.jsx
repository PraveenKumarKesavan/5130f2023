import { StandaloneSearchBox } from "@react-google-maps/api";
import { useRef, useState } from "react";
import { getTextSearch } from "../api/api";
import Resturants from "./Resturants";
// import { data } from "./data";
// import Autocomplete from "react-google-autocomplete";
import SearchImg from "../assets/search.png";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const handleChange = async () => {
    const query = textSearchRef.current.value;
    const data = await getTextSearch(query);
    setSearchQuery(query);
    console.log(data);
    if (data?.places?.length > 0) {
      const { places } = data;

      setPlaces(places);
    } else {
      setPlaces([]);
    }
  };
  const textSearchRef = useRef(null);

  return (
    <div className="">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleChange();
        }}
      >
        <div className="flex w-2/3 mx-auto py-4">
          <div className="relative w-full">
            <StandaloneSearchBox onPlacesChanged={handleChange}>
              <input
                ref={textSearchRef}
                type="search"
                id="search-dropdown"
                className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg   border border-gray-300 pr-4  "
                placeholder="Search Places..."
                required
              />
            </StandaloneSearchBox>

            <button
              type="submit"
              className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-black rounded-e-lg border border-black hover:bg-black focus:ring-4 focus:outline-none focus:ring-black dark:bg-black dark:hover:bg-black dark:focus:ring-black "
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
        </div>
      </form>

      <h1 className="pl-8 mt-1 font-bold text-md">
        {!!searchQuery && `Results for ${searchQuery}`}
      </h1>
      <div className="p-8 pt-4">
        {places?.length > 0 ? (
          <Resturants resturants={places} />
        ) : searchQuery !== "" ? (
          <div className="w-full">
            <div className="mx-auto max-w-sm p-5 bg-white border border-gray-200  shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex rounded-lg cursor-pointer">
              <img
                src="https://lh3.googleusercontent.com/JCAAWPj3mGeDHwEqOz3kas7SIhGX4Miw-RQDcGMaFcwB9JlStUP25v5cqjjwdaOUA3dMNTkC0Uvgf5O4fppkrh6Qkr33G_j6Du3swj8JgA=w192-rw"
                alt="img"
              />
              <div>
                <p className="font-bold text-gray-700">
                  No Results for {searchQuery}
                </p>
                <p className="font-semibold text-[11px] text-gray-400">
                  Try checking your spelling
                </p>
                <p className="font-semibold text-[11px] text-gray-400">
                  Or Explore nearby
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <img
              src={SearchImg}
              alt="search img"
              width={"500"}
              className="mx-auto"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
