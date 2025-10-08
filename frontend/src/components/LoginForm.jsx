import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      setMessage("Login successful!");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <section className="flex justify-center w-auto mt-8 px-4">
      <div className="bg-[#d3d3d3] p-8 sm:p-10 rounded-3xl max-w-[650px] w-full mx-auto mt-4">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-900">Email</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="w-full px-4 py-3 rounded-lg border border-black text-base bg-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-900">Enter password</label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-black text-base bg-white"
            />
          </div>

          <p className="text-sm text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#4a90ff] hover:underline">
              Register Here
            </Link>
          </p>

          <button
            type="submit"
            className="bg-[#588AFF] text-white text-lg py-1 px-10 rounded-full mx-auto hover:bg-[#749cf7] transition"
          >
            Submit
          </button>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}
        </form>
      </div>
    </section>
  );
};

export default LoginForm;