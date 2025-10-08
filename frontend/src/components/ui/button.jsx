import "./Button.css";

const Button = ({ children, onClick, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      className={`custom-button ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;