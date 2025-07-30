import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HomeSubTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const HomeSubTabs = ({ activeTab, onTabChange, children }: HomeSubTabsProps) => {
  return (
    <div className="w-full h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full h-full flex flex-col">
        <div className="sticky top-0 z-40 bg-white border-b border-border">
          <TabsList className="grid w-full grid-cols-3 bg-transparent h-12 rounded-none">
            <TabsTrigger 
              value="network" 
              className="text-sm data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
            >
              Network
            </TabsTrigger>
            <TabsTrigger 
              value="foryou" 
              className="text-sm data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
            >
              For You
            </TabsTrigger>
            <TabsTrigger 
              value="explore" 
              className="text-sm data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
            >
              Destaques
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </Tabs>
    </div>
  );
};

export default HomeSubTabs;