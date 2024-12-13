import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

const QRScanner = ({ onScan }) => {
  const videoElementRef = useRef(null);
  const [scannedText, setScannedText] = useState("");

  useEffect(() => {
    const video = videoElementRef.current;
    const qrScanner = new QrScanner(
      video,
      (result) => {
        console.log("decoded qr code:", result);
        setScannedText(result.data);
        onScan(result.data);
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );
    qrScanner.start();
    console.log("QR Scanner started");

    return () => {
      qrScanner.stop();
      qrScanner.destroy();
      console.log("QR Scanner stopped");
    };
    
  }, [onScan]);

  return (
    <div>
      <div className="videoWrapper">
        <video className="qrVideo" ref={videoElementRef} />
      </div>
      <p className="scannedText">SCANNED: {scannedText}</p>
    </div>
  );
};

export default QRScanner;
