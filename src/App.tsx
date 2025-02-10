import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SupplyChainDashboard from './pages/SupplyChainDashboard';
import ProductionPlanning from './pages/ProductionPlanning';
import SchedulingView from './pages/SchedulingView';
import ShopFloor from './pages/ShopFloor';
import QualityControl from './pages/QualityControl';
import MasterSchedule from './pages/MasterSchedule';
import PublishConfirmation from './pages/PublishConfirmation';
import OperatorDashboard from './pages/OperatorDashboard';
import BatchExecution from './pages/BatchExecution';
import BatchDataSummary from './pages/BatchDataSummary';
import OrderTracker from './pages/OrderTracker';
import OTIFAnalytics from './pages/OTIFAnalytics';
import RegulatoryCompliance from './pages/RegulatoryCompliance';
import FeedbackPortal from './pages/FeedbackPortal';
import BatchArchive from './pages/BatchArchive';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<SupplyChainDashboard />} />
          <Route path="/production" element={<ProductionPlanning />} />
          <Route path="/production/schedule" element={<SchedulingView />} />
          <Route path="/shop-floor" element={<ShopFloor />} />
          <Route path="/quality" element={<QualityControl />} />
          <Route path="/master-schedule" element={<MasterSchedule />} />
          <Route path="/master-schedule/publish" element={<PublishConfirmation />} />
          <Route path="/operator-dashboard" element={<OperatorDashboard />} />
          <Route path="/batch-execution/:batchId" element={<BatchExecution />} />
          <Route path="/batch-data-summary/:batchId" element={<BatchDataSummary />} />
          <Route path="/order-tracker" element={<OrderTracker />} />
          <Route path="/otif-analytics" element={<OTIFAnalytics />} />
          <Route path="/compliance" element={<RegulatoryCompliance />} />
          <Route path="/feedback" element={<FeedbackPortal />} />
          <Route path="/batch-archive" element={<BatchArchive />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
