import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const ScanQrModalAttendant = ({ isOpen, onOpenChange, setData }) => {
  const [loading, setLoading] = useState(false);
  const videoElementRef = useRef(null);
  const [scannedText, setScannedText] = useState("");
  const qrScannerRef = useRef(null);

  const handleScan = (data) => {
    fetchPatientData(data);
  };
  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async (id) => {
    setLoading(true);
    try {
      // const response = await fetch(`http://localhost:5000/patients/${id}`, {
      const response = await fetch(`http://localhost:5000/patients/${id}`, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 404) {
        toast.error("Patient not found.");
      } else if (response.status === 200) {
        const data = await response.json();
        const patient = data.patient;
        setData(patient);
        toast.success("Successfully retrieved patient.");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error retrieving patient:", error);
      toast.error("Failed to retrieve patient.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const video = videoElementRef.current;

    if (isOpen && video) {
      const qrScanner = new QrScanner(
        video,
        (result) => {
          console.log("decoded qr code:", result);
          setScannedText(result.data);
          handleScan(result.data);
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      qrScannerRef.current = qrScanner;
      qrScanner.start();
      console.log("QR Scanner started");
    }

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        console.log("QR Scanner stopped and destroyed");
      }
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        video.srcObject = null;
      }
    };
  }, [isOpen]);

  return (
    <Modal
      size="sm"
      placement="top-center"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Scan QR Code
            </ModalHeader>
            <ModalBody>
              {loading ? (
                <Spinner />
              ) : (
                isOpen && (
                  <div>
                    <div className="videoWrapper">
                      <video className="qrVideo" ref={videoElementRef} />
                    </div>
                    {/* <p className="scannedText">SCANNED: {scannedText}</p> */}
                  </div>
                )
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" auto onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ScanQrModalAttendant;
