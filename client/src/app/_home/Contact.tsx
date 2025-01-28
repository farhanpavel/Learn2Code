import React from "react";

export default function Contact() {
  return (
    <div className="mb-10">
      <div className="text-white  text-center p-5 mt-10 font-bold space-y-4">
        <h1 className="text-2xl uppercase">Want to Reach Us ?</h1>
        <p className="text-xs font-light">
          We welcome your inquiries and are happy to assist you. Please feel
          free to reach out.
        </p>
      </div>
      <div className="flex justify-evenly p-3 container mx-auto">
        <div className="w-[44%]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14599.085396109498!2d90.34028643169907!3d23.826728486916085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c111532048a3%3A0x680f15e7bb879b2a!2sEastern%20Housing%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1738050175638!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: "0" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full rounded-lg"
          ></iframe>
        </div>
        <div className="w-1/3 ">
          <form action="#" className="space-y-3">
            <div className="space-y-4">
              <label className=" mb-2 text-sm font-medium  dark:text-gray-300 text-white">
                Your Email
              </label>
              <input
                type="email"
                className="shadow-sm w-full  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                placeholder="name@gmail.com"
                required
              />
            </div>

            <div className="space-y-4">
              <label className=" mb-2 text-sm font-medium text-white dark:text-gray-300">
                Subject
              </label>
              <input
                type="text"
                className=" p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                placeholder="Let us know how we can help you"
                required
              />
            </div>

            <div className="space-y-2">
              <label className=" mb-2 text-sm font-medium text-white dark:text-gray-400">
                Your Message
              </label>
              <textarea
                rows={10}
                className=" p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Leave a comment..."
              ></textarea>
            </div>

            <div className="text-center ">
              <button
                type="submit"
                className="py-3 px-5 text-sm font-medium text-center text-white border-white border-[1px] rounded-full bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-black dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
