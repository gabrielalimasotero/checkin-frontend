

interface HomeSubTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const HomeSubTabs = ({ activeTab, onTabChange, children }: HomeSubTabsProps) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="grid w-full grid-cols-3 bg-transparent h-12 rounded-none">
          <button
            onClick={() => onTabChange("network")}
            className={`text-sm border-b-2 transition-colors ${
              activeTab === "network" 
                ? "border-primary text-primary" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Network
          </button>
          <button
            onClick={() => onTabChange("foryou")}
            className={`text-sm border-b-2 transition-colors ${
              activeTab === "foryou" 
                ? "border-primary text-primary" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            For You
          </button>
          <button
            onClick={() => onTabChange("explore")}
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
        {children}
      </div>
    </div>
  );
};

export default HomeSubTabs;