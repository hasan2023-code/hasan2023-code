// Dummy API call that simulates fetching data from a server.
// In a real app, you would replace this with fetch/axios.

export function fetchEmployees() {
  const dummyEmployees = [
    { empId: 101, empName: "John Doe", address: "New York" },
    { empId: 102, empName: "Jane Smith", address: "San Francisco" },
    { empId: 103, empName: "Michael Johnson", address: "Chicago" },
    { empId: 104, empName: "Emily Davis", address: "Seattle" },
    { empId: 105, empName: "David Wilson", address: "Los Angeles" }
  ];

  return new Promise((resolve) => {
    setTimeout(() => resolve(dummyEmployees), 800);
  });
}

