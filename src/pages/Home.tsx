import { useState } from "react";
import TopHeader from "@/components/TopHeader";
import MainNavigation from "@/components/MainNavigation";
import HomeSubTabs from "@/components/HomeSubTabs";
import ExploreTab from "@/components/ExploreTab";
import NetworkTab from "@/components/NetworkTab";
import ForYouTab from "@/components/ForYouTab";

const Home = () => {
  const [activeTab, setActiveTab] = useState("network");

  return (
    <div className="mobile-viewport bg-background flex flex-col">
      <TopHeader />
      
      <div className="flex-1 overflow-y-auto">
        <HomeSubTabs activeTab={activeTab} onTabChange={setActiveTab}>
          {activeTab === "explore" && <ExploreTab />}
          {activeTab === "network" && <NetworkTab />}
          {activeTab === "foryou" && <ForYouTab />}
        </HomeSubTabs>
      </div>

      <MainNavigation />
    </div>
  );
};

export default Home;