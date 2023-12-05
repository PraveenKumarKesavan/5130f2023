import axios from "axios";
import { db } from "../firebase/firebase";
import uniqid from "uniqid";

import { collection, doc, getDocs, setDoc } from "firebase/firestore";
export const getTextSearch = async (textQuery) => {
  try {
    const { data } = await axios({
      url: "https://places.googleapis.com/v1/places:searchText",
      method: "POST",
      headers: {
        "X-Goog-FieldMask":
          "places.displayName,places.id,places.formattedAddress,places.priceLevel,places.rating,places.userRatingCount,places.primaryTypeDisplayName,places.photos,places.editorialSummary",
        "X-Goog-Api-Key": "AIzaSyChKQRC17o-TBf_uJvmHrrE7miSWMWF7S4",
      },
      params: {
        textQuery,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getPlaceByLatLan = async (lat, lng) => {
  try {
    const { data } = await axios({
      url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyChKQRC17o-TBf_uJvmHrrE7miSWMWF7S4`,
    });
    let name = data?.plus_code?.compound_code;
    const nameArr = name.split(" ");
    nameArr.shift();
    name = "Resturants near " + nameArr.join("");
    console.log(name);

    const response = await getTextSearch(name);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getPlaceDetails = async (placeId) => {
  try {
    const { data } = await axios({
      url: `https://places.googleapis.com/v1/places/${placeId}`,
      headers: {
        "X-Goog-FieldMask":
          "displayName,id,formattedAddress,priceLevel,rating,userRatingCount,primaryTypeDisplayName,photos,editorialSummary,googleMapsUri,nationalPhoneNumber,primaryTypeDisplayName,reviews,types,websiteUri,userRatingCount,editorialSummary",
        "X-Goog-Api-Key": "AIzaSyChKQRC17o-TBf_uJvmHrrE7miSWMWF7S4",
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Function to add a review to a product
export async function addPlaceReview(
  placeId,
  rating,
  review,
  name,
  email,
  photoURL
) {
  try {
    await setDoc(doc(db, "places", placeId, "reviews", uniqid()), {
      rating: rating,
      review: review,
      email: email,
      name: name,
      photoURL:
        photoURL || "https://www.svgrepo.com/show/335199/user-circle.svg",
      timestamp: new Date(),
    });

    // Add a new review document with the provided data

    console.log("Review added successfully!");
    return true;
  } catch (error) {
    console.error("Error adding review: ", error);
    return false;
  }
}
export async function getPlaceReviews(placeId) {
  try {
    const querySnapshot = await getDocs(
      collection(db, "places", placeId, "reviews")
    );

    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    return reviews;
  } catch (error) {
    console.error("Error getting reviews: ", error);
    return [];
  }
}
