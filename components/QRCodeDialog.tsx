import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import DownloadOutlined from "@mui/icons-material/DownloadOutlined";

interface QRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  shortCode?: string;
}

export function QRCodeDialog({
  open,
  onOpenChange,
  url,
  shortCode,
}: QRDialogProps) {
  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = `${shortCode || "qr-code"}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      toast.success("QR Code downloaded successfully");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleCopyURL = () => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">QR Code</DialogTitle>
          <DialogDescription className="text-center text-sm text-slate-400">
            Scan to visit instantly
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-8">
          {/* QR Code Container */}
          <div className="rounded-2xl bg-white p-6 shadow-inner">
            <QRCode
              id="qr-code-svg"
              value={url}
              size={240}
              bgColor="#ffffff"
              fgColor="#0b1326"
              level="H" // High error correction
            />
          </div>

          {/* URL Display */}
          <div className="mt-6 w-full max-w-xs text-center">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
              Short Link
            </p>
            <p className="font-mono text-sm text-[#c0c1ff] break-all">{url}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleCopyURL}
            className="flex-1 gap-2 border-white/20 hover:bg-white/5"
          >
            <ContentCopyOutlined sx={{ fontSize: 20 }} />
            Copy Link
          </Button>

          <Button
            onClick={handleDownload}
            className="flex-1 gap-2 bg-[#c0c1ff] text-[#0d0096] hover:bg-[#c0c1ff]/90"
          >
            <DownloadOutlined sx={{ fontSize: 20 }} />
            Download PNG
          </Button>
        </div>

        <p className="text-center text-[10px] text-slate-500 mt-4">
          High quality • Works offline • Instant access
        </p>
      </DialogContent>
    </Dialog>
  );
}
