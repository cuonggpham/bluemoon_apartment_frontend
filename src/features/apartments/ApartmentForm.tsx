import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Selector from "../../components/Selector";
import Button from "../../components/Button";
import { HiOutlinePlusCircle, HiPencil} from "react-icons/hi2";
import Table from "../../components/Table";
import ResidentSearchDropdown from "../../components/ResidentSearchDropdown";
import axios from "axios";
import { toast } from "react-toastify";
import "./ApartmentForm.css";

interface Resident {
  id: number;
  name: string;
  status: string;
  gender: string;
  cic: string;
}

interface OwnerResident {
  id: number;
  name: string;
  dob?: string;
}

interface Vehicle {
  id: number;
  category: string;
}

interface ApartmentFormProps {
  apartment?: {
    addressNumber: string;
    status: "Business" | "Residential" | "Vacant" | "";
    area: string;
    ownerName: string;
    ownerPhone: string;
    owner: { id: number; name: string };
    residents: Resident[]; 
    vehicleList: Vehicle[];
  };
  fetchApartments: () => void; // A function to refresh the apartment list after adding a new apartment
}

export default function ApartmentForm({
  apartment,
  fetchApartments,
}: ApartmentFormProps) {  
  const [formValues, setFormValues] = useState({
    addressNumber: apartment?.addressNumber || "",
    status: apartment?.status || "",
    area: apartment?.area || "",
    ownerName: apartment?.owner?.name || "",
    ownerPhone: apartment?.ownerPhone || "",
    ownerId: apartment?.owner?.id || "",
  });

  // Add validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [selectedOwner, setSelectedOwner] = useState<OwnerResident | null>(
    apartment?.owner ? { 
      id: apartment.owner.id, 
      name: apartment.owner.name 
    } : null
  );

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formValues.addressNumber.trim()) {
      newErrors.addressNumber = "Room number is required";
    }
    
    if (!formValues.area.trim()) {
      newErrors.area = "Room area is required";
    } else if (isNaN(Number(formValues.area)) || Number(formValues.area) <= 0) {
      newErrors.area = "Area must be a positive number";
    }
    
    if (!formValues.status.trim()) {
      newErrors.status = "Status is required";
    }

    if (formValues.ownerPhone && !/^\d{10,11}$/.test(formValues.ownerPhone)) {
      newErrors.ownerPhone = "Phone number must be 10-11 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));
    }
  };
  const handleOwnerSelect = (owner: OwnerResident | null) => {
    setSelectedOwner(owner);
    setFormValues((prevValues) => ({
      ...prevValues,
      ownerId: owner?.id || "",
      ownerName: owner?.name || "",
    }));
  };  const handleUpdate = async (e: any) => {
    e.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) {
      toast.warning("Vui lòng điền đầy đủ thông tin hợp lệ");
      return;
    }

    try {      const data = {
        area: formValues.area,
        status: formValues.status,
        ownerId: formValues.ownerId || null,
        ownerPhone: formValues.ownerPhone,
      };

      await axios.put(
        `http://localhost:8080/api/v1/apartments/${formValues.addressNumber}`,
        data
      );

      setTimeout(() => {
        window.location.reload();
      }, 1500);

      toast.success("Update Sucessfull");
    } catch (err) {
      toast.error(`Có lỗi xảy ra`);
    }
  };  
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validate that owner is selected if we want to require it
    if (!formValues.ownerId) {
      toast.warning("Vui lòng chọn chủ hộ hoặc để trống nếu chưa có chủ hộ");
    }

    // Validate the form before submitting
    if (!validateForm()) {
      toast.warning("Vui lòng điền đầy đủ thông tin hợp lệ");
      return;
    }

    const apartmentData = {
      addressNumber: formValues.addressNumber,
      area: formValues.area,
      status: formValues.status,
      ownerId: formValues.ownerId || null,
      ownerPhone: formValues.ownerPhone,
    };

    try {
      await axios.post(
        "http://localhost:8080/api/v1/apartments",
        apartmentData
      );

      toast.success("Add Apartment Successful");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      fetchApartments();
      
      setFormValues({
        addressNumber: "",
        status: "",
        area: "",
        ownerName: "",
        ownerId: "",
        ownerPhone: "",
      });
      setSelectedOwner(null);
    } catch (error) {
      // toast.error(`Có lỗi xảy ra`);
      console.error(error);
    }
  };

  const statusOptions = ["Business", "Residential"];

  // API xoá căn hộ (delete)

  // const handleDelete = async (e: any) => {
  //   e.preventDefault();

  //   try {
  //     const response = await axios.delete(``)
  //   } catch (err) {
  //     toast.error("Có lỗi xảy ra");
  //   }

  // }

  return (
    <Form width="800px">
      <label>Room:</label>      
      <Form.Fields type="horizontal">
        <FormField>
          <FormField.Label label="Room" required />
          <FormField.Input
            id="addressNumber"
            type="text"
            value={formValues.addressNumber}
            onChange={handleChange}
            required
            error={errors.addressNumber}
          />
        </FormField>

        <FormField>
          <FormField.Label label="Room Area" required />
          <FormField.Input
            id="area"
            type="text"
            value={formValues.area}
            onChange={handleChange}
            required
            error={errors.area}
          />
        </FormField>
      </Form.Fields>      
      <Selector
        id="status"
        value={formValues.status}
        onChange={handleChange}
        options={statusOptions}
        label="Status"
        required
        error={errors.status}
      /><label>Chủ hộ (tuỳ chọn):</label>
      <Form.Fields type="horizontal">
        <FormField>
          <FormField.Label label="Chủ hộ" />          
          <ResidentSearchDropdown
            value={selectedOwner?.name || ""}
            onChange={handleOwnerSelect}
            placeholder="Click để chọn chủ hộ..."
          />
        </FormField>        
        <FormField>
          <FormField.Label label="Số điện thoại:" />
          <FormField.Input
            id="ownerPhone"
            type="text"
            value={formValues.ownerPhone}
            onChange={handleChange}
            error={errors.ownerPhone}
          />        
          </FormField>
        </Form.Fields>

      {/* Resident List Section - Only show for existing apartment details */}
      {apartment?.residents && (
        <>
          <label>Residents:</label>
          <Table columns="1fr 1fr 1fr 1fr">
            <Table.Header size="small">
              <div>ID</div>
              <div>Name</div>
              <div>Status</div>
              <div>Gender</div>
            </Table.Header>
            {apartment.residents.length > 0 ? (
              apartment.residents.map((resident) => (
                <Table.Row size="small" key={resident.id}>
                  <div>{resident.id}</div>
                  <div>{resident.name}</div>
                  <div>{resident.status}</div>
                  <div>{resident.gender}</div>
                </Table.Row>
              ))            ) : (
              <Table.Row size="small">
                <div className="no-residents-message">
                  No residents assigned to this apartment
                </div>
              </Table.Row>
            )}
          </Table>
        </>
      )}

      {apartment?.vehicleList && (
        <>
          <label>Vehicle:</label>
          <Table columns="1fr 1fr">
            <Table.Header size="small">
              <div>Number</div>
              <div>Type</div>
            </Table.Header>
            {apartment.vehicleList.map((vehicle) => (
              <Table.Row size="small">
                <div>{vehicle.id}</div>
                <div>{vehicle.category}</div>
              </Table.Row>
            ))}
          </Table>
        </>
      )}

      {/* Action Buttons */}
      {apartment ? (
        <Form.Buttons>
          {/* <Button type="button" variation="danger" size="medium">
            Delete
            <span>
              <HiTrash />
            </span>
          </Button> */}
          <Button
            onClick={handleUpdate}
            type="button"
            variation="secondary"
            size="medium"
          >
            Update
            <span>
              <HiPencil />
            </span>
          </Button>
        </Form.Buttons>
      ) : (
        <Form.Buttons>
          <Button
            type="button"
            onClick={handleSubmit}
            size="medium"
            variation="primary"
          >
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
