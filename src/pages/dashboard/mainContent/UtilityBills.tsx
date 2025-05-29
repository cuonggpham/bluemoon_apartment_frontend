import Row from "../../../components/Row";
import Heading from "../../../components/Heading";
import Modal from "../../../components/Modal";
import UtilityBillList from "../../../components/UtilityBillList";
import UtilityBillUpload from "../../../components/UtilityBillUpload";
import { useState } from "react";

export default function UtilityBills() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger refresh of the list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Modal>
      <Row type="horizontal">
        <Heading as="h1">Utility Bills Management</Heading>
        <Modal.Open id="uploadUtilityBill">
          <button className="upload-utility-btn">
            Upload Utility Bill +
          </button>
        </Modal.Open>
      </Row>
      
      <UtilityBillList refreshTrigger={refreshTrigger} />
      
      <Modal.Window id="uploadUtilityBill" name="Upload Utility Bill">
        <UtilityBillUpload onSuccess={handleUploadSuccess} />
      </Modal.Window>
    </Modal>
  );
}
