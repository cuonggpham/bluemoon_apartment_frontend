import { useState, useEffect } from "react";
import "./utility.css";
import Table from "./Table";
import * as XLSX from "xlsx";
import axios from "axios";
import { toast } from "react-toastify";

const UtilityBill = () => {
  // State lưu trữ dữ liệu từ file excel
  const [dataExcel, setDataExcel] = useState<any[]>([]);
  const [fileName, setFileName] = useState(""); // Lưu tên file
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Lưu file được chọn
  const [billName, setBillName] = useState(""); // Lưu tên hóa đơn
  const [utilityBills, setUtilityBills] = useState<any[]>([]); // Lưu danh sách utility bills từ server
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch utility bills từ API  
  const fetchUtilityBills = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/utilitybills?page=${page}&size=10`
      );
      console.log("API Response:", response.data); // Debug log
      setUtilityBills(response.data.data.result || []);
      setTotalPages(response.data.data.totalPages || 0);
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
  }, []);

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

  // Xử lý khi người dùng chọn file
  const handleFileChange = (e: any) => {
    const file = e.target.files[0]; // Lấy file đầu tiên
    if (file) {
      setFileName(file.name); // Lưu tên file
      setSelectedFile(file); // Lưu file
      readExcel(file); // Đọc file
    }
  };

  // Xử lý khi gửi dữ liệu
  const handleSubmit = async () => {

    if (!selectedFile || !billName) {
      toast.error("Please select a file and enter a bill name.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile); // Thêm file vào formData
      formData.append("name", billName); // Thêm tên hóa đơn vào formData

      const response = await axios.post(
        "http://localhost:8080/api/v1/utilitybills/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );      // Hiển thị thông báo thành công
      toast.success("Add Utility Bill Successfully!");
      console.log(response.data); // In dữ liệu phản hồi từ server
      
      // Reset form và refresh utility bills list
      setFileName("");
      setSelectedFile(null);
      setBillName("");
      setDataExcel([]);
      fetchUtilityBills(currentPage);
    } catch (err: any) {
      console.error(err);
      
      // Extract error message from backend response
      let errorMessage = "An error occurred while uploading the file.";
      
      if (err.response?.data?.message) {
        // Backend trả về ApiResponse với message
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        // Fallback cho error field
        errorMessage = err.response.data.error;
      } else if (err.message) {
        // Axios error message
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    }
  };
  // Hàm đọc và parse file excel/csv
  const readExcel = (file: any) => {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.csv')) {
      readCSV(file);
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      readExcelFile(file);
    } else {
      toast.error("Unsupported file type. Please use CSV, XLS, or XLSX files.");
      return;
    }
  };

  // Hàm đọc file CSV
  const readCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map((h: string) => h.trim());
      
      const jsonData = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const values = line.split(',').map((v: string) => v.trim());
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });
          jsonData.push(row);
        }
      }
      setDataExcel(jsonData);
    };
    reader.readAsText(file);
  };

  // Hàm đọc file Excel
  const readExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Lấy sheet đầu tiên
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // Chuyển dữ liệu từ sheet thành JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setDataExcel(jsonData); // Lưu dữ liệu vào state
    };
    reader.readAsArrayBuffer(file); // Đọc file Excel
  };
  return (
    <div style={{ 
      padding: "20px",
      maxWidth: "100%",
      margin: "0 auto"
    }}>
      {/* File Upload Section */}
      <div style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "30px",
        border: "1px solid #dee2e6"
      }}>
        <h3 style={{ marginBottom: "15px", color: "#495057" }}>Upload Utility Bill File</h3>
        
        <input
          type="file"
          id="upload"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <label 
          id="uploadLabel" 
          htmlFor="upload"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none"
          }}
        >
          <i className="bx bx-upload"></i> Upload File
        </label>

        {fileName && (
          <p style={{ 
            marginTop: "10px", 
            color: "#28a745",
            fontWeight: "500"
          }}>
            Selected File: {fileName}
          </p>
        )}
      </div>

      {/* Preview Section */}
      {dataExcel.length > 0 && (
        <div style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #dee2e6"
        }}>
          <h3 style={{ marginBottom: "15px", color: "#495057" }}>Preview Data</h3>
          
          <Table columns="1fr 1.4fr 1.4fr 1.4fr">
            <Table.Header size="small">
              <div>Apartment</div>
              <div>Electricity</div>
              <div>Water</div>
              <div>Internet</div>
            </Table.Header>          
            {dataExcel.map((room, index) => (
              <Table.Row size="small" key={index}>
                <div>{room.apartmentId || room.apartment}</div>
                <div>{room.electricity}</div>
                <div>{room.water}</div>
                <div>{room.internet}</div>
              </Table.Row>
            ))}
          </Table>

          <div style={{ 
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <label htmlFor="billName" style={{ fontWeight: "500" }}>
              Bill Name:
            </label>
            <input
              id="billName"
              type="text"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #ced4da",
                borderRadius: "4px",
                minWidth: "250px"
              }}
              placeholder="Enter bill name..."
            />
            <button 
              type="submit" 
              onClick={handleSubmit}
              style={{
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "500"
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Utility Bills List */}
      <div style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid #dee2e6"
      }}>
        <h3 style={{ marginBottom: "15px", color: "#495057" }}>Utility Bills List</h3>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Table columns="0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr">
              <Table.Header size="small">
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
                <Table.Row size="small" key={bill.id}>
                  <div>{bill.id}</div>
                  <div>{bill.name}</div>
                  <div>{bill.apartment?.addressNumber || bill.apartmentId}</div>
                  <div>{bill.electricity?.toLocaleString()} VND</div>
                  <div>{bill.water?.toLocaleString()} VND</div>
                  <div>{bill.internet?.toLocaleString()} VND</div>
                  <div>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        color: "white",
                        backgroundColor: bill.paymentStatus === "Paid" ? "#4CAF50" : "#FF9800",
                        fontSize: "12px"
                      }}
                    >
                      {bill.paymentStatus}
                    </span>
                  </div>
                  <div>
                    {bill.paymentStatus === "Unpaid" && (
                      <button
                        onClick={() => updatePaymentStatus(bill.id)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#2196F3",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px"
                        }}
                      >
                        Mark Paid
                      </button>
                    )}
                  </div>
                </Table.Row>
              ))}
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
                <button
                  onClick={() => fetchUtilityBills(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: currentPage === 1 ? "#ccc" : "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer"
                  }}
                >
                  Previous
                </button>
                <span style={{ alignSelf: "center" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => fetchUtilityBills(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: currentPage === totalPages ? "#ccc" : "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UtilityBill;
