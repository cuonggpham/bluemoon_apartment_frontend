import { useEffect, useState } from "react";
import "./form.css";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import styled from "styled-components";

// Modern styled components for statistics form
const StatisticsWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 800px;
  height: 500px;
  background: var(--color-grey-0);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
`;

const StatisticsContent = styled.div`
  overflow-y: auto;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: var(--space-6);
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--color-grey-100);
    border-radius: var(--border-radius-md);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-300);
    border-radius: var(--border-radius-md);
    
    &:hover {
      background: var(--color-grey-400);
    }
  }
`;

const SectionTitle = styled.p`
  color: var(--color-grey-800);
  font-weight: 600;
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--color-grey-200);
`;

const BillingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  &.incomplete {
    background: linear-gradient(135deg, var(--color-red-500), var(--color-red-600));
    color: white;
    box-shadow: var(--shadow-sm);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  }

  &.complete {
    background: linear-gradient(135deg, var(--color-green-500), var(--color-green-600));
    color: white;
    box-shadow: var(--shadow-sm);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
  }
`;

const BillingDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-6);
  background: var(--color-grey-50);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--space-4);
  box-shadow: var(--shadow-sm);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--space-4);
  background: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  
  th {
    font-weight: 600;
    background: var(--color-grey-800);
    color: white;
    padding: var(--space-4);
    text-align: center;
    font-size: var(--font-size-base);
    
    &:first-child {
      border-radius: var(--border-radius-lg) 0 0 0;
    }
    
    &:last-child {
      border-radius: 0 var(--border-radius-lg) 0 0;
    }
  }
  
  td {
    font-weight: 500;
    font-size: var(--font-size-base);
    padding: var(--space-4);
    text-align: center;
    border-bottom: 1px solid var(--color-grey-200);
    
    &:hover {
      background: var(--color-grey-50);
    }
  }
`;

const TotalDue = styled.div`
  padding: var(--space-3) var(--space-4);
  background: linear-gradient(135deg, var(--color-red-500), var(--color-red-600));
  color: white;
  text-align: right;
  border-radius: var(--border-radius-lg);
  font-weight: 600;
  font-size: var(--font-size-base);
  width: fit-content;
  margin-left: auto;
  margin-top: var(--space-3);
  box-shadow: var(--shadow-sm);
`;

const Arrow = styled.span`
  font-size: var(--font-size-base);
  transition: transform 0.3s ease;
  color: white;
  
  &.open {
    transform: rotate(180deg);
  }
`;

const StatusSpan = styled.span`
  color: white;
  font-weight: 600;
  font-size: var(--font-size-base);
`;

const VoluntaryFundContainer = styled.div`
  margin: var(--space-4) 0;
  padding: var(--space-4);
  background: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-grey-200);
  
  label {
    font-size: var(--font-size-base);
    font-weight: 500;
    color: var(--color-grey-700);
    display: block;
    margin-bottom: var(--space-2);
    
    strong {
      color: var(--color-brand-600);
    }
  }
`;

const VoluntaryInput = styled.input`
  border: 1px solid var(--color-grey-300);
  margin-left: var(--space-2);
  border-radius: var(--border-radius-lg);
  padding: var(--space-3);
  font-size: var(--font-size-base);
  width: 200px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const PayButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: var(--space-4);
