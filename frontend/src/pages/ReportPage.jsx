import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase"; // adjust path if needed
import { fetchUserById } from "../utils/FetchUserData";
import { BACKEND_URL } from "../constants"; // url to hosted backend APi service
import getFirebaseUser from "../utils/GetFirebaseUser"; 


const ReportPage = () => {
    const [imageFile, setImageFile] = useState(null); // to stor image file submitted by user
    const [imagePreview, setImagePreview] = useState(null);  // display image to user
    const [submitting, setSubmitting] = useState(false);  // submitting state
    const {firebaseUser, authLoading} = getFirebaseUser(); // Firebase user instance
    const [userData, setUserData] = useState(null);

    const [form, setForm] = useState({title: "", description: "",location: "",});
    const navigate = useNavigate();

    // Fetch user from your backend via helper
    const fetchAndStoreUser = async (uid) => {
      try {
        const data = await fetchUserById(uid);
        setUserData({ ...data, uid });
      } catch (err) {
        setError("Could not load user data.");
      }
    };

    // control of input form
    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    // getting and storing image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
         // Word count limits
        const titleWords = form.title.trim().split(/\s+/);
        const locationWords = form.location.trim().split(/\s+/);
        if (titleWords.length > 15) {
          alert("Title cannot exceed 15 words.");
          return;
        }
        if (locationWords.length > 15) {
          alert("Location cannot exceed 15 words.");
          return;
        }
        if (!form.title || !form.description || !form.location) {
            alert("Please fill in all fields.");
            return;
        }
        setSubmitting(true);
        try {
            if (!imageFile) {
              alert("Please upload an image.");
              return;
            }

            // Upload image to Firebase Storage
            const imageRef = ref(storage, `reports/${Date.now()}-${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            // getting the url link to image generatd by Firebase
            const imageUrl = await getDownloadURL(imageRef);
            // Prepare report data
            const newReport = {
                ...form,
                image: imageUrl,
                creator_id: userData.uid|| "unknown",
                author_name: userData.name || "unknown",
                handler_id: null,
                handler_name:"",
            };

            // Send report to backend
            const res = await fetch(`${BACKEND_URL}/create/report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newReport),
            });

            if (!res.ok) throw new Error("Failed to create report");
            navigate("/feed");
        } catch (err) {
            alert("Something went wrong while creating the report.");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
      if (firebaseUser?.uid) {
        fetchAndStoreUser(firebaseUser.uid);
      } else {
        setUserData(null);
      }
    }, [firebaseUser]);

    return (
         <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create Report</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="desc w-full border px-4 py-2 rounded"
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <div>
            
        
<div class="flex items-center justify-center w-full">
    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        </div>
        <input accept="image/*" id="dropzone-file"  onChange={handleImageChange} type="file" class="hidden" />
        {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 rounded border w-40 h-40 object-cover"
            />
          )}
    </label>
</div> 

        
         
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}

export default ReportPage;