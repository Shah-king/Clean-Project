import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password.trim() !== confirmPassword.trim()) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const token = await auth.currentUser.getIdToken();

      await fetch("https://projectclean-backend-515656995079.us-central1.run.app/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: auth.currentUser.uid,
          name: `${first} ${last}`,
          role,
          email,
        }),
      });

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <section className="flex justify-center w-auto mt-8 px-4">
      <div className="bg-[#d3d3d3] p-8 sm:p-10 rounded-3xl max-w-[650px] w-full mx-auto mt-4">
        <h2 className="text-center text-3xl font-semibold mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="font-bold block mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-400 rounded-lg bg-white"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="first-name" className="font-bold block mb-1">
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                required
                placeholder="John"
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                className="w-full p-3 border border-gray-400 rounded-lg bg-white"
              />
            </div>

            <div className="flex-1">
              <label htmlFor="last-name" className="font-bold block mb-1">
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                required
                placeholder="Doe"
                value={last}
                onChange={(e) => setLast(e.target.value)}
                className="w-full p-3 border border-gray-400 rounded-lg bg-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="font-bold block mb-1">
              Enter Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-400 rounded-lg bg-white"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="font-bold block mb-1">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-400 rounded-lg bg-white"
            />
          </div>

          <div>
            <label htmlFor="role" className="font-bold block mb-1">
              Select Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full p-3 border border-gray-400 rounded-lg bg-white text-gray-800"
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="student">student</option>
              <option value="professor">professor</option>
              <option value="staff">staff</option>
            </select>
          </div>

          <p className="text-center text-sm mt-1">
            Have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login Here
            </Link>
          </p>

          <button
            type="submit"
            className="bg-[#588AFF] text-white text-lg py-1 px-10 rounded-full mx-auto hover:bg-[#749cf7] transition"
          >
            Submit
          </button>

          {error && <p className="text-center text-red-600">{error}</p>}
          {message && <p className="text-center text-green-600">{message}</p>}
        </form>
      </div>
    </section>
  );
};

export default RegisterForm;
