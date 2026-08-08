import { useState } from "react";

import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import Services from "./components/Services/Services";
import Doctors from "./components/Doctors/Doctors";
import Appointment from "./components/Appointment/Appointment";
import Footer from "./components/Footer/Footer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navbar setIsLoggedIn={setIsLoggedIn} />
          <Hero />
          <About />
          <Services />
          <Doctors />
          <Appointment />
          <Footer />
        </>
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
}

export default App;