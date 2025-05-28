import { useState, useEffect } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Selector from "../../components/Selector";
import Button from "../../components/Button";
import { HiOutlinePlusCircle, HiPencil, HiTrash } from "react-icons/hi2";
import ApartmentSearchDropdown from "../../components/ApartmentSearchDropdown";
import axios from "axios";
import { toast } from "react-toastify";

export default function VehicleForm({ vehicle }: any) {
  const [formValues, setFormValues] = useState({
    apartmentId: vehicle?.apartment?.addressNumber || vehicle?.apartmentId || "",
    registerDate: vehicle?.registerDate || "",
    id: vehicle?.id || "",
    category: vehicle?.category || "",
  });
  
  const [selectedApartment, setSelectedApartment] = useState<any>(null);
  const vehicleTypeOptions = ["Motorbike", "Car"];

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };
  const handleApartmentSelect = (apartment: any) => {
    setSelectedApartment(apartment);
    setFormValues((prevValues) => ({
      ...prevValues,
      apartmentId: apartment?.addressNumber || "",
    }));
  };
  // Initialize selected apartment when editing existing vehicle
  useEffect(() => {
    // Check if we have apartment data from VehicleResponse
    if (vehicle?.apartment) {
      setSelectedApartment({
        addressNumber: vehicle.apartment.addressNumber,
        area: vehicle.apartment.area,
        status: vehicle.apartment.status,
      });
    } else if (vehicle?.apartmentId && !selectedApartment) {
      // Fallback: fetch apartment details for old structure
      const fetchApartmentDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/v1/apartments/${vehicle.apartmentId}`);
          const apartmentData = response.data.data;
          setSelectedApartment({
            addressNumber: apartmentData.addressNumber,
            area: apartmentData.area,
            status: apartmentData.status,
          });
        } catch (error) {
          console.error("Error fetching apartment details:", error);
        }
      };
      fetchApartmentDetails();
    }
  }, [vehicle?.apartment, vehicle?.apartmentId, selectedApartment]);
  const handleDelete = async (e: any) => {
    e.preventDefault();

    try {
      // Use apartmentId from formValues (which is set from apartment.addressNumber or direct apartmentId)
      console.log("Deleting vehicle with apartmentId:", formValues.apartmentId);
      const response = await axios.delete(`http://localhost:8080/api/v1/vehicles/${formValues.apartmentId}`, {
        data: { id: formValues.id }, // Payload gửi kèm
        headers: { "Content-Type": "application/json" },
      });
      
      // console.log(response.data);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      toast.success("Delete vehicle successfull!");
    } catch (error) {
      toast.error("Có lỗi xảy ra");
      // console.log(error);
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    console.log("handleSubmit được gọi!");
    console.log("Form values:", formValues);

    // Kiểm tra validation
    if (!formValues.apartmentId) {
      toast.error("Vui lòng chọn phòng!");
      return;
    }
    if (!formValues.id) {
      toast.error("Vui lòng nhập số xe!");
      return;
    }
    if (!formValues.category) {
      toast.error("Vui lòng chọn loại xe!");
      return;
    }

    const vehicleData = {
      apartmentId: formValues.apartmentId,
      id: formValues.id,
      category: formValues.category
    };

    console.log("Sending vehicle data:", vehicleData);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/vehicles", 
        vehicleData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      console.log("Response:", response.data);
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      toast.success("Add vehicle successfull");
    } catch (error: any) {
      console.error("Error details:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      toast.error(`Có lỗi xảy ra: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Form width="400px" onSubmit={handleSubmit}>      
    <Form.Fields>
        <FormField>
          <FormField.Label label={"Room"} />
          <ApartmentSearchDropdown
            value={selectedApartment?.addressNumber?.toString() || formValues.apartmentId}
            onChange={handleApartmentSelect}
            placeholder="Search apartment by room number..."
          />
        </FormField>

        {/* <FormField>
          <FormField.Label label={"Date"} />
          <FormField.Input
            id="ownerName"
            type="text"
            value={formValues.registerDate}
            onChange={handleChange}
          />
        </FormField> */}

        <FormField>
          <FormField.Label label={"Number"} />
          <FormField.Input
            id="id"
            type="text"
            value={formValues.id}
            onChange={handleChange}
          />
        </FormField>
      </Form.Fields>

      <Selector
        value={formValues.category}
        onChange={handleChange}
        id="category"
        options={vehicleTypeOptions}
        label={"Type:"}
      ></Selector>

      {vehicle ? (
        <Form.Buttons>
          <Button variation="danger" size="medium" onClick={handleDelete}>
            Delete
            <span>
              <HiTrash />
            </span>
          </Button>
          {/* <Button variation="secondary" size="medium">
            Update
            <span>
              <HiPencil />
            </span>
          </Button> */}
        </Form.Buttons>
      ) : (        
      <Form.Buttons>
          <Button type="submit" size="medium" variation="primary">
            Add
            <span>
              <HiOutlinePlusCircle />
            </span>
          </Button>
        </Form.Buttons>
      )}
    </Form>
  );
}
