import { Soup } from "lucide-react";
import { Link } from "react-router-dom";
import "./Logo.css";

export default function Logo() {
  return (
    <Link to="/" className="logo">
      <Soup size={22} strokeWidth={2.2} className="logo-icon" />
      <span className="logo-text">spoonful</span>
    </Link>
  );
}
