import ResturantCard from "./ResturantCard";
import PropTypes from "prop-types";

const Resturants = ({ resturants }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {resturants.map((resturant) => (
        <div key={resturant.id}>
          <ResturantCard resturant={resturant} />
        </div>
      ))}
    </div>
  );
};

export default Resturants;

// Prop validations
Resturants.propTypes = {
  resturants: PropTypes.array.isRequired,
};
