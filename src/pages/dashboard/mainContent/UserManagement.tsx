import React from 'react';
import styled from 'styled-components';
import UserTable from '../../../features/user-management/UserTable';

const Container = styled.div`
  padding: 2.4rem;
  background-color: var(--color-grey-0);
  min-height: 100vh;
`;

const PageHeader = styled.div`
  margin-bottom: 3.2rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 600;
  color: var(--color-grey-800);
  margin-bottom: 0.8rem;
`;

const PageDescription = styled.p`
  font-size: 1.6rem;
  color: var(--color-grey-600);
  line-height: 1.5;
`;

const UserManagement: React.FC = () => {
  return (
    <Container>
      <PageHeader>
        <PageTitle>User Management</PageTitle>
        <PageDescription>
          Manage system users, assign roles, and control access permissions. 
          Only managers can access this section.
        </PageDescription>
      </PageHeader>
      
      <UserTable />
    </Container>
  );
};

export default UserManagement; 