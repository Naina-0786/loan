import React from 'react';

const TermsAndConditions: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Terms & Conditions
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Welcome to <a href="https://instantdhanicredit.com" className="text-blue-600 hover:underline">instantdhanicredit.com</a>. By accessing or using our website or services, you agree to these Terms & Conditions. Please read them carefully before using the app. If you do not agree with these terms, please do not use our services.
                </p>

                <div className="space-y-8">
                    {/* Section 1: Introduction */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">1. Introduction</h2>
                        <p className="text-gray-600">
                            Welcome to <a href="https://instantdhanicredit.com" className="text-blue-600 hover:underline">instantdhanicredit.com</a>. By accessing or using our website or services, you ("User") agree to these Terms & Conditions. Please read them carefully before using the app. If you do not agree with these terms, please do not use our services.
                        </p>
                    </section>

                    {/* Section 2: Eligibility */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">2. Eligibility</h2>
                        <ul className="list-disc pl-5 text-gray-600 space-y-2">
                            <li>You must be 18 years or older.</li>
                            <li>You must be a resident of India.</li>
                            <li>You must provide valid KYC documents (ID proof, address proof, income proof, etc.).</li>
                            <li>Approval of loan is subject to our internal credit checks and risk assessment.</li>
                        </ul>
                    </section>

                    {/* Section 3: Services Offered */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">3. Services Offered</h2>
                        <ul className="list-disc pl-5 text-gray-600 space-y-2">
                            <li>Instant personal loans, micro loans, and other credit facilities.</li>
                            <li>Loan disbursal and repayment through authorized bank accounts by department members.</li>
                            <li>Credit reporting to registered credit bureaus.</li>
                        </ul>
                    </section>

                    {/* Section 4: User Responsibilities */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">4. User Responsibilities</h2>
                        <ul className="list-disc pl-5 text-gray-600 space-y-2">
                            <li>Provide accurate and updated information during registration.</li>
                            <li>Maintain confidentiality of your account details (email, OTP, passwords).</li>
                            <li>Repay loan on or before due date.</li>
                            <li>Do not use the loan for illegal or restricted purposes.</li>
                        </ul>
                    </section>

                    {/* Section 5: Loan Approval & Disbursement */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">5. Loan Approval & Disbursement</h2>
                        <ul className="list-disc pl-5 text-gray-600 space-y-2">
                            <li>Loan approval is not guaranteed and depends on credit score, repayment capacity, and other factors.</li>
                            <li>Disbursement timelines may vary depending on banking hours and verification process.</li>
                        </ul>
                    </section>

                    {/* Section 6: Interest Rates & Charges */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">6. Interest Rates & Charges</h2>
                        <ul className="list-disc pl-5 text-gray-600 space-y-2">
                            <li>Interest rates, processing fees, and late penalties are clearly displayed before loan confirmation.</li>
                            <li>By accepting the loan, you agree to pay these charges as per agreed schedule.</li>
                            <li>All charges are subject to government taxes (GST/VAT) where applicable.</li>
                        </ul>
                    </section>

                    {/* Section 7: Repayment Terms */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">7. Repayment Terms</h2>
                        <ul className="list-disc pl-5 text-gray-600 space-y-2">
                            <li>Repayments can be made via UPI, Net Banking, Debit Card, or Auto-Debit.</li>
                            <li>Late payments will attract penalty charges and may affect your credit score.</li>
                            <li>Prepayment or foreclosure may be allowed with or without additional charges, as per policy.</li>
                        </ul>
                    </section>

                    {/* Section 8: Privacy & Data Usage */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">8. Privacy & Data Usage</h2>
                        <ul className="list-disc pl-5 text-gray-600 space-y-2">
                            <li>We collect personal and financial data for verification and loan processing.</li>
                            <li>Your data is securely stored and will not be shared except with:</li>
                            <ul className="list-circle pl-5 space-y-2">
                                <li>Credit bureaus</li>
                                <li>Regulatory authorities (if required)</li>
                                <li>Service partners for loan processing</li>
                            </ul>
                            <li>We do not sell your data to third parties.</li>
                        </ul>
                    </section>

                    {/* Section 9: Default & Recovery */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">9. Default & Recovery</h2>
                        <p className="text-gray-600 mb-2">In case of default, recovery actions may include:</p>
                        <ul className="list-disc pl-5 text-gray-600 space-y-2">
                            <li>Reminders via SMS, calls, or emails.</li>
                            <li>Reporting to credit bureaus.</li>
                            <li>Legal action under applicable laws.</li>
                        </ul>
                    </section>

                    {/* Section 10: Limitation of Liability */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">10. Limitation of Liability</h2>
                        <p className="text-gray-600 mb-2">We are not responsible for:</p>
                        <ul className="list-disc pl-5 text-gray-600 space-y-2">
                            <li>Delays due to bank failures, system errors, or force majeure events.</li>
                            <li>Any indirect or consequential losses.</li>
                        </ul>
                    </section>

                    {/* Section 11: Amendments */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">11. Amendments</h2>
                        <p className="text-gray-600">
                            We may modify these terms from time to time. Updates will be available in the app. Continued usage means you accept the updated terms.
                        </p>
                    </section>

                    {/* Section 12: Governing Law */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">12. Governing Law</h2>
                        <p className="text-gray-600">
                            These terms are governed by the laws of India, and disputes shall be subject to the jurisdiction of the courts in India.
                        </p>
                    </section>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-sm">
                        For any queries, contact us at <a href="mailto:care@dhani-loans.com" className="text-blue-600 hover:underline">care@dhani-loans.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;