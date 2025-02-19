import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Mail } from 'lucide-react';

interface PdfDialogProps {
  onGenerate: (customerName: string, email: string) => Promise<{ blob: Blob; fileName: string }>;
}

export function PdfDialog({ onGenerate }: PdfDialogProps) {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfFileName, setPdfFileName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Generar el PDF y obtener el blob
      const result = await onGenerate(customerName, email);
      
      if (!email) {
        // Si no hay email, cerrar el diálogo
        setOpen(false);
        setCustomerName('');
        setEmail('');
      } else {
        // Si hay email, guardar el blob para enviarlo después
        setPdfBlob(result.blob);
        setPdfFileName(result.fileName);
        // No cerramos el diálogo para permitir enviar por email
      }
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };

  const handleEmailSend = () => {
    if (pdfBlob && email) {
      // Crear el mailto link
      const mailtoLink = `mailto:${email}?subject=Presupuesto BIC - ${customerName}&body=Adjunto encontrarás el presupuesto solicitado.`;
      
      // Abrir el cliente de correo
      window.open(mailtoLink);

      // Cerrar el diálogo y limpiar el estado
      setOpen(false);
      setCustomerName('');
      setEmail('');
      setPdfBlob(null);
      setPdfFileName('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-orange-500 hover:bg-orange-600">
          <FileText className="mr-2 h-4 w-4" />
          Generar PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generar Presupuesto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Nombre del cliente</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Introduce el nombre del cliente"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@dominio.com"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={!customerName}
            >
              <FileText className="mr-2 h-4 w-4" />
              Generar PDF
            </Button>
            {email && pdfBlob && (
              <Button 
                type="button" 
                className="flex-1"
                onClick={handleEmailSend}
              >
                <Mail className="mr-2 h-4 w-4" />
                Enviar por Email
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
