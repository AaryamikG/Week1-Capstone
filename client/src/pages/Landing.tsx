import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing container">
      <div className="landing-hero">
        <h1>Recipes worth sharing.</h1>
        <p>
          Spoonful is where creators publish their best recipes and everyone
          else finds something good to cook tonight.
        </p>
        <div className="row landing-actions">
          <Link to="/recipes" className="btn btn-primary">
            Explore Recipes
          </Link>
          <Link to="/login" className="btn btn-outline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
