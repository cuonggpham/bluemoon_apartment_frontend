import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { HiPencil, HiTrash, HiUserPlus, HiShieldCheck } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import ConfirmDelete from '../../components/ConfirmDelete';
import { userApi, UserResponse, Role } from '../../services/userApi';
import UserForm from './UserForm';
import UserRoleForm from './UserRoleForm';

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.6rem;
`;

const TableTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--color-grey-800);
`;

const AddUserButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.8rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0.6rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  &.edit {
    color: var(--color-blue-600);
    &:hover {
      background-color: var(--color-blue-100);
    }
  }

  &.delete {
    color: var(--color-red-600);
    &:hover {
      background-color: var(--color-red-100);
    }
  }

  &.roles {
    color: var(--color-green-600);
    &:hover {
      background-color: var(--color-green-100);
    }
  }
`;

const StatusBadge = styled.span<{ isActive: boolean }>`
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  background-color: ${props => props.isActive ? 'var(--color-green-100)' : 'var(--color-red-100)'};
  color: ${props => props.isActive ? 'var(--color-green-700)' : 'var(--color-red-700)'};
`;

const RolesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const RoleBadge = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 0.8rem;
  font-size: 1.1rem;
  font-weight: 500;
  background-color: var(--color-blue-100);
  color: var(--color-blue-700);
`;

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Starting to fetch users...');
      const data = await userApi.getAll();
      console.log('Received user data:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      console.log('Data length:', data?.length);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    try {
      await userApi.delete(userId);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
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

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (!users || users.length === 0) {
    return (
      <>
        <TableHeader>
          <TableTitle>User Management</TableTitle>
          <Modal>
            <Modal.Open id="add-user">
              <AddUserButton variation="primary" size="medium">
                <HiUserPlus />
                Add New User
              </AddUserButton>
            </Modal.Open>
            <Modal.Window id="add-user" name="Add New User">
              <UserForm onSuccess={fetchUsers} />
            </Modal.Window>
          </Modal>
        </TableHeader>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-grey-500)' }}>
          No users found. {users ? `Users array length: ${users.length}` : 'Users data is null/undefined'}
        </div>
      </>
    );
  }

  return (
    <>
      <TableHeader>
        <TableTitle>User Management</TableTitle>
        <Modal>
          <Modal.Open id="add-user">
            <AddUserButton variation="primary" size="medium">
              <HiUserPlus />
              Add New User
            </AddUserButton>
          </Modal.Open>
          <Modal.Window id="add-user" name="Add New User">
            <UserForm onSuccess={fetchUsers} />
          </Modal.Window>
        </Modal>
      </TableHeader>

      <Table columns="1fr 2fr 2fr 1.5fr 1fr 1.5fr">
        <Table.Header>
          <div>ID</div>
          <div>Name</div>
          <div>Email</div>
          <div>Roles</div>
          <div>Status</div>
          <div>Actions</div>
        </Table.Header>

        <Table.Body
          data={users}
          render={(user: UserResponse) => (
            <Table.Row key={user.id}>
              <div>{user.id}</div>
              <div>{user.name}</div>
              <div>{user.email}</div>
              <div>
                <RolesList>
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role: Role) => (
                      <RoleBadge key={role.id}>
                        {getRoleDisplayName(role.name)}
                      </RoleBadge>
                    ))
                  ) : (
                    <span style={{ color: 'var(--color-grey-500)', fontStyle: 'italic' }}>No roles assigned</span>
                  )}
                </RolesList>
              </div>
              <div>
                <StatusBadge isActive={(user.isActive ?? 1) === 1}>
                  {(user.isActive ?? 1) === 1 ? 'Active' : 'Inactive'}
                </StatusBadge>
              </div>
              <div>
                <ActionButtons>
                  <Modal>
                    <Modal.Open id={`edit-user-${user.id}`}>
                      <ActionButton className="edit" title="Edit User">
                        <HiPencil size={16} />
                      </ActionButton>
                    </Modal.Open>
                    <Modal.Window id={`edit-user-${user.id}`} name="Edit User">
                      <UserForm user={user} onSuccess={fetchUsers} />
                    </Modal.Window>
                  </Modal>

                  <Modal>
                    <Modal.Open id={`manage-roles-${user.id}`}>
                      <ActionButton className="roles" title="Manage Roles">
                        <HiShieldCheck size={16} />
                      </ActionButton>
                    </Modal.Open>
                    <Modal.Window id={`manage-roles-${user.id}`} name="Manage User Roles">
                      <UserRoleForm user={user} onSuccess={fetchUsers} />
                    </Modal.Window>
                  </Modal>

                  <Modal>
                    <Modal.Open id={`delete-user-${user.id}`}>
                      <ActionButton className="delete" title="Delete User">
                        <HiTrash size={16} />
                      </ActionButton>
                    </Modal.Open>
                    <Modal.Window id={`delete-user-${user.id}`} name="Delete User">
                      <ConfirmDelete
                        resourceName="user"
                        onConfirm={() => handleDeleteUser(user.id)}
                        disabled={false}
                      />
                    </Modal.Window>
                  </Modal>
                </ActionButtons>
              </div>
            </Table.Row>
          )}
        />
      </Table>
    </>
  );
};

export default UserTable; 