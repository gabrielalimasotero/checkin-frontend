
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle } from "lucide-react";

interface CheckInDialogsProps {
  showLocationDialog: boolean;
  setShowLocationDialog: (show: boolean) => void;
  showPaymentCompleteDialog: boolean;
  setShowPaymentCompleteDialog: (show: boolean) => void;
  waiterCode: string;
  onPaymentComplete: () => void;
}

const CheckInDialogs = ({
  showLocationDialog,
  setShowLocationDialog,
  showPaymentCompleteDialog,
  setShowPaymentCompleteDialog,
  waiterCode,
  onPaymentComplete
}: CheckInDialogsProps) => {
  return (
    <>
      {/* Location Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>Localização Necessária</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Para fazer check-in, você precisa estar fisicamente no local. Nossa verificação de localização garante a autenticidade dos check-ins.
            </p>
            <div className="text-center py-4">
              <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Aproxime-se do local para continuar</p>
            </div>
            <Button 
              className="w-full bg-checkin-turquoise-500 hover:bg-checkin-turquoise-600"
              onClick={() => setShowLocationDialog(false)}
            >
              Entendi
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Complete Dialog */}
      <Dialog open={showPaymentCompleteDialog} onOpenChange={setShowPaymentCompleteDialog}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="text-center">Pagamento Confirmado!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-green-600">Tudo certo!</h3>
              <p className="text-sm text-gray-600 mt-2">
                Sua conta foi finalizada com sucesso. Obrigado por usar o CheckIn!
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">
                Código da transação: #{waiterCode}-{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
            </div>
            <Button 
              className="w-full bg-checkin-turquoise-500 hover:bg-checkin-turquoise-600"
              onClick={onPaymentComplete}
            >
              Finalizar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckInDialogs;
