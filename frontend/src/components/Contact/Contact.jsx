import "./Contact.css";

function Contact() {
  return (
    <section className="contact">
      <h2>Contact Us</h2>

      <div className="contact-container">

        <div className="contact-card">
          <h3>📍 Address</h3>
          <p>123 Health Street, Hyderabad, India</p>
        </div>

        <div className="contact-card">
          <h3>📞 Phone</h3>
          <p>+91 9876543210</p>
        </div>

        <div className="contact-card">
          <h3>📧 Email</h3>
          <p>info@medicare.com</p>
        </div>

      </div>
    </section>
  );
}

export default Contact;


