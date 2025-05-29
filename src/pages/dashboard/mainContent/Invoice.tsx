import Row from "../../../components/Row";
import Heading from "../../../components/Heading";
import Modal from "../../../components/Modal";
import Search from "../../../components/Search";
import InvoiceTable from "../../../features/invoices/InvoiceTable";
import { useState, useEffect } from "react";
import axios from "axios";
import Form from "../../../components/Form";
import FormField from "../../../components/FormField";
import Button from "../../../components/Button";
import { toast } from "react-toastify";
import styled from "styled-components";

// Styled components for modern invoice form
const InvoiceContainer = styled.div`
  position: relative;
  top: 8px;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const InvoiceForm = styled.form`
  width: 100%;
  max-width: 800px;
  display: flex;
  gap: var(--space-6);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  flex: 1;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);
  flex: 1;
  width: 300px;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
`;

const SelectRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
`;

const SelectLabel = styled.label`
  font-weight: 600;
  font-size: var(--font-size-base);
  color: var(--color-grey-700);
  min-width: 60px;
`;

const SelectField = styled.select`
  flex: 1;
  padding: var(--space-3);
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  background: var(--color-grey-0);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SummarySection = styled.div`
  margin-bottom: var(--space-4);
  padding: var(--space-4);
  background: linear-gradient(135deg, var(--color-grey-50), var(--color-grey-100));
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-grey-200);
`;

const SummaryHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  
  & > strong {
    font-size: var(--font-size-lg);
    color: var(--color-grey-800);
  }
`;

const TotalCount = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-grey-600);
  font-weight: 500;
`;

const WarningMessage = styled.div`
  color: var(--color-red-700);
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: var(--space-2) var(--space-3);
  background: var(--color-red-100);
  border: 1px solid var(--color-red-200);
  border-radius: var(--border-radius-md);
  margin-top: var(--space-2);
`;

const EmptyMessage = styled.div`
  color: var(--color-grey-500);
  font-size: var(--font-size-sm);
  font-style: italic;
  margin-top: var(--space-2);
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: var(--space-3) 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  margin: var(--space-2) 0;
  background: var(--color-grey-50);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-grey-200);
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-grey-100);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
`;

const RemoveButton = styled.button`
  background: var(--color-red-600);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: var(--font-size-lg);
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-red-700);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const SectionTitle = styled.strong`
  font-size: var(--font-size-base);
  color: var(--color-grey-800);
  margin-bottom: var(--space-2);
  display: block;
`;

export default function Invoice() {

  const [keyword, setKeyword] = useState('')

  return (
    <Modal>      <Row type="horizontal">
        <Heading as="h1">Invoices</Heading>
        <Search setKeyword={setKeyword} keyword={keyword}></Search>
      </Row>        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <Modal.Open id="createInvoice">
          <Button variation="primary" size="compact">
            Create Invoice +
          </Button>
        </Modal.Open>
      </div>

      <InvoiceTable keyword={keyword}/>      
      <Modal.Window id="createInvoice" name="Create Invoice">
        <InvoiceTDN />
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
    <InvoiceContainer>
      <InvoiceForm>
        <LeftColumn>
          <Form.Fields>
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

          <SelectRow>
            <SelectLabel>Fee:</SelectLabel>
            <SelectField
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
            </SelectField>
            <Button
              type="button"
              variation="success"
              size="small"
              onClick={addFee}
            >
              Add Fee
            </Button>
          </SelectRow>

          <SelectRow>
            <SelectLabel>Fund:</SelectLabel>
            <SelectField
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
            </SelectField>
            <Button
              type="button"
              variation="success"
              size="small"
              onClick={addFund}
            >
              Add Fund
            </Button>
          </SelectRow>

          <FormField>
            <FormField.Label label={"Description"} />
            <Form.TextArea
              id="description"
              value={formValues.description}
              onChange={handleChange}
            />
          </FormField>
        </LeftColumn>        
        
        <RightColumn>
          <SummarySection>
            <SummaryHeader>
              <strong>Invoice Summary</strong>
              <TotalCount>
                Total Items: {selectedFees.length + selectedFunds.length}
              </TotalCount>
              {selectedFees.length === 0 && selectedFunds.length === 0 && (
                <WarningMessage>
                  ⚠️ No fees or funds selected
                </WarningMessage>
              )}
            </SummaryHeader>
          </SummarySection>
          
          <div>
            <SectionTitle>Selected Fees ({selectedFees.length}):</SectionTitle>
            <ItemList>
              {selectedFees.map((fee, index) => (
                <ListItem key={index}>
                  <span>{fee}</span>
                  <RemoveButton
                    type="button"
                    onClick={() => removeFee(fee)}
                    title="Remove fee"
                  >
                    ×
                  </RemoveButton>
                </ListItem>
              ))}
            </ItemList>
            {selectedFees.length === 0 && (
              <EmptyMessage>No fees selected</EmptyMessage>
            )}
          </div>
          
          <div>
            <SectionTitle>Selected Funds ({selectedFunds.length}):</SectionTitle>
            <ItemList>
              {selectedFunds.map((fund, index) => (
                <ListItem key={index}>
                  <span>{fund}</span>
                  <RemoveButton
                    type="button"
                    onClick={() => removeFund(fund)}
                    title="Remove fund"
                  >
                    ×
                  </RemoveButton>
                </ListItem>
              ))}
            </ItemList>
            {selectedFunds.length === 0 && (
              <EmptyMessage>No funds selected</EmptyMessage>
            )}
          </div>
        </RightColumn>
      </InvoiceForm>

      <Button 
        variation={selectedFees.length === 0 && selectedFunds.length === 0 ? "secondary" : "primary"}
        size="large"
        onClick={saveForm}
        disabled={selectedFees.length === 0 && selectedFunds.length === 0}
        title={selectedFees.length === 0 && selectedFunds.length === 0 
          ? "Please select at least one fee or fund" 
          : "Save invoice"}
        style={{ alignSelf: 'flex-start', marginTop: 'var(--space-4)' }}
      >
        Save {selectedFees.length === 0 && selectedFunds.length === 0 && "⚠️"}
      </Button>
    </InvoiceContainer>
  );
}
