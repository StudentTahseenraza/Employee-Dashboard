// services/api.js
import axios from 'axios';

const API_URL = 'https://backend.jotish.in/backend_dev/gettabledata.php';

export const fetchEmployees = async () => {
  try {
    const response = await axios.post(API_URL, {
      username: "test",
      password: "123456"
    });
    
    console.log('Raw API Response:', response.data);
    
    let employees = [];
    
    // Handle the specific response structure: { TABLE_DATA: { data: [...] } }
    if (response.data && response.data.TABLE_DATA && response.data.TABLE_DATA.data) {
      // Access the nested data array
      const rawData = response.data.TABLE_DATA.data;
      console.log('Raw data array (first item):', rawData[0]);
      
      // Transform each array into an object with proper keys based on the actual data structure
      employees = rawData.map((item, index) => {
        // Make sure item is an array
        if (!Array.isArray(item)) return null;
        
        // Parse salary: remove $ and commas, convert to number
        const salaryStr = item[5] || '$0';
        const salary = parseFloat(salaryStr.replace(/[$,]/g, '')) || 0;
        
        return {
          id: index + 1, // Generate an ID since the original doesn't have one
          name: item[0] || 'Unknown',
          position: item[1] || 'N/A',
          department: item[1] || 'N/A', // Using position as department
          city: item[2] || 'N/A',
          code: item[3] || 'N/A',
          startDate: item[4] || 'N/A',
          salary: salary,
          // For email and phone, we don't have them in the data, so generate placeholders
          email: `${(item[0] || 'employee').toLowerCase().replace(/\s+/g, '.')}@company.com`,
          phone: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        };
      }).filter(emp => emp !== null); // Remove any null entries
      
      console.log('Transformed employees:', employees);
      console.log('First transformed employee:', employees[0]);
    }
    
    return employees;
    
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};