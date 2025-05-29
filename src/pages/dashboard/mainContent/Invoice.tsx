import Row from "../../../components/Row";
import Heading from "../../../components/Heading";
import Modal from "../../../components/Modal";
import Search from "../../../components/Search";
import InvoiceTable from "../../../features/invoices/InvoiceTable";
import { useState, useEffect } from "react";
import axios from "axios";
import Form from "../../../components/Form";
import FormField from "../../../components/FormField";
import UtilityBill from "../../../components/UtilityBill";
import { toast } from "react-toastify";

export default function Invoice() {

  const [keyword, setKeyword] = useState('')

  return (
    <Modal>
      <Row type="horizontal">
        <Heading as="h1">Invoices</Heading>
        <Search setKeyword={setKeyword} keyword={keyword}></Search>
      </Row>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <Modal.Open id="createInvoice">
          <button
            className="btTdn"
            style={{
              backgroundColor: "#667BC6",
              color: "white",
              fontWeight: "400",
              padding: "9px 8px",
              border: "none",
              borderRadius: "16px",
              fontSize: "16px",
              cursor: "pointer",
              width: "155px",
            }}
          >
            Create Invoice +
          </button>
        </Modal.Open>

        <Modal.Open id="addUtility">
          <button
            className="btTdn"
            style={{
              backgroundColor: "#708871",
              color: "white",
              fontWeight: "400",
              padding: "7px 8px",
              border: "none",
              borderRadius: "16px",
              fontSize: "16px",
              cursor: "pointer",
              width: "145px",
            }}
          >
            Add Utility Bill +
          </button>
        </Modal.Open>
      </div>

      <InvoiceTable keyword={keyword}/>

      <Modal.Window id="createInvoice" name="Create Invoice">
        <InvoiceTDN />
      </Modal.Window>

      <Modal.Window id="addUtility" name="Add Utility Bill">
        <UtilityBill />
      </Modal.Window>
    </Modal>
  );
}

