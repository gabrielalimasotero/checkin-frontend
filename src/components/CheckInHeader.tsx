
import { Button } from "@/components/ui/button";

interface CurrentVenue {
  name: string;
  table: string;
  checkInTime: string;
  isActive: boolean;
}

interface CheckInHeaderProps {
  currentVenue: CurrentVenue;
}

const CheckInHeader = ({ currentVenue }: CheckInHeaderProps) => {
  if (!currentVenue.isActive) return null;

  return (
    <div className="bg-gradient-to-r from-checkin-turquoise-500 to-checkin-petrol-600 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div>
            <h2 className="font-semibold">{currentVenue.name}</h2>
            <p className="text-sm opacity-90">{currentVenue.table} • Check-in: {currentVenue.checkInTime}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-white border-white/20">
          Finalizar
        </Button>
      </div>
    </div>
  );
};

export default CheckInHeader;
