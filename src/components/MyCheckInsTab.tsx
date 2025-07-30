
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ExternalLink } from "lucide-react";

interface CheckIn {
  id: number;
  venue: string;
  time: string;
  status: string;
  image: string;
}

interface MyCheckInsTabProps {
  checkins: CheckIn[];
}

const MyCheckInsTab = ({ checkins }: MyCheckInsTabProps) => {
  return (
    <div className="space-y-4">
      {checkins.length > 0 ? (
        checkins.map((checkin) => (
          <Card key={checkin.id} className="p-4">
            <div className="flex items-center space-x-3">
              <img 
                src={checkin.image} 
                alt={checkin.venue}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-checkin-deep-700">{checkin.venue}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{checkin.time}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={checkin.status === "Ativo" ? "default" : "secondary"}
                  className={checkin.status === "Ativo" ? "bg-green-500" : ""}
                >
                  {checkin.status}
                </Badge>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum check-in encontrado</p>
          <p className="text-sm text-gray-400 mt-1">Seus check-ins aparecerão aqui</p>
        </div>
      )}
    </div>
  );
};

export default MyCheckInsTab;
