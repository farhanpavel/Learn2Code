import React from "react";
import {
  MessageSquare,
  MapPin,
  Phone,
  Mail,
  Send,
  User,
  FileText,
} from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#10343C]">
      {/* Header Section */}
      <div className="text-center py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-teal-200 blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-blue-200 blur-3xl animate-float"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm animate-pulse-slow">
              <MessageSquare size={28} className="text-teal-200" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-teal-200">Get in</span> Touch
          </h1>

          <p className="text-gray-300 max-w-2xl mx-auto">
            We're here to help and answer any questions you might have. We look
            forward to hearing from you.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Contact Info & Map */}
          <div className="lg:w-1/2 space-y-8">
            {/* Contact Info Cards */}
            <div className="grid gap-6">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-200/10 rounded-full">
                    <MapPin className="text-teal-200" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Our Location</h3>
                    <p className="text-gray-400 text-sm">
                      Eastern Housing, Dhaka
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-200/10 rounded-full">
                    <Phone className="text-teal-200" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Phone Number</h3>
                    <p className="text-gray-400 text-sm">+880 1234-567890</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-200/10 rounded-full">
                    <Mail className="text-teal-200" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Email Address</h3>
                    <p className="text-gray-400 text-sm">contact@example.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14599.085396109498!2d90.34028643169907!3d23.826728486916085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c111532048a3%3A0x680f15e7bb879b2a!2sEastern%20Housing%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1738050175638!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:w-1/2">
            <form className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl space-y-6">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-200">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  className="w-full bg-white/10 border border-white/10 rounded-lg py-3 px-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-200/50 transition-all duration-300"
                  placeholder="Your Name"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-200">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  className="w-full bg-white/10 border border-white/10 rounded-lg py-3 px-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-200/50 transition-all duration-300"
                  placeholder="Your Email"
                />
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-200">
                  <FileText size={20} />
                </div>
                <input
                  type="text"
                  name="subject"
                  className="w-full bg-white/10 border border-white/10 rounded-lg py-3 px-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-200/50 transition-all duration-300"
                  placeholder="Subject"
                />
              </div>

              <div className="relative">
                <textarea
                  name="message"
                  rows={6}
                  className="w-full bg-white/10 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-200/50 transition-all duration-300"
                  placeholder="Your Message"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-200 hover:bg-teal-300 text-[#10343C] font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-300"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
