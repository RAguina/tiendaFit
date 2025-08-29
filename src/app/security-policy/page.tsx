import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security Policy - TiendaFit',
  description: 'Security vulnerability reporting policy and guidelines for TiendaFit platform',
  robots: 'index, follow'
}

export default function SecurityPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Security Policy
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Responsible Security Disclosure
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                TiendaFit takes security seriously and values the security research community. 
                We encourage responsible disclosure of security vulnerabilities and are committed 
                to working with researchers to address issues promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Reporting Security Issues
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Contact Information
                </h3>
                <ul className="text-blue-800 dark:text-blue-200 space-y-2">
                  <li><strong>Email:</strong> security@tiendafit.com</li>
                  <li><strong>GitHub:</strong> <a href="https://github.com/RAguina/tiendaFit/security/advisories/new" className="underline">Security Advisory</a></li>
                  <li><strong>Response Time:</strong> Within 48 hours</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Scope
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                    ✅ In Scope
                  </h3>
                  <ul className="text-green-800 dark:text-green-200 space-y-2">
                    <li>• Main application security</li>
                    <li>• API endpoints vulnerabilities</li>
                    <li>• Authentication/authorization flaws</li>
                    <li>• Payment processing issues</li>
                    <li>• Data handling vulnerabilities</li>
                    <li>• Cross-site scripting (XSS)</li>
                    <li>• SQL injection</li>
                    <li>• CSRF attacks</li>
                  </ul>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
                    ❌ Out of Scope
                  </h3>
                  <ul className="text-red-800 dark:text-red-200 space-y-2">
                    <li>• Third-party services</li>
                    <li>• Social engineering</li>
                    <li>• Physical security</li>
                    <li>• DoS/DDoS attacks</li>
                    <li>• Spam or content issues</li>
                    <li>• Self-XSS</li>
                    <li>• Known vulnerabilities without PoC</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Reporting Guidelines
              </h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <ol className="text-yellow-800 dark:text-yellow-200 space-y-3">
                  <li><strong>1.</strong> Provide detailed description of the vulnerability</li>
                  <li><strong>2.</strong> Include clear steps to reproduce the issue</li>
                  <li><strong>3.</strong> Provide proof of concept when applicable</li>
                  <li><strong>4.</strong> Assess the potential impact and risk level</li>
                  <li><strong>5.</strong> Avoid accessing sensitive user data</li>
                  <li><strong>6.</strong> Do not perform actions that could harm users</li>
                  <li><strong>7.</strong> Allow reasonable time for investigation and resolution</li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Response Process
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Acknowledgment</h3>
                    <p className="text-gray-600 dark:text-gray-400">Within 48 hours of receiving your report</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Assessment</h3>
                    <p className="text-gray-600 dark:text-gray-400">Vulnerability validation and impact analysis within 1 week</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Resolution</h3>
                    <p className="text-gray-600 dark:text-gray-400">Fix development and deployment (30 days for critical issues)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Disclosure</h3>
                    <p className="text-gray-600 dark:text-gray-400">Public disclosure coordination with the researcher</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Safe Harbor
              </h2>
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We commit to not pursue legal action against security researchers who:
                </p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-2 ml-6">
                  <li>• Follow responsible disclosure practices</li>
                  <li>• Act in good faith to help improve security</li>
                  <li>• Avoid privacy violations and service disruption</li>
                  <li>• Do not access or modify user data without permission</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Recognition
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We believe in recognizing the valuable contributions of security researchers. 
                Valid security reports may be eligible for:
              </p>
              <ul className="text-gray-600 dark:text-gray-400 space-y-2 ml-6 mb-4">
                <li>• Public acknowledgment (with your consent)</li>
                <li>• Hall of Fame listing</li>
                <li>• Swag and merchandise</li>
                <li>• Potential monetary rewards for critical findings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Security Measures
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                TiendaFit implements multiple layers of security including:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                  <li>• Content Security Policy (CSP)</li>
                  <li>• Strict Transport Security</li>
                  <li>• Certificate Transparency monitoring</li>
                  <li>• Rate limiting and DDoS protection</li>
                  <li>• Input validation and sanitization</li>
                </ul>
                <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                  <li>• Secure authentication (NextAuth.js)</li>
                  <li>• Database security (Prisma ORM)</li>
                  <li>• API security and authorization</li>
                  <li>• Regular security audits</li>
                  <li>• Automated vulnerability scanning</li>
                </ul>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              This security policy is effective as of January 27, 2025. We may update this policy periodically.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}