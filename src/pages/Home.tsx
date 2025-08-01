import { useState } from "react";
import TopHeader from "@/components/TopHeader";
import MainNavigation from "@/components/MainNavigation";

import ExploreTab from "@/components/ExploreTab";
import NetworkTab from "@/components/NetworkTab";
import ForYouTab from "@/components/ForYouTab";

const Home = () => {
  const [activeTab, setActiveTab] = useState("foryou");

  return (
    <div className="mobile-viewport bg-background flex flex-col">
      <TopHeader />
      
      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="grid w-full grid-cols-3 bg-transparent h-12 rounded-none">
          <button
            onClick={() => setActiveTab("network")}
            className={`text-sm border-b-2 transition-colors ${
              activeTab === "network" 
                ? "border-primary text-primary" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Network
          </button>
          <button
            onClick={() => setActiveTab("foryou")}
            className={`text-sm border-b-2 transition-colors ${
              activeTab === "foryou" 
                ? "border-primary text-primary" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setActiveTab("explore")}
            className={`text-sm border-b-2 transition-colors ${
              activeTab === "explore" 
                ? "border-primary text-primary" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Destaques
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {activeTab === "explore" && <ExploreTab />}
        {activeTab === "network" && <NetworkTab />}
        {activeTab === "foryou" && <ForYouTab />}
      </div>

      <MainNavigation />
    </div>
  );
};

export default Home;