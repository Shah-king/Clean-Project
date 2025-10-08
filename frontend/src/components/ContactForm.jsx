const ContactPage = () => {
  return (
    <section className="w-full px-6 py-12 flex justify-center">
      <form className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Contact Form</h2>

        {/* First and Last Name */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex flex-col w-full">
            <label className="mb-1 text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              required
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="mb-1 text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              required
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="mb-1 text-sm font-medium block">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="mb-1 text-sm font-medium block">Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="mb-1 text-sm font-medium block">Message</label>
          <textarea
            name="message"
            placeholder="Message"
            required
            className="w-full h-32 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
            type="submit"
            className="w-full bg-[#588AFF] text-white font-noraml py-2 rounded-md hover:bg-[#749cf7] transition"
            >
            Send Message
        </button>
      </form>
    </section>
  );
};

export default ContactPage;