// ================================================================
// ROUTE DEBUGGER - NO ROUTER INSIDE!
// ================================================================
// src/components/common/RouteDebugger.jsx

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteDebugger = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log("=========================================");
    console.log("ROUTE DEBUGGER");
    console.log("=========================================");
    console.log("Current URL:", window.location.href);
    console.log("Pathname:", location.pathname);
    console.log("Search:", location.search);
    console.log("=========================================");
    
    if (location.pathname === "/payment/verify") {
      console.log("/payment/verify route MATCHED!");
      const params = new URLSearchParams(location.search);
      console.log("Reference:", params.get("reference"));
    } else {
      console.log("/payment/verify route NOT matched");
      console.log("Current path is:", location.pathname);
    }
    console.log("=========================================\n");
  }, [location]);

  return null;
};

export default RouteDebugger;