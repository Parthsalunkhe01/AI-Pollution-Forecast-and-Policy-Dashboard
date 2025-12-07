// src/pages/CommunityPage.jsx
import { useEffect, useState } from "react";
import { fetchCommunityData } from "../services/api.js";
import CommunityPanel from "../components/dashboard/CommunityPanel.jsx";

export default function CommunityPage() {
  const [community, setCommunity] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCommunityData();
        setCommunity(data);
      } catch (err) {
        console.error("Error loading community", err);
      }
    })();
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <CommunityPanel community={community} />
    </div>
  );
}
