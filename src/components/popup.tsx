import { useState, useEffect } from 'react';
import { X, Send, User, Mail, MessageSquare } from 'lucide-react';
import api from '../api/apiClient';
import { toast } from 'sonner';
import { AxiosError } from 'axios';



export function ContactPopup() {
    const [isOpen, setIsOpen] = useState(false);

    // Auto-open popup after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        number: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.number || !formData.message) {
            alert('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await api.post("/popup/create", {...formData, phoneNumber: formData.number});
            if (res.data.success) {
                toast.success(res.data.message || "Message sent successfully");

                setIsSubmitting(false);
                setSubmitted(true);
            }


        } catch (error) {
            if(error instanceof AxiosError){
                toast.error(error.response?.data.message || "Something went wrong");
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setIsSubmitting(false);
        }

    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
                <span className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Get In Touch
                </span>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    {/* Modal Container */}
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 z-10"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Content */}
                        <div className="relative p-8">
                            {!submitted ? (
                                <>
                                    {/* Header */}
                                    <div className="text-center mb-8">
                                        <div className="inline-block p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
                                            <MessageSquare className="w-8 h-8 text-white" />
                                        </div>
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                            Let's Connect
                                        </h2>
                                        <p className="text-gray-600">We'd love to hear from you!</p>
                                    </div>

                                    {/* Input Fields */}
                                    <div className="space-y-5">
                                        {/* Name Input */}
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Your Name"
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-300"
                                            />
                                        </div>

                                        {/* Email Input */}
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Your Email"
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-300"
                                            />
                                        </div>

                                        {/* Number Input */}
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="tel"
                                                name="number"
                                                value={formData.number}
                                                onChange={handleChange}
                                                placeholder="Your Phone Number"
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-300"
                                            />
                                        </div>

                                        {/* Message Input */}
                                        <div className="relative">
                                            <div className="absolute left-4 top-4 text-gray-400">
                                                <MessageSquare className="w-5 h-5" />
                                            </div>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Your Message"
                                                rows={4}
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-300 resize-none"
                                            ></textarea>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                /* Success State */
                                <div className="text-center py-8 animate-fadeIn">
                                    <div className="inline-block p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                                    <p className="text-gray-600">We'll get back to you soon.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
        </div>
    );
}