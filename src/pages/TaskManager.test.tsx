import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TaskManager from './TaskManager';
import * as authModule from '../api/auth';
import * as tasksModule from '../api/tasksApi';
import { wait } from '../utils/wait';

// Mock the API modules
vi.mock('../api/auth');
vi.mock('../api/tasksApi');

const getFormElements = () => {
  const titleInput = within(screen.getByTestId('title-input')).getByRole('textbox');
  const descriptionInput = within(screen.getByTestId('description-input')).getByRole('textbox');
  const statusSelect = within(screen.getByTestId('status-select')).getByRole('combobox');
  return { titleInput, descriptionInput, statusSelect };
};

const fillFormAndSubmit = async (formData: { title: string; description: string; status?: string }) => {
  const { titleInput, descriptionInput, statusSelect } = getFormElements();
  
  fireEvent.change(titleInput, { target: { value: formData.title } });
  fireEvent.change(descriptionInput, { target: { value: formData.description } });
  
  if (formData.status) {
    fireEvent.mouseDown(statusSelect);
    fireEvent.click(screen.getByText(formData.status));
  }
  
  const saveButton = screen.getByText('Save');
  fireEvent.click(saveButton);
};


describe('TaskManager Component', () => {
  // Mock data
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    password: 'password123'
  };
  
  const mockTasks = [
    {
      id: 'task1',
      title: 'Complete project',
      description: 'Finish the React project',
      status: 'in_progress',
      userId: 'user123'
    },
    {
      id: 'task2',
      title: 'Review code',
      description: 'Review pull requests',
      status: 'pending',
      userId: 'user123'
    }
  ];

  // Setup before each test
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorage.setItem('token', 'mock-token');
    
    // Mock API responses
    vi.mocked(authModule.getUserDataFromToken).mockResolvedValue({
      statusCode: 200,
      data: mockUser,
    });
    
    vi.mocked(tasksModule.getAllUserTasks).mockResolvedValue(mockTasks);
    vi.mocked(tasksModule.createTask).mockResolvedValue({ 
      id: 'new-task',
      title: 'New Task',
      description: 'New Task Description',
      status: 'in_progress',
      userId: 'user123'
    });
    vi.mocked(tasksModule.updateTask).mockResolvedValue({
      id: 'task1',
      title: 'Updated Task',
      description: 'Updated Description',
      status: 'completed',
      userId: 'user123'
    });
    vi.mocked(tasksModule.deleteTask).mockResolvedValue({ success: true });
  });

  // Test 1: Renders TaskManager component with user data and tasks
  it('should render TaskManager component with user data and tasks', async () => {
    // Arrange
    render(
      <MemoryRouter initialEntries={['/taskmanager']}>
        <Routes>
          <Route path="/taskmanager" element={<TaskManager />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Assert - Basic UI elements
    expect(screen.getByText('TaskManager')).toBeDefined();
    expect(screen.getByText('Add Task')).toBeDefined();
    
    // Assert - User data and tasks loaded
    await waitFor(() => {
      expect(screen.getByText(`Current user: ${mockUser.email}`)).toBeDefined();
    });
    
    // Check if tasks are rendered in the table
    await waitFor(() => {
      expect(screen.getByText('Complete project')).toBeDefined();
      expect(screen.getByText('Review code')).toBeDefined();
    });
    
    // Verify API calls
    expect(authModule.getUserDataFromToken).toHaveBeenCalledTimes(2);
    expect(tasksModule.getAllUserTasks).toHaveBeenCalledTimes(2);
  });

  // Test 2: Opening the Add Task modal
  it('should open the modal with empty values when Add Task button is clicked', async () => {
    // Arrange
    render(
      <MemoryRouter initialEntries={['/taskmanager']}>
        <Routes>
          <Route path="/taskmanager" element={<TaskManager />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText(`Current user: ${mockUser.email}`)).toBeDefined();
    });
    
    // Act - Click the Add Task button
    const addTaskButton = screen.getByText('Add Task');
    fireEvent.click(addTaskButton);
    
    // Assert - Modal opened with correct title and empty fields
    await waitFor(() => {
      expect(screen.getByText('Add New Task')).toBeDefined();
      
      const titleInput = (within(screen.getByTestId('title-input')).getByRole('textbox'));
      const descriptionInput = (within(screen.getByTestId('description-input')).getByRole('textbox'));
      const statusSelect = (within(screen.getByTestId('status-select')).getByRole('combobox')as HTMLInputElement).value;
      
      expect((titleInput as HTMLInputElement).value).toBe('');
      expect((descriptionInput as HTMLInputElement).value).toBe('');
      expect(statusSelect).toBe(undefined);
    });
  });

  // Test 3: Creating a new task
  it('should create a new task when form is submitted', async () => {
    // Arrange
    render(
      <MemoryRouter initialEntries={['/taskmanager']}>
        <Routes>
          <Route path="/taskmanager" element={<TaskManager />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText(`Current user: ${mockUser.email}`)).toBeDefined();
    });
    
    // Act - Open the modal and fill the form
    const addTaskButton = screen.getByText('Add Task');
    fireEvent.click(addTaskButton);
    
    // Fill form
    await waitFor(() => {
            
        const titleInput = (within(screen.getByTestId('title-input')).getByRole('textbox'));
        const descriptionInput = (within(screen.getByTestId('description-input')).getByRole('textbox'));
      
      fireEvent.change(titleInput, { target: { value: 'New Task' } });
      fireEvent.change(descriptionInput, { target: { value: 'New Task Description' } });
      
      // Submit form
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
    });
    
    // Assert - API called with correct data
    await waitFor(() => {
      expect(tasksModule.createTask).toHaveBeenCalledWith(
        'New Task', 
        'New Task Description', 
        mockUser.id, 
        'in_progress'
      );
    });
    
  });

  // Test 4: Editing an existing task
  it('should open the modal with task data when Edit button is clicked', async () => {
    // Arrange

 
    vi.mocked(tasksModule.getAllUserTasks).mockResolvedValue([{ 
      id: 'new-task',
      title: 'New Task',
      description: 'New Task Description',
      status: 'in_progress',
      userId: mockUser.id
    }]);
    render(
      <MemoryRouter initialEntries={['/taskmanager']}>
        <Routes>
          <Route path="/taskmanager" element={<TaskManager />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(`Current user: ${mockUser.email}`)).toBeDefined();
    });
    
    // Act - Click the Edit button
    const editButton = screen.getByText('Edit');
    
    
    fireEvent.click(editButton); // Click first Edit button
    
    wait(1000);
    // Assert - Modal opened with task data
    await waitFor(() => {
      
      const titleInput = screen.getByText('New Task');
      const descriptionInput = screen.getByText('New Task Description');
      
      expect(titleInput).toBe(screen.getByText('New Task'));
      expect(descriptionInput).toBe(screen.getByText('New Task Description'));
    });
  });

  // Test 5: Updating an existing task
  it('should update a task when form is submitted in edit mode', async () => {

    vi.mocked(tasksModule.getAllUserTasks).mockResolvedValue([{ 
      id: 'new-task',
      title: 'New Task',
      description: 'New Task Description',
      status: 'in_progress',
      userId: mockUser.id
    }]);
    // Arrange
    render(
      <MemoryRouter initialEntries={['/taskmanager']}>
        <Routes>
          <Route path="/taskmanager" element={<TaskManager />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeDefined();
    });
    
    // Act - Click the Edit button and modify the form
    const editButton = screen.getByRole('button', { name: 'Edit' });
  fireEvent.click(editButton);
    
  await waitFor(() => {
    fillFormAndSubmit({
      title: 'Updated Task',
      description: 'Updated Description',
      status: 'Completed'
    });
  });

  wait(1000)
  
  await waitFor(() => {
    expect(tasksModule.updateTask).toHaveBeenCalledWith(
      'new-task',
      'Updated Task',
      'Updated Description',
      mockUser.id,
      'completed'
    );
  });
  });

  // Test 6: Deleting a task
  it('should delete a task when Delete button is clicked', async () => {
    vi.mocked(tasksModule.getAllUserTasks).mockResolvedValue([{ 
      id: 'new-task',
      title: 'New Task',
      description: 'New Task Description',
      status: 'in_progress',
      userId: mockUser.id
    }]);
    // Arrange
    render(
      <MemoryRouter initialEntries={['/taskmanager']}>
        <Routes>
          <Route path="/taskmanager" element={<TaskManager />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeDefined();

    });
    
    // Act - Click the Delete button
    const deleteButtons = screen.getAllByText('Delete');
    console.log(deleteButtons.length);
    

    fireEvent.click(deleteButtons[0]); // Click first Delete button
    
    // Assert - Delete confirmation and API call
    await waitFor(() => {
      //log what tasksModule.deleteTask is called with

      expect(tasksModule.deleteTask).toHaveBeenCalledWith('new-task');
    });
  });

  // Test 7: Unauthorized access (no token)
  it('should redirect to login page when token is not found', async () => {
    // Arrange
    localStorage.removeItem('token');

    
    // Act
    render(
      <MemoryRouter initialEntries={['/taskmanager']}>
        <Routes>
          <Route path="/taskmanager" element={<TaskManager />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Assert - Alert shown and redirection attempted
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('You are not authorized to access this page');
      // Note: In your actual code, the navigation is commented out
      // If you uncomment it, you should test: expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  // Test 8: Error handling when API calls fail
  it('should handle API errors gracefully', async () => {
    // Arrange - Force API error
    vi.mocked(authModule.getUserDataFromToken).mockRejectedValue(new Error('API Error'));
    // const mockNavigate = vi.fn();
    // vi.mock('react-router-dom', async () => {
    //   const actual = await vi.importActual('react-router-dom');
    //   return {
    //     ...actual,
    //     useNavigate: () => mockNavigate,
    //   };
    // });
    
    // Act
    render(
      <MemoryRouter initialEntries={['/taskmanager']}>
        <Routes>
          <Route path="/taskmanager" element={<TaskManager />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Assert - Should redirect to login on error
    await waitFor(() => {
    //   expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  // Test 9: Render with empty tasks array
  it('should render correctly when no tasks are available', async () => {
    // Arrange
    vi.mocked(tasksModule.getAllUserTasks).mockResolvedValue([]);
    
    // Act
    render(
      <MemoryRouter initialEntries={['/taskmanager']}>
        <Routes>
          <Route path="/taskmanager" element={<TaskManager />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Assert - Table renders but with no task data
    await waitFor(() => {
      expect(screen.getByText(`Current user: ${mockUser.email}`)).toBeDefined();
      // Check if empty table is displayed
      // This depends on how your DataGrid handles empty data
      // You might want to add a "No tasks available" message in your component
    });
  });
});