function InvoiceTDN() {  const [formValues, setFormValues] = useState({
    name: "",
    feeType: "",
    fundType: "",
    description: "",
  });

  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [savedData, setSavedData] = useState<any[]>([]);

  const [feeOptions, setFeeOptions] = useState<any[]>([]); // Thay đổi thành any[] để lưu cả id và name
  const [fundOptions, setFundOptions] = useState<any[]>([]);
  const [feeIds, setFeeIds] = useState<string[]>([]); // Mảng lưu trữ id của fee
  const [fundIds, setFundIds] = useState<string[]>([]); // Mảng lưu trữ id của fund

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/fees");
        const data = response.data.data.result;

        const fees = data
          .filter((item: any) => item.feeTypeEnum === "DepartmentFee" || item.feeTypeEnum === "VehicleFee")
          .map((item: any) => ({ id: item.id, name: item.name }));
        const funds = data
          .filter((item: any) => item.feeTypeEnum === "ContributionFund")
          .map((item: any) => ({ id: item.id, name: item.name }));

        setFeeOptions(fees);
        setFundOptions(funds);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const addFee = () => {
    const selectedFee = feeOptions.find(
      (fee) => fee.name === formValues.feeType
    );
    if (selectedFee && !selectedFees.includes(selectedFee.name)) {
      setSelectedFees((prev) => [...prev, selectedFee.name]);
      setFeeIds((prev) => [...prev, selectedFee.id]);
    }
  };
  const addFund = () => {
    const selectedFund = fundOptions.find(
      (fund) => fund.name === formValues.fundType
    );
    if (selectedFund && !selectedFunds.includes(selectedFund.name)) {
      setSelectedFunds((prev) => [...prev, selectedFund.name]);
      setFundIds((prev) => [...prev, selectedFund.id]);
    }
  };

  const removeFee = (feeName: string) => {
    const feeToRemove = feeOptions.find((fee) => fee.name === feeName);
    if (feeToRemove) {
      setSelectedFees((prev) => prev.filter((fee) => fee !== feeName));
      setFeeIds((prev) => prev.filter((id) => id !== feeToRemove.id));
    }
  };

  const removeFund = (fundName: string) => {
    const fundToRemove = fundOptions.find((fund) => fund.name === fundName);
    if (fundToRemove) {
      setSelectedFunds((prev) => prev.filter((fund) => fund !== fundName));
      setFundIds((prev) => prev.filter((id) => id !== fundToRemove.id));
    }
  };
  const saveForm = async (event: React.FormEvent) => {
    event.preventDefault();

    // Gộp feeIds và fundIds thành một mảng duy nhất
    const combinedFeeIds = [...feeIds, ...fundIds];

    // Validation: Kiểm tra xem có ít nhất một fee hoặc fund được chọn
    if (combinedFeeIds.length === 0) {
      toast.error("Please select at least one fee or fund before creating an invoice");
      return;
    }    
    
    // Validation: Kiểm tra các trường bắt buộc
    // Invoice ID is now optional - will be auto-generated if empty
    if (!formValues.name.trim()) {
      toast.error("Invoice name is required");
      return;
    }

    // Hiển thị loading state
    toast.info("Creating invoice...");    // Chuẩn bị payload
    const payload = {
      name: formValues.name,
      description: formValues.description,
      feeIds: combinedFeeIds, // Gửi mảng gộp
    };try {
      // Gửi dữ liệu tới API
      await axios.post(
        "http://localhost:8080/api/v1/invoices",
        payload
      );

      toast.success("Create Invoice Successfull");
    } catch (error) {
      toast.error("Có lỗi xảy ra");
      // console.error("Error saving invoice:", error);
    }

    setSavedData((prevData) => [...prevData, payload]);
    console.log(savedData);    setFormValues({
      name: "",
      feeType: "",
      fundType: "",
      description: "",
    });
    setSelectedFees([]);
    setSelectedFunds([]);
    setFeeIds([]);
    setFundIds([]);
  };

  return (
    <div style={invoiceStyles.container}>
      <form style={invoiceStyles.form}>
        <div style={invoiceStyles.leftColumn}>          <Form.Fields>
            <FormField>
              <FormField.Label label={"Name"} />
              <FormField.Input
                id="name"
                type="text"
                value={formValues.name}
                onChange={handleChange}
              />
            </FormField>
          </Form.Fields>

          <div style={invoiceStyles.row}>
            <label className="font-bold">Fee: </label>
            <select
              style={invoiceStyles.input}
              id="feeType"
              value={formValues.feeType}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {feeOptions.map((fee, index) => (
                <option key={index} value={fee.name}>
                  {fee.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              style={invoiceStyles.addButton}
              onClick={addFee}
            >
              Add Fee
            </button>
          </div>

          <div style={invoiceStyles.row}>
            <label className="font-bold">Fund: </label>
            <select
              style={invoiceStyles.input}
              id="fundType"
              value={formValues.fundType}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {fundOptions.map((fund, index) => (
                <option key={index} value={fund.name}>
                  {fund.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              style={invoiceStyles.addButton}
              onClick={addFund}
            >
              Add Fund
            </button>
          </div>

          <label>Description: </label>
          <Form.TextArea
            id="description"
            value={formValues.description}
            onChange={handleChange}
          />
        </div>        
        <div style={invoiceStyles.rightColumn}>
          <div style={invoiceStyles.summarySection}>
            <div style={invoiceStyles.summaryHeader}>
              <strong>Invoice Summary</strong>
              <div style={invoiceStyles.totalCount}>
                Total Items: {selectedFees.length + selectedFunds.length}
              </div>
              {selectedFees.length === 0 && selectedFunds.length === 0 && (
                <div style={invoiceStyles.warningMessage}>
                  ⚠️ No fees or funds selected
                </div>
              )}
            </div>
          </div>
            <div>
            <strong>Selected Fees ({selectedFees.length}):</strong>
            <ul style={invoiceStyles.itemList}>
              {selectedFees.map((fee, index) => (
                <li key={index} style={invoiceStyles.listItem}>
                  <span>{fee}</span>
                  <button
                    type="button"
                    style={invoiceStyles.removeButton}
                    onClick={() => removeFee(fee)}
                    title="Remove fee"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            {selectedFees.length === 0 && (
              <div style={invoiceStyles.emptyMessage}>No fees selected</div>
            )}
          </div>
          <div>
            <strong>Selected Funds ({selectedFunds.length}):</strong>
            <ul style={invoiceStyles.itemList}>
              {selectedFunds.map((fund, index) => (
                <li key={index} style={invoiceStyles.listItem}>
                  <span>{fund}</span>
                  <button
                    type="button"
                    style={invoiceStyles.removeButton}
                    onClick={() => removeFund(fund)}
                    title="Remove fund"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            {selectedFunds.length === 0 && (
              <div style={invoiceStyles.emptyMessage}>No funds selected</div>
            )}
          </div>
        </div>      
        </form>

      <button 
        style={{
          ...invoiceStyles.saveButton,
          ...(selectedFees.length === 0 && selectedFunds.length === 0 
            ? invoiceStyles.saveButtonDisabled 
            : {})
        }}
        onClick={saveForm}
        disabled={selectedFees.length === 0 && selectedFunds.length === 0}
        title={selectedFees.length === 0 && selectedFunds.length === 0 
          ? "Please select at least one fee or fund" 
          : "Save invoice"}
      >
        Save {selectedFees.length === 0 && selectedFunds.length === 0 && "⚠️"}
      </button>
    </div>
  );
}

const invoiceStyles: { [key: string]: React.CSSProperties } = {
  container: {
    position: "relative" as const,
    top: "8px",
    padding: "10px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },
  btTdn: {
    display: "inline-flex",
  },
  form: {
    width: "800px",
    display: "flex",
    gap: "20px",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    flex: 1,
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    padding: "12px",
    flex: 1,
    width: "300px",
    border: "1px solid black",
    borderRadius: "12px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },  addButton: {
    backgroundColor: "#18BB4C",
    color: "white",
    padding: "8px 8px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#667BC6",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  saveButtonDisabled: {
    backgroundColor: "#6c757d",
    cursor: "not-allowed",
    opacity: "0.6",
  },
  summarySection: {
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    border: "1px solid #e9ecef",
  },
  summaryHeader: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "5px",
  },
  totalCount: {
    fontSize: "14px",
    color: "#6c757d",
    fontWeight: "500",
  },
  warningMessage: {
    color: "#dc3545",
    fontSize: "14px",
    fontWeight: "500",
    padding: "5px 8px",
    backgroundColor: "#f8d7da",
    border: "1px solid #f5c6cb",
    borderRadius: "4px",
    marginTop: "5px",
  },
  emptyMessage: {
    color: "#6c757d",
    fontSize: "14px",
    fontStyle: "italic",
    marginTop: "5px",
  },
  itemList: {
    listStyle: "none",
    padding: "0",
    margin: "8px 0",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    margin: "4px 0",
    backgroundColor: "#f8f9fa",
    borderRadius: "6px",
    border: "1px solid #e9ecef",
  },
  removeButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: "1",
  },
};