`;

interface StatisticsFormProps {
  statistic: {
    addressNumber: string;
  };
}

const StatisticsForm = ({ statistic }: StatisticsFormProps) => {
  const { addressNumber } = statistic;

  const [dataInvoice, setDataInvoice] = useState<any[]>([]);
  const [dataUtility, setDataUtility] = useState<any[]>([]);
  const [openDropdowns, setOpenDropdowns] = useState<any>({});
  const [voluntaryFund, setVoluntaryFund] = useState<any>({}); // Lưu số tiền tự nguyện cho từng `Fund 2`

  const toggleDropdown = (key: any) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleVoluntaryFundChange = (invoiceId: string, value: string) => {
    setVoluntaryFund((prevState: any) => ({
      ...prevState,
      [invoiceId]: parseFloat(value) || 0, // Chuyển giá trị nhập sang số
    }));
  };

  const apiInvoice = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/invoiceapartment/${addressNumber}`
      );
      setDataInvoice(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const apiPayInvoice = async (invoiceId: string, feeList: any[]) => {
    try {
      // Tạo payload chứa fund ID và số tiền tự nguyện
      const payload = feeList.reduce((acc: any, fee: any) => {
        if (fee.feeType === "ContributionFund") {
          acc[fee.id] = voluntaryFund[invoiceId] || 0; // Lấy số tiền tự nguyện từ `voluntaryFund`
        }
        return acc;
      }, {});

      // Gửi request API
      const response = await axios.put(
        `http://localhost:8080/api/v1/invoiceapartment/update/${addressNumber}/${invoiceId}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Invoice paid successfully!");
      apiInvoice(); // Reload dữ liệu sau khi thanh toán
    } catch (err) {
      console.error(err);
      toast.error("Failed to pay the invoice.");
    }
  };

  const apiUtility = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/utilitybills/${addressNumber}`
      );
      setDataUtility(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const apiPayUtility = async (utilityId: string) => {
    try {
      console.log(dataUtility[0].id);
      // Đoạn này
      const response = await axios.post(
        `http://localhost:8080/api/v1/utilitybills/update/${utilityId}`
      );
      toast.success("Pay Successfull");
      apiUtility();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    apiInvoice();
    apiUtility();
  }, []);
  return (
    <StatisticsWrapper>
      <StatisticsContent>
        <SectionTitle>Invoice (Fee and Fund):</SectionTitle>
        {dataInvoice.map((invoice, index) => (
          <div key={index}>
            <BillingHeader
              className={invoice.paymentStatus === "Unpaid" ? "incomplete" : "complete"}
              onClick={() => toggleDropdown(invoice.id)}
            >
              <StatusSpan>{invoice.name}</StatusSpan>
              <StatusSpan>
                {invoice.paymentStatus === "Unpaid" ? "Unpaid" : "Paid"}
              </StatusSpan>
              <Arrow className={openDropdowns[invoice.id] ? "open" : ""}>
                &#9662;
              </Arrow>
            </BillingHeader>
            {openDropdowns[invoice.id] && (
              <BillingDetails>
                <StyledTable>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.feeList.map((fee: any, feeIndex: number) => (
                      <tr key={feeIndex}>
                        <td>{fee.name}</td>
                        <td>{fee.feeType}</td>
                        <td>
                          {fee.name === "Fund 2"
                            ? (
                                fee.amount + (voluntaryFund[invoice.id] || 0)
                              ).toLocaleString()
                            : fee.amount.toLocaleString()}{" "}
                          VND
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </StyledTable>
                
                {/* Voluntary fund input */}
                {invoice.paymentStatus === "Unpaid" &&
                  invoice.feeList.map(
                    (fee: any) =>
                      fee.feeType === "ContributionFund" && (
                        <VoluntaryFundContainer key={fee.name}>
                          <label>
                            Enter voluntary contribution for{" "}
                            <strong>{fee.name}</strong>:{" "}
                            <VoluntaryInput
                              type="text"
                              value={voluntaryFund[invoice.id] || ""}
                              onChange={(e) =>
                                handleVoluntaryFundChange(
                                  invoice.id,
                                  e.target.value
                                )
                              }
                            />
                          </label>
                        </VoluntaryFundContainer>
                      )
                  )}
                
                <TotalDue>
                  Total amount:{" "}
                  {invoice.feeList
                    .reduce((sum: number, fee: any) => {
                      if (fee.feeType === "DepartmentFee") {
                        return (
                          sum + fee.amount + (voluntaryFund[invoice.id] || 0)
                        );
                      }
                      return sum + fee.amount;
                    }, 0)
                    .toLocaleString()}{" "}
                  VND
                </TotalDue>
                  {/* Pay button for unpaid invoices */}
                {invoice.paymentStatus === "Unpaid" && (
                  <PayButtonContainer>
                    <Button
                      onClick={() => apiPayInvoice(invoice.id, invoice.feeList)}
                      variation="success"
                      size="compact"
                    >
                      Pay 💳
                    </Button>
                  </PayButtonContainer>
                )}
              </BillingDetails>
            )}
          </div>
        ))}
        
        <SectionTitle>Utility Bill:</SectionTitle>
        {dataUtility.map((utility, index) => (
          <div key={index}>
            <BillingHeader
              className={utility.paymentStatus === "Unpaid" ? "incomplete" : "complete"}
              onClick={() => toggleDropdown(utility.id)}
            >
              <StatusSpan>{utility.name}</StatusSpan>
              <StatusSpan>
                {utility.paymentStatus === "Unpaid" ? "Unpaid" : "Paid"}
              </StatusSpan>
              <Arrow className={openDropdowns[utility.id] ? "open" : ""}>
                &#9662;
              </Arrow>
            </BillingHeader>
            {openDropdowns[utility.id] && (
              <BillingDetails>
                <StyledTable>
                  <thead>
                    <tr>
                      <th>Electricity</th>
                      <th>Water</th>
                      <th>Internet</th>
                      <th>Created At</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{utility.electricity.toLocaleString()} VND</td>
                      <td>{utility.water.toLocaleString()} VND</td>
                      <td>{utility.internet.toLocaleString()} VND</td>
                      <td>
                        {new Date(utility.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        {(
                          utility.electricity +
                          utility.water +
                          utility.internet
                        ).toLocaleString()}{" "}
                        VND
                      </td>
                    </tr>
                  </tbody>
                </StyledTable>
                  {utility.paymentStatus === "Unpaid" && (
                  <PayButtonContainer>
                    <Button
                      onClick={() => apiPayUtility(utility.id)}
                      variation="success"
                      size="compact"
                    >
                      Pay 💳
                    </Button>
                  </PayButtonContainer>
                )}
              </BillingDetails>
            )}
          </div>
        ))}
      </StatisticsContent>
    </StatisticsWrapper>
  );
};

export default StatisticsForm;
