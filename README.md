# **QLI003 \- OT Inventory Management System**

## **About the Application**

*(Note: Replace the image link above with your actual architecture diagram if available)*  
This application is an inventory tracking system designed for QLI's OT closet. It provides a real-time, user-based interface to manage equipment stock.  
**Key Features:**

* **Inventory Management:** Users can view available items, check them out, and check them back in.  
* **Real-Time Updates:** Uses **SignalR** to update inventory counts instantly across all connected devices without refreshing.  
* **Automated Reordering:** Recursively scans for low-stock items and emails a formatted repurchasing list with links to administrators.  
* **Reporting & Logging:** Generates comprehensive PDF reports of transaction history and audit logs.  
* **Admin Privileges:** Secure login for administrators to add, remove, or modify equipment details and configure system settings.

## **Getting Started**

### **Prerequisites**

* **Node.js**  
* **.NET 8.0 SDK** (C\# Dev Kit recommended for VS Code)  
* **MySQL Community Server** (MySQL Workbench optional)  
* **Papercut SMTP** (For testing email functionality locally)

### **Installation & Setup**

1. Install Frontend Dependencies:  
   Open a terminal in the client folder. This will automatically install all required packages (including cross-env for HTTPS support) based on the package.json file.  
   cd qli003-client  
   npm install

2. Trust HTTPS Development Certificates:  
   Required for the secure connection between React and .NET on local machines.  
   dotnet dev-certs https \--trust

3. Database Configuration:  
   Update the ConnectionStrings in qli003-api/appsettings.json with your local MySQL credentials:  
   "ConnectionStrings": {  
     "DefaultConnection": "server=localhost;database=qli\_db;user=root;password=your\_password;"  
   }

4. SMTP Configuration:  
   To test the mailing features, configure your SMTP settings in appsettings.json. For local testing with Papercut:  
   "SMTP": {  
     "Host": "localhost",  
     "Port": 25,  
     "Username": "",  
     "Password": ""  
   }

## **How to Run**

You can run the application using the provided quick-start scripts or manually via the terminal.

### **Quick Start (Recommended)**

These scripts launch both the API and the Client simultaneously.

* **Windows:** start-app-windows.bat  
* **Mac/Linux:** ./start-app-mac.command

### **Manual Start**

**1\. Start the Backend API:**  
cd qli003-api  
dotnet run

*Note: You can view the API endpoints via Swagger UI at https://localhost:7058/swagger/index.html.*  
**2\. Start the Frontend Client:**  
cd qli003-client  
npm start

## **Network Configuration (Changing IP & Ports)**

To allow other devices to access the application, or to resolve port conflicts, you may need to change the IP address or Port numbers.

### **1\. Changing the IP Address (Hosting on LAN)**

To host for other users on your Wi-Fi:

* **Find your IP:** Run ipconfig (Windows) or ifconfig (Mac/Linux) to get your IPv4 address (e.g., 192.168.1.15).  
* **Update Frontend:** In qli003-client/src/InventoryApp.jsx, change API\_BASE\_URL to https://192.168.1.15:7058.  
* **Run Backend:** Start the API with dotnet run \--urls "https://0.0.0.0:7058".

### **2\. Changing the Port Numbers**

If the default ports (**7058** for API, **3000** for Client) are busy or you prefer different ones, follow these steps:  
**A. Backend API Port:**

1. Open qli003-api/Properties/launchSettings.json.  
2. Find the https profile and change the applicationUrl.  
   "applicationUrl": "https://localhost:8000;http://localhost:5000",

3. **Update React:** You must also update the API\_BASE\_URL in InventoryApp.jsx to match this new port.  
4. **Update Swagger:** If you change the port (e.g., to **8000**), your Swagger UI address will also change. You will now access it at https://localhost:8000/swagger.

**B. Frontend Client Port:**

1. Open qli003-client/package.json.  
2. Update the start script to include the PORT variable.  
   "scripts": {  
     "start": "cross-env PORT=4000 HTTPS=true node node\_modules/react-scripts/bin/react-scripts.js start"  
   }

   *(This example switches React to port 4000).*

## **Scripts & HTTPS Configuration**

We have customized the startup scripts to ensure the application runs securely over HTTPS on all operating systems (Windows, Mac, Linux).

### **The "start" Script**

In qli003-client/package.json, the start command is configured as follows:  
"scripts": {  
  "start": "cross-env HTTPS=true node node\_modules/react-scripts/bin/react-scripts.js start"  
}

* **cross-env HTTPS=true**: This forces the React development server to launch in Secure Mode (HTTPS).  
* **node node\_modules/...**: This uses the absolute path to the executable. This is crucial for Windows compatibility, preventing "Command not found" errors that often occur with standard scripts.

### **Custom Batch Scripts**

For convenience, we included start-app-windows.bat and start-app-mac.command. These scripts automate the process of opening two terminal windows (one for the API, one for the Client) and executing the run commands simultaneously. If you need to change ports or launch arguments, edit these files in any text editor.

## **Running Tests**

The project includes comprehensive frontend unit tests covering modal interactions, form validation, and network mocking.

### **1\. Run All Tests**

To run the full test suite in interactive mode:  
cd qli003-client  
npm test

### **2\. Run Specific Tests**

To run tests only for a specific component (e.g., the Update Modal):  
npm test \-- \-t EquipmentUpdateModal

### **3\. CI Mode (Run Once)**

To run all tests once and exit (useful for automated pipelines):  
npm test \-- \--watchAll=false

### **4\. PowerShell Troubleshooting**

If you are on Windows and see an error about execution policies when running tests, run this command in PowerShell to allow the scripts:  
Set-ExecutionPolicy \-ExecutionPolicy RemoteSigned \-Scope CurrentUser

### **Test Coverage Areas**

* **EquipmentDetailsModal**: Verifies modal rendering and close behavior.  
* **EquipmentSignOutModal**: Tests sign-out workflows and name field validation.  
* **EquipmentUpdateModal**: Tests description validation and update submission.  
* **App.test.js**: Verifies main application rendering and headers.

## **Troubleshooting & Tips**

* Browser "Not Secure" Warning:  
  Because we are using a self-signed development certificate, your browser will warn you that the connection is "Not Secure". This is normal for local development. Click "Advanced" \-\> "Proceed to localhost (unsafe)" to continue.  
* Firewall Blocking (Mobile Testing):  
  If you configured the IP address correctly but your phone still cannot connect, your computer's firewall is likely blocking the connection. You must create an Inbound Rule in Windows Defender Firewall to allow traffic on ports 3000 (React) and 7058 (.NET API).  
* Database Connection Errors:  
  Ensure your MySQL server is actually running. If using XAMPP or MySQL Workbench, verify the service status green light.

## **Release Notes & Milestones**

### **Milestone 1: Core Architecture**

* Established connection between **MySQL**, **.NET WebAPI**, and **React**.  
* Implemented **SignalR** for real-time bi-directional communication.  
* Basic UI created to display equipment tables and allow real-time description editing.

### **Milestone 2: Foundation for Features**

* Began work on updating the User Interface.  
* Started implementation of Tailwind CSS Modals.  
* Initial backend work for mailing features (Work in Progress).

### **Milestone 3: UI Overhaul & Logging**

* **Complete UI Overhaul:** Finalized the switch to Tailwind CSS and dynamic tables.  
* **Transaction Logging:** Implemented full tracking for Check-In/Check-Out actions.  
* **Exports:** Added functionality to export inventory summaries as PDF reports.

### **Milestone 4: Security, Automation & Testing**

* **Admin Security:** Implemented Admin Login functionality; restricted editing, deleting, and configuration features to authenticated admins only.  
* **Mailing Complete:** Finalized automated low-stock scanning and "History Report" emailing.  
* **Testing:** Added comprehensive unit tests for frontend components and modals.

### **Milestone 5: Polish & Documentation**

* Code cleanup and optimization.  
* Finalized documentation and README clarification.

## **Active Branches**

* **main**: Contains the stable, production-ready code with all features listed above.