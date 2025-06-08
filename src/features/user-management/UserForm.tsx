import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Form from '../../components/Form';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import { userApi, UserResponse, UserCreateRequest } from '../../services/userApi';

const FormContainer = styled.div`
  padding: 2.4rem;
  background-color: var(--color-grey-0);
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-grey-800);
  margin-bottom: 2.4rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
  margin-top: 2.4rem;
`;

const ErrorMessage = styled.span`
  color: var(--color-red-700);
  font-size: 1.4rem;
`;

interface UserFormProps {
  user?: UserResponse;
  onSuccess?: () => void;
  onCloseModal?: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSuccess, onCloseModal }) => {
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!user;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (only for new users or when password is provided)
    if (!isEditing || formData.password) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));

    // Clear error when user starts typing
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        // Update existing user
        const updateData: Partial<UserResponse> = {
          name: formData.name,
          email: formData.email
        };

        await userApi.update(user.id, updateData);
        toast.success('User updated successfully');
      } else {
        // Create new user
        const createData: UserCreateRequest = {
          name: formData.name,
          username: formData.email,
          password: formData.password
        };

        await userApi.create(createData);
        toast.success('User created successfully');
      }

      onSuccess?.();
      onCloseModal?.();
    } catch (error: any) {
      console.error('Error saving user:', error);
      const errorMessage = error.response?.data?.message || 
                          (isEditing ? 'Failed to update user' : 'Failed to create user');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>{isEditing ? 'Edit User' : 'Add New User'}</FormTitle>
      
      <Form onSubmit={handleSubmit}>
        <FormField>
          <FormField.Label label="Full Name" required />
          <FormField.Input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
            disabled={isSubmitting}
            error={errors.name}
            required
          />
        </FormField>

        <FormField>
          <FormField.Label label="Email Address" required />
          <FormField.Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter email address"
            disabled={isSubmitting || isEditing} // Disable email editing for existing users
            error={errors.email}
            required
          />
        </FormField>

        <FormField>
          <FormField.Label 
            label={isEditing ? "New Password (leave blank to keep current)" : "Password"} 
            required={!isEditing}
          />
          <FormField.Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder={isEditing ? "Enter new password" : "Enter password"}
            disabled={isSubmitting}
            error={errors.password}
            required={!isEditing}
          />
        </FormField>

        <FormField>
          <FormField.Label label="Confirm Password" required={!isEditing} />
          <FormField.Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm password"
            disabled={isSubmitting}
            error={errors.confirmPassword}
            required={!isEditing}
          />
        </FormField>

        <ButtonGroup>
          <Button
            type="button"
            variation="secondary"
            onClick={onCloseModal}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variation="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')}
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default UserForm; 