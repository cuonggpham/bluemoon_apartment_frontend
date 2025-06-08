import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Button from '../../components/Button';
import { userApi, roleApi, UserResponse, Role } from '../../services/userApi';

const FormContainer = styled.div`
  padding: 2.4rem;
  background-color: var(--color-grey-0);
  min-width: 40rem;
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-grey-800);
  margin-bottom: 1.6rem;
`;

const UserInfo = styled.div`
  background-color: var(--color-grey-50);
  padding: 1.6rem;
  border-radius: 0.8rem;
  margin-bottom: 2.4rem;
`;

const UserName = styled.h3`
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--color-grey-800);
  margin-bottom: 0.4rem;
`;

const UserEmail = styled.p`
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const RolesSection = styled.div`
  margin-bottom: 2.4rem;
`;

const SectionTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--color-grey-800);
  margin-bottom: 1.2rem;
`;

const RolesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const RoleItem = styled.label`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
  border: 1px solid var(--color-grey-200);
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-50);
    border-color: var(--color-blue-300);
  }

  &.selected {
    background-color: var(--color-blue-50);
    border-color: var(--color-blue-400);
  }
`;

const Checkbox = styled.input`
  width: 1.8rem;
  height: 1.8rem;
  cursor: pointer;
`;

const RoleInfo = styled.div`
  flex: 1;
`;

const RoleName = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--color-grey-800);
  margin-bottom: 0.4rem;
`;

const RoleDescription = styled.div`
  font-size: 1.3rem;
  color: var(--color-grey-600);
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
  margin-top: 2.4rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--color-grey-600);
`;

interface UserRoleFormProps {
  user: UserResponse;
  onSuccess?: () => void;
  onCloseModal?: () => void;
}

const UserRoleForm: React.FC<UserRoleFormProps> = ({ user, onSuccess, onCloseModal }) => {
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all available roles
        const roles = await roleApi.getAll();
        setAvailableRoles(roles);

        // Set currently selected roles
        const currentRoleIds = user.roles?.map(role => role.id) || [];
        setSelectedRoleIds(currentRoleIds);
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error('Failed to fetch roles');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoleIds(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(id => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await userApi.assignRolesToUser(user.id, selectedRoleIds);
      toast.success('User roles updated successfully');
      onSuccess?.();
      onCloseModal?.();
    } catch (error: any) {
      console.error('Error updating user roles:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update user roles';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleDisplayName = (roleName: string): string => {
    switch (roleName) {
      case 'ROLE_MANAGER':
        return 'Manager';
      case 'ROLE_ACCOUNTANT':
        return 'Accountant';
      default:
        return roleName.replace('ROLE_', '');
    }
  };

  const getRoleDisplayDescription = (roleName: string, description: string): string => {
    if (description) return description;
    
    switch (roleName) {
      case 'ROLE_MANAGER':
        return 'Full access to all features including user management, residents, and apartments';
      case 'ROLE_ACCOUNTANT':
        return 'Access to financial features including fees, payments, and utility bills';
      default:
        return 'Custom role with specific permissions';
    }
  };

  if (loading) {
    return (
      <FormContainer>
        <LoadingMessage>Loading roles...</LoadingMessage>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <FormTitle>Manage User Roles</FormTitle>
      
      <UserInfo>
        <UserName>{user.name}</UserName>
        <UserEmail>{user.email}</UserEmail>
      </UserInfo>

      <form onSubmit={handleSubmit}>
        <RolesSection>
          <SectionTitle>Available Roles</SectionTitle>
          <RolesList>
            {availableRoles.map((role) => (
              <RoleItem
                key={role.id}
                className={selectedRoleIds.includes(role.id) ? 'selected' : ''}
              >
                <Checkbox
                  type="checkbox"
                  checked={selectedRoleIds.includes(role.id)}
                  onChange={() => handleRoleToggle(role.id)}
                  disabled={isSubmitting}
                />
                <RoleInfo>
                  <RoleName>{getRoleDisplayName(role.name)}</RoleName>
                  <RoleDescription>
                    {getRoleDisplayDescription(role.name, role.description)}
                  </RoleDescription>
                </RoleInfo>
              </RoleItem>
            ))}
          </RolesList>
        </RolesSection>

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
            {isSubmitting ? 'Updating...' : 'Update Roles'}
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default UserRoleForm; 