import "./About.css";

function About() {
  return (
    <section className="about">

      <div className="about-left">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600"
          alt="Hospital"
        />
      </div>

      <div className="about-right">
        <h2>About Our Hospital</h2>

        <p>
          MediCare Hospital has been serving patients with world-class
          healthcare services for over 20 years. Our experienced doctors,
          advanced technology, and caring staff ensure the best treatment for
          every patient.
        </p>

        <button>Read More</button>
      </div>

    </section>
  );
}

export default About;


