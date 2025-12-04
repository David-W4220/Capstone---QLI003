import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EquipmentUpdateModal from '../modals/EquipmentUpdateModal';

const equipmentList = [
  { ID: 1, Name: 'Widget A', Description: 'Old desc', Item_Cnt: 5 },
  { ID: 2, Name: 'Widget B', Description: '', Item_Cnt: 2 }
];

describe('EquipmentUpdateModal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('requires selecting equipment and validates description before update', async () => {
    const fetchEquipment = jest.fn();

    render(<EquipmentUpdateModal equipment={equipmentList} fetchEquipment={fetchEquipment} API_URL="http://localhost:5097/api/Equipment" />);

    // Open modal by clicking the button
    const openBtn = screen.getByRole('button', { name: /Update Equipment/i });
    await userEvent.click(openBtn);

    // Select element should be present
    const select = screen.getByLabelText(/Select Equipment/i);
    expect(select).toBeInTheDocument();

  // Update button should be disabled until selection and valid description
  // There are two "Update" buttons in the page (the opener and the submit).
  // Query all and pick the one that is the form submit (type="submit").
  const updateBtns = screen.getAllByRole('button', { name: /Update/i });
  const updateBtn = updateBtns.find(b => b.getAttribute('type') === 'submit');
  expect(updateBtn).toBeDisabled();

    // Choose equipment
    await userEvent.selectOptions(select, '1');
    expect(select).toHaveValue('1');

    // Description textarea should now be enabled
    const textarea = screen.getByPlaceholderText(/Enter equipment description/i);
    expect(textarea).not.toBeDisabled();

  // Enter invalid short description
  await userEvent.clear(textarea);
  await userEvent.type(textarea, 'ab');
  // Component validates on submit; click the submit button and assert
  // validation message appears and no network call is made.
  await userEvent.click(updateBtn);
  expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();

    // Enter valid description
    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'A new description');

  // Mock fetch for PUT
  global.fetch.mockResolvedValueOnce({ ok: true });

  // Submit with valid description
  await userEvent.click(updateBtn);

  // Wait for fetchEquipment to be called (component calls it on success)
  await waitFor(() => expect(fetchEquipment).toHaveBeenCalled());
  });
});
