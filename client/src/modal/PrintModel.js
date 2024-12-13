import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import html2canvas from "html2canvas";
import hospitalLogo from "../assets/newLogo.jpg"; // assuming you have this asset

const PrintModel = ({
  isOpen,
  onOpenChange,
  unavailableDrugs,
  pharmacistName,
  patientName,
  patientAge,
  currentDate,
}) => {
  const handleDownload = () => {
    const printContent = document.getElementById("print-id");

    html2canvas(printContent, {
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "prescription.png";
      link.click();
    });
  };

  return (
    <Modal
      size="lg"
      placement="top-center"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <form>
              <ModalBody className="flex flex-row justify-center">
                <div
                  id="print-id"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px",
                    backgroundColor: "#f8f8f8",
                    width: "400px",
                    height: "550px",
                    position: "relative",
                    border: "1px solid black",
                  }}
                >
                  {/* Logo in the top-right corner */}
                  <img
                    src={hospitalLogo}
                    alt="Hospital Logo"
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      width: "80px",
                      height: "80px",
                    }}
                  />

                  <div style={{ marginBottom: "10px", fontSize: "16px", fontWeight: "bold" }}>
                   Mr. {pharmacistName || 'Kamal Bandara'}
                    <br />
                    <span style={{ fontWeight: "normal", fontSize: "12px" }}>Pharmacist</span>
                  </div>

                  <div
                    style={{
                      border: "1px solid #d3d3d3",
                      padding: "5px",
                      fontSize: "12px",
                      lineHeight: "1.5",
                      width: "250px",
                    }}
                  >
                    ENT unit
                    <br />
                    Kolonna Base Hospital
                    <br />
                    Kolonna
                    <br />
                    Tel: 045 6572302
                  </div>

                  <div style={{ marginTop: "20px", marginBottom: "10px", borderTop: "1px solid black" }}></div>

                  <div style={{ fontSize: "14px", marginBottom: "20px" }}>
                    <table>
                      <tr>
                        <td><strong>Patient's Name &nbsp;&nbsp;</strong></td>
                        <td>:&nbsp;{patientName || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><strong>Age &nbsp;&nbsp;</strong></td>
                        <td>:&nbsp;{patientAge || 'N/A'} years</td>
                      </tr>
                      <tr>
                        <td><strong>Issued date &nbsp; &nbsp;</strong></td>
                        <td>:&nbsp;{currentDate || 'N/A'}</td>
                      </tr>
                    </table>
                    
                  </div>


                  <div style={{ fontSize: "14px", marginBottom: "20px" }}>
                    <strong>Prescription list:</strong>
                    <div style={{ marginTop: "10px", fontSize: "14px" }}>
                      {unavailableDrugs.length > 0
                        ? unavailableDrugs.map((drug, index) => <div key={index}>{drug}</div>)
                        : "No drugs selected"}
                    </div>
                  </div>

                  <div style={{ position: "absolute", bottom: "30px", left: "0", right: "0", textAlign: "center" }}>
                    <div style={{ borderTop: "1px solid black", width: "80%", margin: "0 auto", marginTop: "30px" }}></div>
                    {/* Optional footer content */}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={unavailableDrugs.length > 0 ? handleDownload : null}>
                  print now
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PrintModel;
