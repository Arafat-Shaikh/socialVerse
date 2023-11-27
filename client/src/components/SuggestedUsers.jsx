import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";

const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    async function getSuggestedUsers() {
      try {
        const response = await fetch(`/api/user/users`);
        const data = await response.json();

        if (data.error) {
          console.log(data.error);
        } else {
          console.log(data);
          setSuggestedUsers(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getSuggestedUsers();
  }, []);
  return <>{!loading && suggestedUsers.map((u) => <SuggestedUser u={u} />)}</>;
};

export default SuggestedUsers;
