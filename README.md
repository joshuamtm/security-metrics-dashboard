# Security Metrics Dashboard

A flexible React-based web application that serves as an executive security metrics dashboard. This dashboard allows organizations to upload security metrics data and visualize key performance indicators through interactive charts and executive summaries.

## 🚀 Live Demo

**[View Dashboard](https://joshuamtm.github.io/security-metrics-dashboard/)**

**🔐 Login Credentials:** The dashboard is password-protected. Use password: `SecureMetrics2024!`

## ✨ Features

- **🔐 Password Protection**: Secure access with session-based authentication
- **📁 File Upload**: Drag-and-drop interface for CSV and Excel files
- **📊 Executive Summary**: Overview cards showing security posture and metric status  
- **📈 Individual Metric Cards**: Detailed view of each metric with trends and sparklines
- **📉 Trend Analysis**: Interactive charts with metric selection and date range filtering
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Real-time Processing**: Instant data parsing and visualization
- **🎯 Status Tracking**: Automatic categorization (On Track/At Risk/Off Track)

## 🎯 Quick Start

### Option 1: Use the Live Demo
Simply visit **[https://joshuamtm.github.io/security-metrics-dashboard/](https://joshuamtm.github.io/security-metrics-dashboard/)** to start using the dashboard immediately. No installation required!

### Option 2: Run Locally

#### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager

#### Installation
```bash
git clone https://github.com/joshuamtm/security-metrics-dashboard.git
cd security-metrics-dashboard
npm install
```

#### Running the Application
```bash
npm start
```

The application will open at http://localhost:3000

## 📖 How to Use

### 1. **Upload Your Data**
   - Visit the dashboard and drag & drop a CSV or Excel file
   - Or click the upload area to browse and select a file
   - **Don't have data?** Click "Download Sample File" to get a template

### 2. **Expected Data Format**
   Your file should include these columns:
   - `Metric`: Name of the security metric
   - `Target`: Target value (e.g., "90+", "85%") 
   - `Reference`: Optional URL for metric reference
   - **Date columns**: Format as "MMM-YY" (e.g., "Jan-25", "Feb-25")

   **Example:**
   ```csv
   Metric,Target,Reference,Jan-25,Feb-25,Mar-25
   Security Scorecard Score,90+,https://example.com,91,89,92
   Device Compliance,85%,https://example.com,78%,80%,82%
   ```

### 3. **Explore Your Dashboard**
   - 📊 **Executive Summary**: Get an instant overview of your security posture
   - 📈 **Metric Cards**: View individual metrics with trends and status indicators
   - 📉 **Trend Analysis**: Select metrics to compare and adjust date ranges
   - 🎯 **Status Indicators**: Automatically categorized as On Track, At Risk, or Off Track

## 🔒 Example Security Metrics

The dashboard can track any security metrics your organization needs. Common examples include:

| Metric | Target | Description |
|--------|--------|-------------|
| 🛡️ Security Scorecard Score | 90+ | Overall security posture rating |
| 💻 Device Compliance | 85% | Percentage of compliant devices |
| 🔐 Secure Score | 75% | Security configuration score |
| 🔒 Encrypted Endpoints | 98% | Percentage of encrypted devices |
| 🚨 Critical Findings Remediation | 100% | Remediation completion rate |
| 🎓 Security Training Compliance | 75% | Staff training completion rate |
| 🎣 Phishing Simulation Score | 70+ | Phishing simulation performance |
| 🔑 Password Manager Health | 80 | Password management health |
| 👥 Password Manager Adoption | 80%+ | Active password manager usage |
| 🌐 Data Exposure Points | ↓ | Decrease in exposed data points |

## 🛠️ Development

### Project Structure
```
src/
├── components/           # React components
│   ├── Dashboard.tsx     # Main dashboard layout
│   ├── FileUpload.tsx    # File upload component
│   ├── ExecutiveSummary.tsx  # Summary cards
│   ├── MetricCard.tsx    # Individual metric display
│   ├── TrendChart.tsx    # Interactive charts
│   ├── MetricSelector.tsx    # Chart metric selection
│   ├── Login.tsx         # Login component
│   └── ProtectedRoute.tsx # Route protection wrapper
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication context
├── utils/               # Utility functions
│   ├── dataParser.ts    # CSV/Excel parsing logic
│   ├── calculations.ts  # Metric calculations
│   └── constants.ts     # App constants
├── types/               # TypeScript definitions
│   └── metrics.ts       # Data type definitions
└── App.tsx              # Root component
```

### 🚀 Tech Stack
- ⚛️ **React** with TypeScript for type safety
- 🎨 **Tailwind CSS** for responsive styling
- 📊 **Recharts** for interactive data visualization
- 📄 **PapaParse** for CSV file processing
- 📊 **SheetJS** for Excel file processing
- 📁 **React Dropzone** for drag-and-drop uploads

### 📦 Building for Production
```bash
npm run build
```

### 🚀 Deploying to GitHub Pages
```bash
npm run deploy
```

### 🔐 Authentication Configuration

The dashboard includes password protection with session-based authentication. To change the password:

1. Edit `src/contexts/AuthContext.tsx`
2. Update the `PASSWORD_HASH` constant with your new password hash
3. The current implementation uses a simple hash function for demonstration

**Note:** For production use, consider:
- Implementing proper backend authentication
- Using bcrypt or similar for password hashing
- Adding user management capabilities
- Implementing password reset functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

If you encounter any issues or have questions, please [open an issue](https://github.com/joshuamtm/security-metrics-dashboard/issues) on GitHub.