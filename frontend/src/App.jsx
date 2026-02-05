import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Product from "./pages/Product";
import Contact from "./pages/Contact";
import AddOrder from "./pages/AddOrder";
import BulkOrder from "./pages/BulkOrder";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import SmoothScroll from "./components/SmoothScroll";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = () => setIsLoaded(true);

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-stone-50">
        {/* Preloader */}
        {loading && (
          <Loader loaded={isLoaded} onComplete={() => setLoading(false)} />
        )}

        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<Product />} />
          <Route path="/menu" element={<Product />} />
          <Route path="/add-order" element={<AddOrder />} />
          <Route path="/bulkorder" element={<BulkOrder />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default App;
