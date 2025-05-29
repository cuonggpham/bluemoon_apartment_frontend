import { useState, useEffect } from "react";
import "./utility.css";
import Table from "./Table";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "./Pagination";

const UtilityBillList = ({ refreshTrigger }: { refreshTrigger?: number }) => {
  const [utilityBills, setUtilityBills] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch utility bills từ API  
  const fetchUtilityBills = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/utilitybills?page=${page}&size=10`
      );
      
      setUtilityBills(response.data.data.result || []);
      setTotalPages(response.data.data.totalPages || 0);
      setTotalElements(response.data.data.totalElements || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching utility bills:", error);
      toast.error("Failed to fetch utility bills");
    } finally {
      setLoading(false);
    }
  };

  // Load utility bills khi component mount
  useEffect(() => {
    fetchUtilityBills();
  }, [refreshTrigger]);

  // Update payment status
  const updatePaymentStatus = async (billId: number) => {
    try {
      await axios.post(`http://localhost:8080/api/v1/utilitybills/update/${billId}`);
      toast.success("Payment status updated successfully!");
      fetchUtilityBills(currentPage); // Refresh data
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    }
  };

  const handlePageChange = (page: number) => {
    fetchUtilityBills(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Table columns="0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr">
      <Table.Header>
        <div>ID</div>
        <div>Bill Name</div>
        <div>Apartment</div>
        <div>Electricity</div>
        <div>Water</div>
        <div>Internet</div>
        <div>Status</div>
        <div>Action</div>
      </Table.Header>

      {utilityBills.map((bill) => (
        <Table.Row key={bill.id}>
          <div>{bill.id}</div>
          <div>{bill.name}</div>
          <div>{bill.apartment?.addressNumber || bill.apartmentId}</div>
          <div>{bill.electricity?.toLocaleString()} VND</div>
          <div>{bill.water?.toLocaleString()} VND</div>
          <div>{bill.internet?.toLocaleString()} VND</div>
          <div>
            <span
              className={`status-badge ${bill.paymentStatus === "Paid" ? "paid" : "unpaid"}`}
            >
              {bill.paymentStatus}
            </span>
          </div>
          <div>
            {bill.paymentStatus === "Unpaid" && (
              <button
                onClick={() => updatePaymentStatus(bill.id)}
                className="mark-paid-btn"
              >
                Mark Paid
              </button>
            )}
          </div>
        </Table.Row>
      ))}
      
      <Table.Footer>
        <Pagination
          totalPages={totalPages}
          curPage={currentPage}
          totalElements={totalElements}
          onPageChange={handlePageChange}
        />
      </Table.Footer>
    </Table>
  );
};

export default UtilityBillList;
