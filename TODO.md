# Project Error Correction Plan

## Information Gathered:
- Missing API service file causing import errors in multiple components
- Port mismatch: frontend connects to 5001, backend runs on 5000
- Missing routes in App.jsx for /add-vehicle and /vehicle-list
- Inconsistent API usage patterns across components
- Login navigation redirects to undefined route

## Plan: Detailed Code Update Steps

### 1. Create Missing API Service
- Create `/src/services/api.js` with proper HTTP client configuration
- Handle token authentication from localStorage
- Consistent base URL configuration

### 2. Fix Port Configuration
- Update server to run on port 5001 to match frontend expectations
- OR update frontend to connect to port 5000 (current backend config)

### 3. Update App.jsx Routes
- Add /add-vehicle route pointing to AddVehicle component
- Add /vehicle-list route pointing to VehicleList component
- Update login redirect destination

### 4. Standardize API Usage
- Update all components to use the api service
- Remove direct fetch calls where api service should be used
- Fix authentication headers implementation

### 5. Component Updates
- Vehicles.jsx: Fix api import and usage
- VehicleForm.jsx: Update to use api service consistently
- VehicleCard.jsx: Fix api import and usage
- VehicleList.jsx: Fix api import and usage

### 6. Test and Validate
- Test login functionality
- Test vehicle CRUD operations
- Verify navigation between pages

## Dependent Files to be Edited:
1. `/src/services/api.js` (new file)
2. `/src/App.jsx`
3. `/src/pages/Vehicles.jsx`
4. `/src/components/VehicleForm.jsx`
5. `/src/components/VehicleCard.jsx`
6. `/src/pages/VehicleList.jsx`
7. `/server/server.js` (if port change needed)

## Follow-up Steps:
- Test the application by starting both frontend and backend
- Verify login and vehicle management functionality
- Check browser console for any remaining errors
