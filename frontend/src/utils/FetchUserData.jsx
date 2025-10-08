// function to fetch user's data from backend api by user id
// input : uid(Firebase generatd user id)
// output: user's data in json format
export const fetchUserById = async (uid) => {
  if (!uid) {
    throw new Error("UID is required to fetch user data");
  }
  try {
    const response = await fetch(`https://projectclean-backend-515656995079.us-central1.run.app/api/user/${uid}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const userData = await response.json();
    return userData;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
   }
}